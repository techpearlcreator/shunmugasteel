<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../services/EmailService.php';
require_once __DIR__ . '/../vendor/autoload.php';

class PaymentController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // POST /payment/create-order
    public function createOrder(): never {
        $userId = $GLOBALS['auth_user']['sub'];
        $data   = input();

        if (empty($data['quote_id'])) respond(422, 'quote_id is required');

        $stmt = $this->db->prepare('SELECT * FROM quotes WHERE id = ? AND user_id = ? AND status = "confirmed"');
        $stmt->execute([$data['quote_id'], $userId]);
        $quote = $stmt->fetch();

        if (!$quote) respond(404, 'Quote not found or not yet confirmed');

        if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
            respond(503, 'Payment gateway not configured');
        }

        $amountPaise = (int)round($quote['total_amount'] * 100);

        try {
            $api = new \Razorpay\Api\Api(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
            $rzpOrder = $api->order->create([
                'amount'          => $amountPaise,
                'currency'        => 'INR',
                'receipt'         => $quote['quote_number'],
                'payment_capture' => 1,
                'notes'           => [
                    'quote_id'     => (string)$quote['id'],
                    'quote_number' => $quote['quote_number'],
                ],
            ]);
        } catch (\Exception $e) {
            error_log('Razorpay createOrder error: ' . $e->getMessage());
            respond(500, 'Payment gateway error: ' . $e->getMessage());
        }

        // Mark quote as payment_pending
        $this->db->prepare('UPDATE quotes SET status = "payment_pending" WHERE id = ?')
                 ->execute([$quote['id']]);

        $this->db->prepare('INSERT INTO quote_status_history (quote_id, old_status, new_status, changed_by_type, notes) VALUES (?, "confirmed", "payment_pending", "system", "Razorpay order created")')
                 ->execute([$quote['id']]);

        // Store pending payment record
        $this->db->prepare('
            INSERT INTO payments (quote_id, razorpay_order_id, amount, currency, status)
            VALUES (?, ?, ?, "INR", "created")
        ')->execute([$quote['id'], $rzpOrder->id, $quote['total_amount']]);

        respond(200, [
            'order_id' => $rzpOrder->id,
            'amount'   => $amountPaise,
            'currency' => 'INR',
            'key_id'   => RAZORPAY_KEY_ID,
            'quote_id' => $quote['id'],
            'receipt'  => $quote['quote_number'],
        ]);
    }

    // GET /payment/quote/:id — payment status for a quote
    public function getByQuote(string $quoteId): never {
        $userId = $GLOBALS['auth_user']['sub'];

        $stmt = $this->db->prepare('SELECT id FROM quotes WHERE id = ? AND user_id = ?');
        $stmt->execute([$quoteId, $userId]);
        if (!$stmt->fetch()) respond(404, 'Quote not found');

        $stmt = $this->db->prepare('
            SELECT id, razorpay_order_id, razorpay_payment_id, amount, currency,
                   payment_method, status, paid_at, created_at
            FROM payments WHERE quote_id = ? ORDER BY created_at DESC LIMIT 1
        ');
        $stmt->execute([$quoteId]);
        respond(200, $stmt->fetch() ?: null);
    }

    // POST /payment/webhook — Razorpay server-side webhook
    public function webhook(): void {
        $webhookSecret = RAZORPAY_KEY_SECRET;
        $payload       = file_get_contents('php://input');
        $signature     = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

        if ($signature) {
            $expectedSig = hash_hmac('sha256', $payload, $webhookSecret);
            if (!hash_equals($expectedSig, $signature)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid webhook signature']);
                exit;
            }
        }

        $event     = json_decode($payload, true);
        $eventName = $event['event'] ?? '';

        if ($eventName === 'payment.captured') {
            $pd      = $event['payload']['payment']['entity'];
            $orderId = $pd['order_id'];
            $payId   = $pd['id'];

            $stmt = $this->db->prepare('SELECT * FROM payments WHERE razorpay_order_id = ?');
            $stmt->execute([$orderId]);
            $payment = $stmt->fetch();

            if ($payment && $payment['status'] !== 'captured') {
                $this->db->prepare('
                    UPDATE payments SET razorpay_payment_id = ?, status = "captured",
                    paid_at = NOW(), payment_method = ? WHERE razorpay_order_id = ?
                ')->execute([$payId, $pd['method'] ?? null, $orderId]);

                $this->db->prepare('UPDATE quotes SET status = "paid" WHERE id = ?')
                         ->execute([$payment['quote_id']]);

                $this->db->prepare('
                    INSERT INTO quote_status_history (quote_id, old_status, new_status, changed_by_type, notes)
                    VALUES (?, "payment_pending", "paid", "system", "Payment captured via Razorpay webhook")
                ')->execute([$payment['quote_id']]);
            }
        }

        http_response_code(200);
        echo json_encode(['status' => 'ok']);
        exit;
    }

    // POST /payment/verify
    public function verify(): never {
        $data = input();

        $required = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'quote_id'];
        foreach ($required as $field) {
            if (empty($data[$field])) respond(422, "$field is required");
        }

        // Verify Razorpay signature
        $expectedSig = hash_hmac('sha256', $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'], RAZORPAY_KEY_SECRET);

        if (!hash_equals($expectedSig, $data['razorpay_signature'])) {
            respond(400, 'Payment signature verification failed');
        }

        // Record payment
        $userId = $GLOBALS['auth_user']['sub'];
        $stmt   = $this->db->prepare('SELECT id, total_amount FROM quotes WHERE id = ? AND user_id = ?');
        $stmt->execute([$data['quote_id'], $userId]);
        $quote = $stmt->fetch();

        if (!$quote) respond(404, 'Quote not found');

        $this->db->prepare('
            INSERT INTO payments (quote_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status, paid_at)
            VALUES (?, ?, ?, ?, ?, "captured", NOW())
        ')->execute([
            $quote['id'],
            $data['razorpay_order_id'],
            $data['razorpay_payment_id'],
            $data['razorpay_signature'],
            $quote['total_amount'],
        ]);

        // Update quote status
        $this->db->prepare('UPDATE quotes SET status = "paid" WHERE id = ?')
                 ->execute([$quote['id']]);

        $this->db->prepare('INSERT INTO quote_status_history (quote_id, old_status, new_status, changed_by_type, notes) VALUES (?, "payment_pending", "paid", "system", "Payment captured via Razorpay")')
                 ->execute([$quote['id']]);

        // Send payment confirmation email
        try {
            $stmtQ = $this->db->prepare('
                SELECT q.*, u.name, u.email, u.phone, u.company_name, u.gst_number
                FROM quotes q
                JOIN users u ON u.id = q.user_id
                WHERE q.id = ?
            ');
            $stmtQ->execute([$quote['id']]);
            $fullQuote = $stmtQ->fetch();

            if ($fullQuote) {
                $customer = [
                    'name'         => $fullQuote['name'],
                    'email'        => $fullQuote['email'],
                    'phone'        => $fullQuote['phone'],
                    'company_name' => $fullQuote['company_name'],
                    'gst_number'   => $fullQuote['gst_number'],
                ];
                $paymentRow = [
                    'razorpay_payment_id' => $data['razorpay_payment_id'],
                    'amount'              => $quote['total_amount'],
                ];
                $emailSvc = new EmailService();
                $emailSvc->sendPaymentReceived($fullQuote, $customer, $paymentRow);
            }
        } catch (\Throwable $e) {
            error_log('Payment email error: ' . $e->getMessage());
        }

        respond(200, ['message' => 'Payment verified successfully', 'quote_id' => $quote['id']]);
    }
}
