<?php
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../middleware/AdminMiddleware.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/QuoteController.php';
require_once __DIR__ . '/../controllers/PaymentController.php';
require_once __DIR__ . '/../controllers/AdminController.php';

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove base path (e.g. /shunmugasteel/backend)
$base = '/shunmugasteel/backend';
if (str_starts_with($uri, $base)) {
    $uri = substr($uri, strlen($base));
}

$uri = rtrim($uri, '/') ?: '/';
$segments = explode('/', trim($uri, '/'));

header('Content-Type: application/json');

// ──────────────────────────────────────────
// ROUTE MATCHING
// ──────────────────────────────────────────

// Auth routes
if ($segments[0] === 'auth') {
    $ctrl = new AuthController();
    match([$method, $segments[1] ?? '']) {
        ['POST', 'register']        => $ctrl->register(),
        ['POST', 'login']           => $ctrl->login(),
        ['POST', 'logout']          => $ctrl->logout(),
        ['GET',  'me']              => $ctrl->me(),
        ['GET',  'verify-email']    => $ctrl->verifyEmail(),
        ['POST', 'forgot-password'] => $ctrl->forgotPassword(),
        ['POST', 'reset-password']  => $ctrl->resetPassword(),
        default => respond(404, 'Route not found'),
    };
}

// Categories
elseif ($segments[0] === 'categories') {
    $ctrl = new CategoryController();
    if (!isset($segments[1])) {
        match($method) {
            'GET'  => $ctrl->index(),
            default => respond(405, 'Method not allowed'),
        };
    } else {
        match($method) {
            'GET'  => $ctrl->showBySlug($segments[1]),
            default => respond(405, 'Method not allowed'),
        };
    }
}

// Products
elseif ($segments[0] === 'products') {
    $ctrl = new ProductController();
    if (!isset($segments[1])) {
        $ctrl->index();
    } else {
        $ctrl->showBySlug($segments[1]);
    }
}

// Quotes (customer)
elseif ($segments[0] === 'quotes') {
    AuthMiddleware::require();
    $ctrl = new QuoteController();
    if (!isset($segments[1])) {
        match($method) {
            'GET'  => $ctrl->index(),
            'POST' => $ctrl->create(),
            default => respond(405, 'Method not allowed'),
        };
    } elseif ($segments[1] === 'calculate') {
        $ctrl->calculate();
    } elseif (isset($segments[2]) && $segments[2] === 'pdf') {
        $ctrl->downloadPDF($segments[1]);
    } else {
        $ctrl->show($segments[1]);
    }
}

// Payments
elseif ($segments[0] === 'payment') {
    $sub = $segments[1] ?? '';

    // Webhook — no auth, no JSON content-type required
    if ($sub === 'webhook') {
        $ctrl = new PaymentController();
        $ctrl->webhook();
    }

    AuthMiddleware::require();
    $ctrl = new PaymentController();

    if ($sub === 'create-order' && $method === 'POST') {
        $ctrl->createOrder();
    } elseif ($sub === 'verify' && $method === 'POST') {
        $ctrl->verify();
    } elseif ($sub === 'quote' && isset($segments[2])) {
        $ctrl->getByQuote($segments[2]);
    } else {
        respond(404, 'Route not found');
    }
}

// One-time admin setup — DELETE this block after use
// Access: GET /setup?key=sst_setup_2024
elseif ($segments[0] === 'setup') {
    $key = $_GET['key'] ?? '';
    if ($key !== 'sst_setup_2024') respond(403, 'Forbidden');
    require_once __DIR__ . '/../config/database.php';
    $db   = Database::getInstance();
    $email = 'admin@shunmugasteel.com';
    $pass  = password_hash('Admin@2024', PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt  = $db->prepare('SELECT id FROM admins WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $db->prepare('UPDATE admins SET password = ? WHERE email = ?')->execute([$pass, $email]);
        respond(200, ['message' => 'Admin password reset', 'email' => $email, 'password' => 'Admin@2024']);
    } else {
        $db->prepare('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)')->execute(['Shunmuga Admin', $email, $pass]);
        respond(200, ['message' => 'Admin created', 'email' => $email, 'password' => 'Admin@2024']);
    }
}

// Hurry Deal — public read
elseif ($segments[0] === 'hurry-deal') {
    require_once __DIR__ . '/../config/database.php';
    $db   = Database::getInstance();
    $rows = $db->query("SELECT setting_key, setting_value FROM company_settings WHERE setting_group = 'hurry_deal'")->fetchAll();
    $deal = [];
    foreach ($rows as $row) {
        $k        = str_replace('hurry_deal_', '', $row['setting_key']);
        $deal[$k] = $row['setting_value'];
    }
    respond(200, $deal);
}

// Admin routes
elseif ($segments[0] === 'admin') {
    // Admin login does NOT require auth token
    if (($segments[1] ?? '') === 'auth') {
        $ctrl = new AuthController();
        $ctrl->adminLogin();
    }

    AdminMiddleware::require();
    $ctrl = new AdminController();
    $sub  = $segments[1] ?? '';
    $id   = $segments[2] ?? null;
    $sub2 = $segments[3] ?? null; // e.g. "variants" or "pricing"
    $id2  = $segments[4] ?? null; // e.g. variant id

    // Sub-resource routes: /admin/products/:id/variants|pricing|images
    if ($sub === 'products' && $id && $sub2 === 'variants') {
        $ctrl->productVariants($method, $id, $id2);
    } elseif ($sub === 'products' && $id && $sub2 === 'pricing') {
        $ctrl->productPricing($method, $id);
    } elseif ($sub === 'products' && $id && $sub2 === 'images') {
        $ctrl->productImages($method, $id, $id2);
    } else {
        match([$sub]) {
            ['dashboard']  => $ctrl->dashboard(),
            ['categories'] => $ctrl->categories($method, $id),
            ['products']   => $ctrl->products($method, $id),
            ['quotes']     => $ctrl->quotes($method, $id),
            ['customers']  => $ctrl->customers($method, $id),
            ['payments']   => $ctrl->payments(),
            ['settings']   => $ctrl->settings($method),
            default        => respond(404, 'Admin route not found'),
        };
    }
}

else {
    respond(404, 'API route not found');
}

// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────

function respond(int $code, mixed $data): never {
    http_response_code($code);
    if (is_string($data)) {
        echo json_encode(['error' => $data]);
    } else {
        echo json_encode($data);
    }
    exit;
}

function input(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
