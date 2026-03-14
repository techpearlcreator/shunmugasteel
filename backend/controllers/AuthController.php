<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../services/EmailService.php';

class AuthController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function register(): never {
        $data = input();

        $required = ['name', 'email', 'phone', 'password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                respond(422, "Field '$field' is required");
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            respond(422, 'Invalid email address');
        }

        if (strlen($data['password']) < 8) {
            respond(422, 'Password must be at least 8 characters');
        }

        // Check duplicate email
        $stmt = $this->db->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            respond(409, 'Email already registered');
        }

        $verifyToken = bin2hex(random_bytes(32));

        $stmt = $this->db->prepare('
            INSERT INTO users (name, email, phone, company_name, gst_number, address, city, pincode, password, email_verify_token)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $data['name'],
            strtolower($data['email']),
            $data['phone'],
            $data['company_name'] ?? null,
            $data['gst_number'] ?? null,
            $data['address'] ?? null,
            $data['city'] ?? null,
            $data['pincode'] ?? null,
            password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            $verifyToken,
        ]);

        $userId = $this->db->lastInsertId();

        // Send verification email
        try {
            $verifyUrl = FRONTEND_URL . '/verify-email?token=' . $verifyToken;
            (new EmailService())->sendEmailVerification([
                'name'  => $data['name'],
                'email' => strtolower($data['email']),
            ], $verifyUrl);
        } catch (\Throwable $e) {
            error_log('Register verification email error: ' . $e->getMessage());
        }

        respond(201, [
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user_id' => $userId,
        ]);
    }

    public function login(): never {
        $data = input();

        if (empty($data['email']) || empty($data['password'])) {
            respond(422, 'Email and password are required');
        }

        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? AND status = "active"');
        $stmt->execute([strtolower($data['email'])]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password'])) {
            respond(401, 'Invalid email or password');
        }

        $token = AuthMiddleware::createJWT([
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => 'user',
        ]);

        unset($user['password'], $user['email_verify_token'], $user['reset_token']);

        respond(200, ['token' => $token, 'user' => $user]);
    }

    public function logout(): never {
        // JWT is stateless — client discards token
        respond(200, ['message' => 'Logged out successfully']);
    }

    public function me(): never {
        $payload = AuthMiddleware::require();

        $stmt = $this->db->prepare('SELECT id, name, email, phone, company_name, gst_number, address, city, state, pincode, email_verified, created_at FROM users WHERE id = ?');
        $stmt->execute([$payload['sub']]);
        $user = $stmt->fetch();

        if (!$user) respond(404, 'User not found');

        respond(200, $user);
    }

    public function verifyEmail(): never {
        $token = $_GET['token'] ?? '';
        if (!$token) respond(422, 'Token is required');

        $stmt = $this->db->prepare('SELECT id FROM users WHERE email_verify_token = ?');
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user) respond(400, 'Invalid or expired token');

        $this->db->prepare('UPDATE users SET email_verified = 1, email_verify_token = NULL WHERE id = ?')
                 ->execute([$user['id']]);

        respond(200, ['message' => 'Email verified successfully']);
    }

    public function forgotPassword(): never {
        $data = input();
        if (empty($data['email'])) respond(422, 'Email is required');

        $stmt = $this->db->prepare('SELECT id, name, email FROM users WHERE email = ?');
        $stmt->execute([strtolower($data['email'])]);
        $user = $stmt->fetch();

        // Always return success (security: don't reveal if email exists)
        if ($user) {
            $token   = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
            $this->db->prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
                     ->execute([$token, $expires, $user['id']]);

            try {
                $resetUrl = FRONTEND_URL . '/reset-password?token=' . $token;
                (new EmailService())->sendPasswordReset($user, $resetUrl);
            } catch (\Throwable $e) {
                error_log('Forgot password email error: ' . $e->getMessage());
            }
        }

        respond(200, ['message' => 'If that email is registered, a reset link has been sent.']);
    }

    public function resetPassword(): never {
        $data = input();
        if (empty($data['token']) || empty($data['password'])) {
            respond(422, 'Token and password are required');
        }

        $stmt = $this->db->prepare('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()');
        $stmt->execute([$data['token']]);
        $user = $stmt->fetch();

        if (!$user) respond(400, 'Invalid or expired reset token');

        $this->db->prepare('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
                 ->execute([password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]), $user['id']]);

        respond(200, ['message' => 'Password reset successfully. You can now log in.']);
    }

    public function adminLogin(): never {
        $data = input();
        if (empty($data['email']) || empty($data['password'])) {
            respond(422, 'Email and password are required');
        }

        $stmt = $this->db->prepare('SELECT * FROM admins WHERE email = ?');
        $stmt->execute([strtolower($data['email'])]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($data['password'], $admin['password'])) {
            respond(401, 'Invalid email or password');
        }

        $token = AuthMiddleware::createJWT([
            'sub'   => $admin['id'],
            'email' => $admin['email'],
            'role'  => 'admin',
        ]);

        $this->db->prepare('UPDATE admins SET last_login = NOW() WHERE id = ?')->execute([$admin['id']]);

        unset($admin['password']);
        respond(200, ['token' => $token, 'admin' => $admin]);
    }
}
