<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../services/PDFService.php';

class AdminController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    private static function imageUrl(?string $path): string {
        if (!$path) return '';
        return str_starts_with($path, 'http') ? $path : BASE_URL . '/' . $path;
    }

    // GET /admin/dashboard
    public function dashboard(): never {
        $stats = [];

        $stats['total_quotes']    = $this->db->query('SELECT COUNT(*) FROM quotes')->fetchColumn();
        $stats['pending_quotes']  = $this->db->query('SELECT COUNT(*) FROM quotes WHERE status = "submitted"')->fetchColumn();
        $stats['total_revenue']   = $this->db->query('SELECT COALESCE(SUM(total_amount), 0) FROM quotes WHERE status IN ("paid","dispatched")')->fetchColumn();
        $stats['total_customers'] = $this->db->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $stats['total_products']  = $this->db->query('SELECT COUNT(*) FROM products WHERE status = "active"')->fetchColumn();
        $stats['total_categories']= $this->db->query('SELECT COUNT(*) FROM categories WHERE status = "active"')->fetchColumn();

        // Recent quotes
        $stats['recent_quotes'] = $this->db->query('
            SELECT q.*, u.name as customer_name, u.phone as customer_phone
            FROM quotes q
            LEFT JOIN users u ON u.id = q.user_id
            ORDER BY q.created_at DESC LIMIT 10
        ')->fetchAll();

        // Monthly revenue (last 6 months)
        $stats['monthly_revenue'] = $this->db->query("
            SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
                   SUM(total_amount) as revenue,
                   COUNT(*) as count
            FROM quotes
            WHERE status IN ('paid','dispatched') AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY month ORDER BY month ASC
        ")->fetchAll();

        respond(200, $stats);
    }

    // Categories CRUD
    public function categories(string $method, ?string $id): never {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $stmt = $this->db->prepare('SELECT * FROM categories WHERE id = ?');
                    $stmt->execute([$id]);
                    respond(200, $stmt->fetch() ?: respond(404, 'Not found'));
                }
                $rows = $this->db->query('SELECT * FROM categories ORDER BY parent_id ASC, sort_order ASC')->fetchAll();
                respond(200, $rows);

            case 'POST':
                $data = input();
                $stmt = $this->db->prepare('INSERT INTO categories (name, slug, image, description, parent_id, sort_order, status) VALUES (?,?,?,?,?,?,?)');
                $stmt->execute([$data['name'], $data['slug'], $data['image'] ?? null, $data['description'] ?? null, $data['parent_id'] ?? null, $data['sort_order'] ?? 0, $data['status'] ?? 'active']);
                respond(201, ['id' => $this->db->lastInsertId(), 'message' => 'Category created']);

            case 'PUT':
                $data = input();
                $stmt = $this->db->prepare('UPDATE categories SET name=?, slug=?, image=?, description=?, parent_id=?, sort_order=?, status=? WHERE id=?');
                $stmt->execute([$data['name'], $data['slug'], $data['image'] ?? null, $data['description'] ?? null, $data['parent_id'] ?? null, $data['sort_order'] ?? 0, $data['status'] ?? 'active', $id]);
                respond(200, ['message' => 'Category updated']);

            case 'DELETE':
                $this->db->prepare('UPDATE categories SET status = "inactive" WHERE id = ?')->execute([$id]);
                respond(200, ['message' => 'Category deactivated']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Category Image Upload — POST /admin/categories/:id/image
    public function categoryImage(string $categoryId): never {
        if (!isset($_FILES['image'])) respond(400, 'No image file');
        $file = $_FILES['image'];
        if ($file['error'] !== UPLOAD_ERR_OK) respond(400, 'Upload error: ' . $file['error']);

        $allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!in_array($file['type'], $allowed)) respond(400, 'Only JPG, PNG, WEBP allowed');
        if ($file['size'] > 5 * 1024 * 1024) respond(400, 'Max file size is 5MB');

        $uploadDir = __DIR__ . '/../uploads/categories/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = 'cat_' . $categoryId . '_' . uniqid() . '.' . $ext;
        $dest     = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) respond(500, 'Failed to save image');

        $storedPath = 'uploads/categories/' . $filename;
        $this->db->prepare('UPDATE categories SET image = ? WHERE id = ?')->execute([$storedPath, $categoryId]);

        respond(200, ['image_path' => self::imageUrl($storedPath)]);
    }

    // Products CRUD
    public function products(string $method, ?string $id): never {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $stmt = $this->db->prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ?');
                    $stmt->execute([$id]);
                    $product = $stmt->fetch();
                    if (!$product) respond(404, 'Not found');

                    $stmt = $this->db->prepare('SELECT * FROM product_images WHERE product_id = ?');
                    $stmt->execute([$id]);
                    $product['images'] = $stmt->fetchAll();

                    $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ?');
                    $stmt->execute([$id]);
                    $product['variants'] = $stmt->fetchAll();

                    $stmt = $this->db->prepare('SELECT * FROM product_pricing_rules WHERE product_id = ?');
                    $stmt->execute([$id]);
                    $product['pricing_rules'] = $stmt->fetch() ?: null;

                    $stmt = $this->db->prepare('SELECT * FROM product_specs WHERE product_id = ? ORDER BY sort_order');
                    $stmt->execute([$id]);
                    $product['specs'] = $stmt->fetchAll();

                    respond(200, $product);
                }
                $rows = $this->db->query('
                    SELECT p.*, c.name as category_name,
                           (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
                    FROM products p
                    LEFT JOIN categories c ON c.id = p.category_id
                    ORDER BY p.category_id ASC, p.sort_order ASC
                ')->fetchAll();
                foreach ($rows as &$r) {
                    $r['primary_image'] = self::imageUrl($r['primary_image'] ?? '');
                }
                respond(200, $rows);

            case 'POST':
                $data = input();
                $stmt = $this->db->prepare('INSERT INTO products (category_id, name, slug, description, short_description, product_type, brand, stock_status, is_featured, sort_order, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
                $stmt->execute([$data['category_id'], $data['name'], $data['slug'], $data['description'] ?? null, $data['short_description'] ?? null, $data['product_type'] ?? 'standard', $data['brand'] ?? null, $data['stock_status'] ?? 'in_stock', $data['is_featured'] ?? 0, $data['sort_order'] ?? 0, $data['status'] ?? 'active']);
                respond(201, ['id' => $this->db->lastInsertId(), 'message' => 'Product created']);

            case 'PUT':
                $data = input();
                $stmt = $this->db->prepare('UPDATE products SET category_id=?, name=?, slug=?, description=?, short_description=?, product_type=?, brand=?, stock_status=?, is_featured=?, sort_order=?, status=? WHERE id=?');
                $stmt->execute([$data['category_id'], $data['name'], $data['slug'], $data['description'] ?? null, $data['short_description'] ?? null, $data['product_type'], $data['brand'] ?? null, $data['stock_status'], $data['is_featured'] ?? 0, $data['sort_order'] ?? 0, $data['status'], $id]);
                respond(200, ['message' => 'Product updated']);

            case 'DELETE':
                $this->db->prepare('UPDATE products SET status = "inactive" WHERE id = ?')->execute([$id]);
                respond(200, ['message' => 'Product deactivated']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Quotes management
    public function quotes(string $method, ?string $id): never {
        switch ($method) {
            case 'GET':
                if ($id) {
                    $stmt = $this->db->prepare('SELECT q.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone, u.company_name FROM quotes q LEFT JOIN users u ON u.id = q.user_id WHERE q.id = ?');
                    $stmt->execute([$id]);
                    $quote = $stmt->fetch();
                    if (!$quote) respond(404, 'Not found');

                    $stmt = $this->db->prepare('SELECT * FROM quote_items WHERE quote_id = ?');
                    $stmt->execute([$id]);
                    $quote['items'] = $stmt->fetchAll();

                    $stmt = $this->db->prepare('SELECT * FROM quote_status_history WHERE quote_id = ? ORDER BY created_at ASC');
                    $stmt->execute([$id]);
                    $quote['status_history'] = $stmt->fetchAll();

                    respond(200, $quote);
                }

                $status   = $_GET['status'] ?? null;
                $whereSql = $status ? 'WHERE q.status = ?' : '';
                $params   = $status ? [$status] : [];

                $stmt = $this->db->prepare("
                    SELECT q.*, u.name as customer_name, u.phone as customer_phone,
                           COUNT(qi.id) as item_count
                    FROM quotes q
                    LEFT JOIN users u ON u.id = q.user_id
                    LEFT JOIN quote_items qi ON qi.quote_id = q.id
                    $whereSql
                    GROUP BY q.id
                    ORDER BY q.created_at DESC
                ");
                $stmt->execute($params);
                respond(200, $stmt->fetchAll());

            case 'PATCH':
                $data   = input();
                $quote  = $this->db->prepare('SELECT status FROM quotes WHERE id = ?');
                $quote->execute([$id]);
                $old    = $quote->fetch();
                if (!$old) respond(404, 'Quote not found');

                $this->db->prepare('UPDATE quotes SET status = ?, admin_notes = ? WHERE id = ?')
                         ->execute([$data['status'], $data['admin_notes'] ?? null, $id]);

                $this->db->prepare('INSERT INTO quote_status_history (quote_id, old_status, new_status, changed_by_type, changed_by_id, notes) VALUES (?, ?, ?, "admin", ?, ?)')
                         ->execute([$id, $old['status'], $data['status'], $GLOBALS['auth_user']['sub'], $data['notes'] ?? null]);

                // Trigger email notification based on new status
                try {
                    $stmtFull = $this->db->prepare('
                        SELECT q.*, u.name, u.email, u.phone, u.company_name, u.gst_number
                        FROM quotes q JOIN users u ON u.id = q.user_id WHERE q.id = ?
                    ');
                    $stmtFull->execute([$id]);
                    $fullQuote = $stmtFull->fetch();

                    if ($fullQuote) {
                        $customer = ['name' => $fullQuote['name'], 'email' => $fullQuote['email'], 'phone' => $fullQuote['phone'], 'company_name' => $fullQuote['company_name']];
                        $emailSvc = new EmailService();
                        $newStatus = $data['status'];

                        if ($newStatus === 'reviewed') {
                            $emailSvc->sendQuoteReviewed($fullQuote, $customer);
                        } elseif ($newStatus === 'confirmed') {
                            $pdfSvc  = new PDFService();
                            $stmtItems = $this->db->prepare('SELECT * FROM quote_items WHERE quote_id = ?');
                            $stmtItems->execute([$id]);
                            $items = $stmtItems->fetchAll();
                            $pdfPath = $pdfSvc->generateQuotePDF($fullQuote, $items, $customer);
                            $emailSvc->sendQuoteConfirmed($fullQuote, $customer, $pdfPath ?: null);
                        }
                    }
                } catch (\Throwable $e) {
                    error_log('Admin quote email error: ' . $e->getMessage());
                }

                respond(200, ['message' => 'Quote status updated']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Customers list
    public function customers(string $method, ?string $id): never {
        if ($id) {
            $stmt = $this->db->prepare('SELECT u.id, u.name, u.email, u.phone, u.company_name, u.gst_number, u.city, u.created_at, COUNT(q.id) as quote_count, COALESCE(SUM(q.total_amount),0) as total_value FROM users u LEFT JOIN quotes q ON q.user_id = u.id WHERE u.id = ? GROUP BY u.id');
            $stmt->execute([$id]);
            respond(200, $stmt->fetch() ?: respond(404, 'Not found'));
        }
        $rows = $this->db->query('SELECT u.id, u.name, u.email, u.phone, u.company_name, u.city, u.created_at, COUNT(q.id) as quote_count FROM users u LEFT JOIN quotes q ON q.user_id = u.id GROUP BY u.id ORDER BY u.created_at DESC')->fetchAll();
        respond(200, $rows);
    }

    // Payments list
    public function payments(): never {
        $rows = $this->db->query('
            SELECT p.*, q.quote_number, u.name as customer_name
            FROM payments p
            LEFT JOIN quotes q ON q.id = p.quote_id
            LEFT JOIN users u ON u.id = q.user_id
            ORDER BY p.created_at DESC
        ')->fetchAll();
        respond(200, $rows);
    }

    // Product Images — upload / delete / set-primary
    public function productImages(string $method, string $productId, ?string $imageId): never {
        switch ($method) {
            case 'GET':
                $stmt = $this->db->prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC');
                $stmt->execute([$productId]);
                $imgs = $stmt->fetchAll();
                foreach ($imgs as &$img) {
                    $img['image_path'] = self::imageUrl($img['image_path']);
                }
                respond(200, $imgs);

            case 'POST':
                if (!isset($_FILES['image'])) respond(400, 'No image file');
                $file = $_FILES['image'];
                if ($file['error'] !== UPLOAD_ERR_OK) respond(400, 'Upload error: ' . $file['error']);

                $allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!in_array($file['type'], $allowed)) respond(400, 'Only JPG, PNG, WEBP allowed');
                if ($file['size'] > 5 * 1024 * 1024) respond(400, 'Max file size is 5MB');

                // Try MinIO first; fall back to local uploads/products/ if unavailable
                $storedPath = null;
                $minioAvailable = file_exists(__DIR__ . '/../vendor/aws');
                if ($minioAvailable) {
                    try {
                        require_once __DIR__ . '/../services/MinioService.php';
                        $storedPath = (new MinioService())->upload($file['tmp_name'], $file['name']);
                    } catch (\Throwable $e) {
                        error_log('MinIO upload failed, falling back to local: ' . $e->getMessage());
                        $minioAvailable = false;
                    }
                }
                if (!$minioAvailable || !$storedPath) {
                    $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                    $filename = uniqid('img_', true) . '.' . $ext;
                    $dest     = __DIR__ . '/../uploads/products/' . $filename;
                    if (!move_uploaded_file($file['tmp_name'], $dest)) respond(500, 'Failed to save image');
                    $storedPath = 'uploads/products/' . $filename;
                }

                // First image for this product → make it primary automatically
                $countStmt = $this->db->prepare('SELECT COUNT(*) FROM product_images WHERE product_id = ?');
                $countStmt->execute([$productId]);
                $isPrimary = $countStmt->fetchColumn() == 0 ? 1 : 0;

                $this->db->prepare('INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES (?, ?, ?, 0)')
                         ->execute([$productId, $storedPath, $isPrimary]);
                $insertedId = $this->db->lastInsertId();
                respond(201, ['id' => $insertedId, 'image_path' => self::imageUrl($storedPath), 'is_primary' => $isPrimary]);

            case 'DELETE':
                if (!$imageId) respond(400, 'Image ID required');
                $stmt = $this->db->prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?');
                $stmt->execute([$imageId, $productId]);
                $img = $stmt->fetch();
                if (!$img) respond(404, 'Image not found');

                if (str_starts_with($img['image_path'], 'http')) {
                    // MinIO URL — delete from object storage
                    if (file_exists(__DIR__ . '/../vendor/aws')) {
                        try {
                            require_once __DIR__ . '/../services/MinioService.php';
                            (new MinioService())->delete($img['image_path']);
                        } catch (\Throwable $e) { error_log('MinIO delete: ' . $e->getMessage()); }
                    }
                } else {
                    // Local file — delete from disk
                    $localPath = __DIR__ . '/../' . ltrim($img['image_path'], '/');
                    if (file_exists($localPath)) @unlink($localPath);
                }

                $this->db->prepare('DELETE FROM product_images WHERE id = ?')->execute([$imageId]);

                // If deleted image was primary, promote the next available one
                if ($img['is_primary']) {
                    $next = $this->db->prepare('SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1');
                    $next->execute([$productId]);
                    $nextImg = $next->fetch();
                    if ($nextImg) {
                        $this->db->prepare('UPDATE product_images SET is_primary = 1 WHERE id = ?')->execute([$nextImg['id']]);
                    }
                }
                respond(200, ['message' => 'Image deleted']);

            case 'PUT':
                // Set as primary — PUT /admin/products/:id/images/:imageId
                if (!$imageId) respond(400, 'Image ID required');
                $this->db->prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?')->execute([$productId]);
                $this->db->prepare('UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?')->execute([$imageId, $productId]);
                respond(200, ['message' => 'Primary image updated']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Product Videos — upload / delete
    public function productVideos(string $method, string $productId, ?string $videoId): never {
        switch ($method) {
            case 'GET':
                $stmt = $this->db->prepare('SELECT * FROM product_videos WHERE product_id = ? ORDER BY sort_order ASC');
                $stmt->execute([$productId]);
                $videos = $stmt->fetchAll();
                foreach ($videos as &$v) {
                    $v['video_url'] = self::imageUrl($v['video_path']);
                }
                respond(200, $videos);

            case 'POST':
                if (!isset($_FILES['video'])) respond(400, 'No video file');
                $file = $_FILES['video'];
                if ($file['error'] !== UPLOAD_ERR_OK) respond(400, 'Upload error: ' . $file['error']);

                $allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
                if (!in_array($file['type'], $allowed)) respond(400, 'Only MP4, WEBM, MOV, AVI allowed');
                if ($file['size'] > 100 * 1024 * 1024) respond(400, 'Max file size is 100MB');

                $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $filename = uniqid('vid_', true) . '.' . $ext;
                $uploadDir = __DIR__ . '/../uploads/videos/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                $dest = $uploadDir . $filename;
                if (!move_uploaded_file($file['tmp_name'], $dest)) respond(500, 'Failed to save video');
                $storedPath = 'uploads/videos/' . $filename;
                $title = $_POST['title'] ?? null;

                $this->db->prepare('INSERT INTO product_videos (product_id, video_path, title, sort_order) VALUES (?, ?, ?, 0)')
                         ->execute([$productId, $storedPath, $title]);
                $insertedId = $this->db->lastInsertId();
                respond(201, ['id' => $insertedId, 'video_url' => self::imageUrl($storedPath), 'video_path' => $storedPath, 'title' => $title]);

            case 'DELETE':
                if (!$videoId) respond(400, 'Video ID required');
                $stmt = $this->db->prepare('SELECT * FROM product_videos WHERE id = ? AND product_id = ?');
                $stmt->execute([$videoId, $productId]);
                $vid = $stmt->fetch();
                if (!$vid) respond(404, 'Video not found');

                $localPath = __DIR__ . '/../' . ltrim($vid['video_path'], '/');
                if (file_exists($localPath)) @unlink($localPath);

                $this->db->prepare('DELETE FROM product_videos WHERE id = ?')->execute([$videoId]);
                respond(200, ['message' => 'Video deleted']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Product Variants CRUD
    public function productVariants(string $method, string $productId, ?string $variantId): never {
        switch ($method) {
            case 'GET':
                $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order');
                $stmt->execute([$productId]);
                respond(200, $stmt->fetchAll());

            case 'POST':
                $data = input();
                $stmt = $this->db->prepare('INSERT INTO product_variants (product_id, variant_name, thickness, width, length, grade, unit, price_per_unit, sort_order) VALUES (?,?,?,?,?,?,?,?,?)');
                $stmt->execute([$productId, $data['variant_name'], $data['thickness'] ?: null, $data['width'] ?: null, $data['length'] ?: null, $data['grade'] ?: null, $data['unit'] ?? 'ton', $data['price_per_unit'] ?? 0, $data['sort_order'] ?? 0]);
                respond(201, ['id' => $this->db->lastInsertId(), 'message' => 'Variant created']);

            case 'PUT':
                if (!$variantId) respond(400, 'Variant ID required');
                $data = input();
                $stmt = $this->db->prepare('UPDATE product_variants SET variant_name=?, thickness=?, width=?, length=?, grade=?, unit=?, price_per_unit=?, sort_order=? WHERE id=? AND product_id=?');
                $stmt->execute([$data['variant_name'], $data['thickness'] ?: null, $data['width'] ?: null, $data['length'] ?: null, $data['grade'] ?: null, $data['unit'] ?? 'ton', $data['price_per_unit'] ?? 0, $data['sort_order'] ?? 0, $variantId, $productId]);
                respond(200, ['message' => 'Variant updated']);

            case 'DELETE':
                if (!$variantId) respond(400, 'Variant ID required');
                $this->db->prepare('DELETE FROM product_variants WHERE id=? AND product_id=?')->execute([$variantId, $productId]);
                respond(200, ['message' => 'Variant deleted']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Product Pricing Rules
    public function productPricing(string $method, string $productId): never {
        switch ($method) {
            case 'GET':
                $stmt = $this->db->prepare('SELECT * FROM product_pricing_rules WHERE product_id = ?');
                $stmt->execute([$productId]);
                respond(200, $stmt->fetch() ?: null);

            case 'POST':
            case 'PUT':
                $data = input();
                $this->db->prepare('
                    INSERT INTO product_pricing_rules (product_id, primary_pricing_unit, price_per_kg, price_per_ton, price_per_meter, price_per_sqft, price_per_sheet)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE primary_pricing_unit=VALUES(primary_pricing_unit), price_per_kg=VALUES(price_per_kg), price_per_ton=VALUES(price_per_ton), price_per_meter=VALUES(price_per_meter), price_per_sqft=VALUES(price_per_sqft), price_per_sheet=VALUES(price_per_sheet)
                ')->execute([$productId, $data['primary_pricing_unit'] ?? 'kg', $data['price_per_kg'] ?? 0, $data['price_per_ton'] ?? 0, $data['price_per_meter'] ?? 0, $data['price_per_sqft'] ?? 0, $data['price_per_sheet'] ?? 0]);
                respond(200, ['message' => 'Pricing rule saved']);

            default: respond(405, 'Method not allowed');
        }
    }

    // Settings (GST, Tax, Company)
    public function settings(string $method): never {
        $group = $_GET['group'] ?? null;

        if ($method === 'GET') {
            $where = $group ? 'WHERE setting_group = ?' : '';
            $stmt  = $this->db->prepare("SELECT setting_key, setting_value, setting_group FROM company_settings $where ORDER BY setting_group ASC, setting_key ASC");
            $stmt->execute($group ? [$group] : []);
            $rows = $stmt->fetchAll();

            // Also get tax settings
            $taxRows = $this->db->query('SELECT setting_key, setting_value, label FROM tax_settings ORDER BY setting_key')->fetchAll();

            respond(200, ['company' => $rows, 'tax' => $taxRows]);
        }

        if ($method === 'PUT') {
            $data = input();
            foreach ($data['company'] ?? [] as $key => $value) {
                // Determine group from key prefix
                $group = 'general';
                if (str_starts_with($key, 'smtp_'))       $group = 'smtp';
                elseif (str_starts_with($key, 'razorpay_')) $group = 'payment';
                elseif (str_starts_with($key, 'quote_'))   $group = 'quote';
                elseif (str_starts_with($key, 'hurry_deal_')) $group = 'hurry_deal';

                $this->db->prepare('
                    INSERT INTO company_settings (setting_key, setting_value, setting_group)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
                ')->execute([$key, $value, $group]);
            }
            foreach ($data['tax'] ?? [] as $key => $value) {
                $this->db->prepare('UPDATE tax_settings SET setting_value = ? WHERE setting_key = ?')
                         ->execute([$value, $key]);
            }
            respond(200, ['message' => 'Settings updated']);
        }

        respond(405, 'Method not allowed');
    }
}
