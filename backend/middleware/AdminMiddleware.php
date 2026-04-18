<?php
require_once __DIR__ . '/AuthMiddleware.php';

class AdminMiddleware {
    public static function require(): void {
        $payload = AuthMiddleware::require();

        if (($payload['role'] ?? '') !== 'admin') {
            respond(403, 'Admin access required');
        }
    }
}
