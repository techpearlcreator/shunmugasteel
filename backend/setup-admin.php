<?php
/**
 * SHUNMUGA STEEL — One-time admin setup script
 * Run once via browser: http://localhost/shunmugasteel/backend/setup-admin.php
 * DELETE this file after running.
 */

require_once __DIR__ . '/config/database.php';

$db = Database::getInstance();

// ─── Admin credentials ────────────────────────────────────────
$adminEmail    = 'admin@shunmugasteel.com';
$adminPassword = 'Admin@2026';   // ← CHANGE AFTER FIRST LOGIN
$adminName     = 'Shunmuga Admin';

// Check if admin already exists
$stmt = $db->prepare('SELECT id FROM admins WHERE email = ?');
$stmt->execute([$adminEmail]);

if ($stmt->fetch()) {
    // Reset password if already exists
    $db->prepare('UPDATE admins SET password = ? WHERE email = ?')
       ->execute([password_hash($adminPassword, PASSWORD_BCRYPT, ['cost' => 12]), $adminEmail]);
    echo "<p>✅ Admin password reset for <strong>$adminEmail</strong></p>";
} else {
    $db->prepare('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)')
       ->execute([$adminName, $adminEmail, password_hash($adminPassword, PASSWORD_BCRYPT, ['cost' => 12])]);
    echo "<p>✅ Admin account created: <strong>$adminEmail</strong></p>";
}

// ─── Seed Hurry Deal settings keys ───────────────────────────
$hurryDealDefaults = [
    'hurry_deal_enabled'      => '0',
    'hurry_deal_title'        => 'Hurry! Flash Deal On Steel',
    'hurry_deal_subtitle'     => 'Special bulk pricing for limited time only.',
    'hurry_deal_product_slug' => 'hr-coils-sheets',
    'hurry_deal_end_at'       => date('Y-m-d\TH:i', strtotime('+30 days')),
];

foreach ($hurryDealDefaults as $key => $value) {
    $stmt = $db->prepare('SELECT id FROM company_settings WHERE setting_key = ?');
    $stmt->execute([$key]);
    if (!$stmt->fetch()) {
        $db->prepare('INSERT INTO company_settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)')
           ->execute([$key, $value, 'hurry_deal']);
        echo "<p>✅ Inserted setting: <strong>$key</strong></p>";
    } else {
        echo "<p>⏭ Already exists: <strong>$key</strong></p>";
    }
}

echo "<hr>";
echo "<p><strong>Admin Login:</strong></p>";
echo "<ul>";
echo "<li>URL: <a href='http://localhost:5174'>http://localhost:5174</a></li>";
echo "<li>Email: <strong>$adminEmail</strong></li>";
echo "<li>Password: <strong>$adminPassword</strong></li>";
echo "</ul>";
echo "<p style='color:red;'><strong>⚠️ Delete this file (setup-admin.php) after use!</strong></p>";
