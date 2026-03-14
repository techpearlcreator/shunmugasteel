<?php
require_once __DIR__ . '/../config/database.php';

class CategoryController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
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

        // Get products in this category
        $stmt = $this->db->prepare('
            SELECT p.*,
                   pi.image_path as primary_image,
                   pv.price_per_unit as starting_price,
                   pv.unit as price_unit
            FROM products p
            LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
            LEFT JOIN product_variants pv ON pv.product_id = p.id AND pv.status = "active"
            WHERE p.category_id = ? AND p.status = "active"
            GROUP BY p.id
            ORDER BY p.sort_order ASC, p.name ASC
        ');
        $stmt->execute([$category['id']]);
        $category['products'] = $stmt->fetchAll();

        respond(200, $category);
    }
}
