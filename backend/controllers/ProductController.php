<?php
require_once __DIR__ . '/../config/database.php';

class ProductController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    private static function imageUrl(?string $path): string {
        if (!$path) return '';
        return str_starts_with($path, 'http') ? $path : BASE_URL . '/' . $path;
    }

    public function index(): never {
        $where = ['p.status = "active"'];
        $params = [];

        if (!empty($_GET['category'])) {
            $stmt = $this->db->prepare('SELECT id FROM categories WHERE slug = ?');
            $stmt->execute([$_GET['category']]);
            $cat = $stmt->fetch();
            if ($cat) {
                $where[] = 'p.category_id = ?';
                $params[] = $cat['id'];
            }
        }

        if (!empty($_GET['brand'])) {
            $where[] = 'p.brand = ?';
            $params[] = $_GET['brand'];
        }

        if (!empty($_GET['search'])) {
            $where[] = '(p.name LIKE ? OR p.short_description LIKE ?)';
            $params[] = '%' . $_GET['search'] . '%';
            $params[] = '%' . $_GET['search'] . '%';
        }

        if (!empty($_GET['featured'])) {
            $where[] = 'p.is_featured = 1';
        }

        if (!empty($_GET['stock'])) {
            $where[] = 'p.stock_status = ?';
            $params[] = $_GET['stock'];
        }

        $whereClause = implode(' AND ', $where);
        $stmt = $this->db->prepare("
            SELECT p.*,
                   c.name as category_name,
                   c.slug as category_slug,
                   pi.image_path as primary_image,
                   MIN(pv.price_per_unit) as starting_price,
                   pv.unit as price_unit
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
            LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.status = 'active'
            WHERE $whereClause
            GROUP BY p.id
            ORDER BY p.sort_order ASC, p.name ASC
        ");
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        foreach ($products as &$p) {
            $p['primary_image'] = self::imageUrl($p['primary_image'] ?? '');
        }
        respond(200, $products);
    }

    public function showBySlug(string $slug): never {
        $stmt = $this->db->prepare('
            SELECT p.*, c.name as category_name, c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.slug = ? AND p.status = "active"
        ');
        $stmt->execute([$slug]);
        $product = $stmt->fetch();

        if (!$product) respond(404, 'Product not found');

        // Images
        $stmt = $this->db->prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order');
        $stmt->execute([$product['id']]);
        $imgs = $stmt->fetchAll();
        foreach ($imgs as &$img) {
            $img['image_url'] = self::imageUrl($img['image_path']);
        }
        $product['images'] = $imgs;

        // Videos
        $stmt = $this->db->prepare('SELECT * FROM product_videos WHERE product_id = ? ORDER BY sort_order');
        $stmt->execute([$product['id']]);
        $vids = $stmt->fetchAll();
        foreach ($vids as &$vid) {
            $vid['video_url'] = self::imageUrl($vid['video_path']);
        }
        $product['videos'] = $vids;

        // Specs
        $stmt = $this->db->prepare('SELECT * FROM product_specs WHERE product_id = ? ORDER BY sort_order');
        $stmt->execute([$product['id']]);
        $product['specs'] = $stmt->fetchAll();

        // Variants (if standard)
        if (in_array($product['product_type'], ['standard', 'both'])) {
            $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE product_id = ? AND status = "active" ORDER BY sort_order');
            $stmt->execute([$product['id']]);
            $product['variants'] = $stmt->fetchAll();
        }

        // Pricing rules (if custom)
        if (in_array($product['product_type'], ['custom', 'both'])) {
            $stmt = $this->db->prepare('SELECT * FROM product_pricing_rules WHERE product_id = ?');
            $stmt->execute([$product['id']]);
            $product['pricing_rules'] = $stmt->fetch() ?: null;
        }

        respond(200, $product);
    }
}
