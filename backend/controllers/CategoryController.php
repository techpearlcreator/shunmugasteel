<?php
require_once __DIR__ . '/../config/database.php';

class CategoryController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    private static function imageUrl(?string $path): string {
        if (!$path) return '';
        return str_starts_with($path, 'http') ? $path : BASE_URL . '/' . $path;
    }

    public function index(): never {
        $stmt = $this->db->query('
            SELECT c.*,
                   COUNT(p.id) as product_count,
                   parent.name as parent_name
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id AND p.status = "active"
            LEFT JOIN categories parent ON parent.id = c.parent_id
            WHERE c.status = "active"
            GROUP BY c.id
            ORDER BY c.parent_id ASC, c.sort_order ASC, c.name ASC
        ');
        $all = $stmt->fetchAll();

        // Build tree structure
        $parents = [];
        $children = [];
        foreach ($all as $cat) {
            if ($cat['parent_id'] === null) {
                $cat['children'] = [];
                $parents[$cat['id']] = $cat;
            } else {
                $children[] = $cat;
            }
        }
        foreach ($children as $child) {
            if (isset($parents[$child['parent_id']])) {
                $parents[$child['parent_id']]['children'][] = $child;
            }
        }

        respond(200, array_values($parents));
    }

    public function showBySlug(string $slug): never {
        $stmt = $this->db->prepare('SELECT * FROM categories WHERE slug = ? AND status = "active"');
        $stmt->execute([$slug]);
        $category = $stmt->fetch();

        if (!$category) respond(404, 'Category not found');

        // Include sub-category products if this is a parent category
        $stmt = $this->db->prepare('
            SELECT p.*,
                   pi.image_path as primary_image,
                   COALESCE(MIN(pv.price_per_unit), pr.price_per_ton) as starting_price,
                   COALESCE(pv.unit, "MT") as price_unit
            FROM products p
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
            LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.status = "active"
            LEFT JOIN product_pricing_rules pr ON pr.product_id = p.id
            WHERE p.status = "active"
              AND (
                p.category_id = ?
                OR p.category_id IN (
                    SELECT id FROM categories WHERE parent_id = ? AND status = "active"
                )
              )
            GROUP BY p.id
            ORDER BY p.sort_order ASC, p.name ASC
        ');
        $stmt->execute([$category['id'], $category['id']]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$p) {
            $p['primary_image'] = self::imageUrl($p['primary_image'] ?? '');
        }
        $category['products'] = $rows;

        respond(200, $category);
    }
}
