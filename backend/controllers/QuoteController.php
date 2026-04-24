<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../services/PDFService.php';

class QuoteController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // GET /quotes — list current user's quotes
    public function index(): never {
        $userId = $GLOBALS['auth_user']['sub'];

        $stmt = $this->db->prepare('
            SELECT q.id, q.quote_number, q.status, q.created_at, q.updated_at,
                   q.total_amount AS total, q.gst_amount, q.gst_percentage AS gst_rate,
                   q.valid_until, q.delivery_address,
                   COUNT(qi.id) as item_count
            FROM quotes q
            LEFT JOIN quote_items qi ON qi.quote_id = q.id
            WHERE q.user_id = ?
            GROUP BY q.id
            ORDER BY q.created_at DESC
        ');
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $addr = json_decode($row['delivery_address'] ?? '{}', true);
            $row['delivery_city'] = $addr['city'] ?? null;
        }
        respond(200, $rows);
    }

    // GET /quotes/:id
    public function show(string $id): never {
        $userId = $GLOBALS['auth_user']['sub'];

        $stmt = $this->db->prepare('
            SELECT id, quote_number, status, created_at, updated_at, customer_notes AS notes,
                   subtotal, gst_percentage AS gst_rate, gst_amount,
                   total_amount AS total, valid_until, delivery_address, admin_notes
            FROM quotes WHERE id = ? AND user_id = ?
        ');
        $stmt->execute([$id, $userId]);
        $quote = $stmt->fetch();

        if (!$quote) respond(404, 'Quote not found');

        // Decode delivery_address JSON
        $quote['delivery_address'] = json_decode($quote['delivery_address'] ?? '{}', true);

        // Items
        $stmt = $this->db->prepare('SELECT * FROM quote_items WHERE quote_id = ?');
        $stmt->execute([$quote['id']]);
        $items = $stmt->fetchAll();
        foreach ($items as &$item) {
            $item['specs'] = is_string($item['specifications'])
                ? json_decode($item['specifications'], true)
                : $item['specifications'];
        }
        $quote['items'] = $items;

        // Status history → shape as timeline
        $stmt = $this->db->prepare('SELECT new_status AS status, notes AS note, created_at AS timestamp FROM quote_status_history WHERE quote_id = ? ORDER BY created_at ASC');
        $stmt->execute([$quote['id']]);
        $quote['timeline'] = $stmt->fetchAll();

        respond(200, $quote);
    }

    // POST /quotes/calculate — returns price preview before submission
    public function calculate(): never {
        $data  = input();
        $items = $data['items'] ?? [];

        if (empty($items)) respond(422, 'At least one item is required');

        // Get GST from settings
        $stmt = $this->db->query('SELECT setting_value FROM tax_settings WHERE setting_key = "default_gst"');
        $gstRow = $stmt->fetch();
        $gstPct = (float)($gstRow['setting_value'] ?? 18);

        $lineItems   = [];
        $subtotal    = 0;

        foreach ($items as $item) {
            $productId = $item['product_id'];
            $quantity  = (float)($item['quantity'] ?? 0);
            $variantId = $item['variant_id'] ?? null;
            $isCustom  = (bool)($item['is_custom'] ?? false);

            if ($quantity <= 0) continue;

            if ($variantId && !$isCustom) {
                // Standard variant pricing
                $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE id = ? AND product_id = ?');
                $stmt->execute([$variantId, $productId]);
                $variant = $stmt->fetch();

                if (!$variant) respond(422, "Variant #$variantId not found");

                $unitPrice  = (float)$variant['price_per_unit'];
                $totalPrice = $unitPrice * $quantity;

                $lineItems[] = [
                    'product_id'   => $productId,
                    'variant_id'   => $variantId,
                    'variant_name' => $variant['variant_name'],
                    'quantity'     => $quantity,
                    'unit'         => $variant['unit'],
                    'unit_price'   => $unitPrice,
                    'total_price'  => $totalPrice,
                    'is_custom'    => false,
                ];
                $subtotal += $totalPrice;

            } else {
                // Custom dimension pricing
                $stmt = $this->db->prepare('SELECT * FROM product_pricing_rules WHERE product_id = ?');
                $stmt->execute([$productId]);
                $rule = $stmt->fetch();

                if (!$rule) respond(422, "Pricing rule not found for product #$productId");

                $specs     = $item['specs'] ?? [];
                $unitPrice = $this->calculateCustomPrice($rule, $specs, $quantity);
                $totalPrice = $unitPrice * $quantity;

                $lineItems[] = [
                    'product_id'  => $productId,
                    'variant_id'  => null,
                    'specs'       => $specs,
                    'quantity'    => $quantity,
                    'unit'        => $rule['primary_pricing_unit'],
                    'unit_price'  => $unitPrice,
                    'total_price' => $totalPrice,
                    'is_custom'   => true,
                ];
                $subtotal += $totalPrice;
            }
        }

        $gstAmount = $subtotal * $gstPct / 100;
        $total     = $subtotal + $gstAmount;

        respond(200, [
            'items'          => $lineItems,
            'subtotal'       => round($subtotal, 2),
            'gst_percentage' => $gstPct,
            'gst_amount'     => round($gstAmount, 2),
            'total'          => round($total, 2),
        ]);
    }

    // POST /quotes — create quote
    // Always returns a valid JSON string, never false/null
    private function safeJson(mixed $value): string {
        if (is_string($value)) {
            // Already a JSON string? Verify it
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $value;
            }
            // Plain string — wrap as description
            return json_encode(['description' => $value], JSON_UNESCAPED_UNICODE) ?: '{}';
        }
        if (is_array($value) && !empty($value)) {
            return json_encode($value, JSON_UNESCAPED_UNICODE) ?: '{}';
        }
        return '{}';
    }

    public function create(): never {
        $userId = $GLOBALS['auth_user']['sub'];
        $data   = input();

        if (empty($data['items'])) respond(422, 'At least one item is required');

        // Get GST
        $stmt   = $this->db->query('SELECT setting_value FROM tax_settings WHERE setting_key = "default_gst"');
        $gstRow = $stmt->fetch();
        $gstPct = (float)($gstRow['setting_value'] ?? 18);

        // Get quote validity
        $stmt      = $this->db->query('SELECT setting_value FROM tax_settings WHERE setting_key = "quote_validity_days"');
        $valRow    = $stmt->fetch();
        $validDays = (int)($valRow['setting_value'] ?? 7);

        $subtotal  = 0;
        $lineItems = [];

        foreach ($data['items'] as $item) {
            $productId = $item['product_id'];
            $quantity  = (float)($item['quantity'] ?? 1);
            $variantId = $item['variant_id'] ?? null;
            $isCustom  = (bool)($item['is_custom'] ?? false);

            $stmt = $this->db->prepare('SELECT name, brand FROM products WHERE id = ?');
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            if (!$product) respond(422, "Product #$productId not found");

            if ($variantId && !$isCustom) {
                $stmt = $this->db->prepare('SELECT * FROM product_variants WHERE id = ? AND product_id = ?');
                $stmt->execute([$variantId, $productId]);
                $variant = $stmt->fetch();
                if (!$variant) respond(422, "Variant not found");

                $unitPrice  = (float)$variant['price_per_unit'];
                $totalPrice = $unitPrice * $quantity;
                $specs      = $this->safeJson([
                    'thickness' => $variant['thickness'],
                    'width'     => $variant['width'],
                    'length'    => $variant['length'],
                    'grade'     => $variant['grade'],
                    'variant'   => $variant['variant_name'],
                ]);

                $lineItems[] = [
                    'productId'    => $productId,
                    'variantId'    => $variantId,
                    'product_name' => $product['name'],
                    'brand'        => $product['brand'],
                    'quantity'     => $quantity,
                    'unit'         => $variant['unit'] ?? 'MT',
                    'unitPrice'    => $unitPrice,
                    'totalPrice'   => $totalPrice,
                    'specs'        => $specs,
                    'is_custom'    => 0,
                ];
            } else {
                $stmt = $this->db->prepare('SELECT * FROM product_pricing_rules WHERE product_id = ?');
                $stmt->execute([$productId]);
                $rule = $stmt->fetch();
                if (!$rule) respond(422, "Pricing rules not found for product #$productId");

                $rawSpecs  = $item['specs'] ?? [];
                $itemSpecs = is_array($rawSpecs) ? $rawSpecs : [];
                $specs     = $this->safeJson($rawSpecs);
                $unitPrice  = $this->calculateCustomPrice($rule, $itemSpecs, $quantity);
                $totalPrice = $unitPrice * $quantity;

                $lineItems[] = [
                    'productId'    => $productId,
                    'variantId'    => null,
                    'product_name' => $product['name'],
                    'brand'        => $product['brand'],
                    'quantity'     => $quantity,
                    'unit'         => $rule['primary_pricing_unit'] ?? 'MT',
                    'unitPrice'    => $unitPrice,
                    'totalPrice'   => $totalPrice,
                    'specs'        => $specs,
                    'is_custom'    => 1,
                ];
            }

            $subtotal += $totalPrice;
        }

        $gstAmount = $subtotal * $gstPct / 100;
        $total     = $subtotal + $gstAmount;
        $validUntil = date('Y-m-d', strtotime("+$validDays days"));

        // Generate quote number using prefix from settings (fallback: SST)
        $prefixRow = $this->db->query("SELECT setting_value FROM company_settings WHERE setting_key = 'quote_prefix' LIMIT 1")->fetch();
        $prefix    = ($prefixRow && trim($prefixRow['setting_value']) !== '') ? strtoupper(trim($prefixRow['setting_value'])) : 'SST';
        $year      = date('Y');
        $stmt      = $this->db->query("SELECT COUNT(*) as cnt FROM quotes WHERE YEAR(created_at) = $year");
        $count     = (int)$stmt->fetch()['cnt'] + 1;
        $quoteNumber = sprintf('%s-%d-%04d', $prefix, $year, $count);

        // Insert quote header + items atomically
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare('
                INSERT INTO quotes (quote_number, user_id, status, subtotal, gst_percentage, gst_amount, total_amount, delivery_address, customer_notes, valid_until)
                VALUES (?, ?, "submitted", ?, ?, ?, ?, ?, ?, ?)
            ');
            $deliveryAddress = isset($data['delivery_address'])
                ? json_encode($data['delivery_address'])
                : null;
            $stmt->execute([
                $quoteNumber, $userId, round($subtotal, 2), $gstPct,
                round($gstAmount, 2), round($total, 2),
                $deliveryAddress, $data['notes'] ?? null, $validUntil,
            ]);
            $quoteId = $this->db->lastInsertId();

            // Insert line items
            foreach ($lineItems as $li) {
                $stmt = $this->db->prepare('
                    INSERT INTO quote_items (quote_id, product_id, variant_id, product_name, brand, specifications, quantity, unit, unit_price, total_price, is_custom)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ');
                $stmt->execute([
                    $quoteId,
                    $li['productId'] ?? $li['product_id'] ?? null,
                    $li['variantId'] ?? $li['variant_id'] ?? null,
                    $li['product_name'],
                    $li['brand'],
                    $li['specs'],
                    $li['quantity'],
                    $li['unit'],
                    $li['unitPrice'] ?? $li['unit_price'],
                    $li['totalPrice'] ?? $li['total_price'],
                    $li['is_custom'],
                ]);
            }

            // Insert status history
            $this->db->prepare('INSERT INTO quote_status_history (quote_id, new_status, changed_by_type, notes) VALUES (?, "submitted", "user", "Quote submitted by customer")')
                     ->execute([$quoteId]);

            $this->db->commit();
        } catch (\Throwable $e) {
            $this->db->rollBack();
            error_log('Quote insert failed: ' . $e->getMessage());
            respond(500, 'Failed to save quote. Please try again.');
        }

        // Send email notifications
        try {
            $stmtUser = $this->db->prepare('SELECT name, email, phone, company_name FROM users WHERE id = ?');
            $stmtUser->execute([$userId]);
            $customer = $stmtUser->fetch();

            $quoteRow = [
                'id'            => $quoteId,
                'quote_number'  => $quoteNumber,
                'subtotal'      => round($subtotal, 2),
                'gst_percentage'=> $gstPct,
                'gst_amount'    => round($gstAmount, 2),
                'total_amount'  => round($total, 2),
                'valid_until'   => $validUntil,
                'created_at'    => date('Y-m-d H:i:s'),
                'customer_notes'=> $data['notes'] ?? null,
                'delivery_address' => $data['delivery_address'] ?? [],
            ];

            $emailSvc = new EmailService();
            // Generate PDF first so we can attach it
            $pdfSvc  = new PDFService();
            $pdfPath = $pdfSvc->generateQuotePDF($quoteRow, $lineItems, $customer ?: []);

            $emailSvc->sendQuoteSubmitted($quoteRow, $customer ?: [], $pdfPath ?: null);
            $emailSvc->sendAdminNewQuote($quoteRow, $customer ?: []);
        } catch (\Throwable $e) {
            error_log('Quote email/PDF error: ' . $e->getMessage());
            // Non-fatal — quote is already saved
        }

        respond(201, [
            'message'      => 'Quote submitted successfully',
            'quote_id'     => $quoteId,
            'quote_number' => $quoteNumber,
            'valid_until'  => $validUntil,
            'total'        => round($total, 2),
        ]);
    }

    // GET /quotes/:id/pdf
    public function downloadPDF(string $id): never {
        $userId = $GLOBALS['auth_user']['sub'];

        $stmt = $this->db->prepare('SELECT * FROM quotes WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        $quote = $stmt->fetch();

        if (!$quote) respond(404, 'Quote not found');

        // Fetch items
        $stmtItems = $this->db->prepare('SELECT * FROM quote_items WHERE quote_id = ?');
        $stmtItems->execute([$id]);
        $items = $stmtItems->fetchAll();

        // Fetch customer
        $stmtUser = $this->db->prepare('SELECT name, email, phone, company_name, gst_number FROM users WHERE id = ?');
        $stmtUser->execute([$userId]);
        $customer = $stmtUser->fetch() ?: [];

        // Decode delivery_address
        $quote['delivery_address'] = json_decode($quote['delivery_address'] ?? '{}', true);

        $pdfSvc  = new PDFService();
        $pdfPath = $pdfSvc->generateQuotePDF($quote, $items, $customer);

        if (!$pdfPath) respond(500, 'Failed to generate PDF');

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $quote['quote_number'] . '.pdf"');
        header('Content-Length: ' . filesize($pdfPath));
        readfile($pdfPath);
        exit;
    }

    private function calculateCustomPrice(array $rule, array $specs, float $quantity): float {
        $unit = $rule['primary_pricing_unit'];

        return match($unit) {
            'kg'    => (float)$rule['price_per_kg'],
            'ton'   => (float)$rule['price_per_ton'],
            'meter' => (float)$rule['price_per_meter'],
            'sqft'  => (float)$rule['price_per_sqft'],
            'sheet' => (float)$rule['price_per_sheet'],
            default => 0,
        };
    }
}
