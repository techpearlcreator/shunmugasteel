<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailService {

    private function mailer(): PHPMailer {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;
        $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        return $mail;
    }

    // ─────────────────────────────────────────────────────────────
    // 1. Quote Submitted (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendQuoteSubmitted(array $quote, array $customer, ?string $pdfPath = null): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($customer['email'], $customer['name']);
            $mail->Subject = "Quote Request Received — {$quote['quote_number']} | Shunmuga Steel";

            if ($pdfPath && file_exists($pdfPath)) {
                $mail->addAttachment($pdfPath, $quote['quote_number'] . '.pdf');
            }

            $mail->Body = $this->wrapLayout(
                "Quote Request Received",
                "<p>Dear <strong>{$customer['name']}</strong>,</p>
                <p>Thank you for your enquiry. We have received your quote request <strong>{$quote['quote_number']}</strong>.</p>
                <p>Our sales team will review your requirements and get back to you within <strong>2 working hours</strong> (Mon–Sat, 9AM–6PM).</p>
                " . $this->summaryBox($quote) . "
                <p style='margin-top:24px;'>You can track your quote status anytime from your dashboard:</p>
                <p style='margin-top:12px;'>
                    <a href='" . FRONTEND_URL . "/my-quotes/{$quote['id']}' style='background:#E67E22;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>View My Quote</a>
                </p>"
            );
            $mail->AltBody = "Quote {$quote['quote_number']} received. Total: Rs {$quote['total_amount']}. Track at " . FRONTEND_URL . "/my-quotes/{$quote['id']}";

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendQuoteSubmitted — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. New Quote Notification (Admin)
    // ─────────────────────────────────────────────────────────────
    public function sendAdminNewQuote(array $quote, array $customer): bool {
        if (!SMTP_FROM) return false;
        try {
            $mail = $this->mailer();
            $mail->addAddress(SMTP_FROM, SMTP_FROM_NAME);
            $mail->Subject = "[NEW QUOTE] {$quote['quote_number']} from {$customer['name']}";

            $mail->Body = $this->wrapLayout(
                "New Quote Received",
                "<p>A new quote has been submitted via the website.</p>
                <table style='width:100%;border-collapse:collapse;margin:16px 0;'>
                    <tr><td style='padding:8px;color:#666;'>Customer</td><td style='padding:8px;font-weight:600;'>{$customer['name']}</td></tr>
                    <tr style='background:#f9f9f9;'><td style='padding:8px;color:#666;'>Email</td><td style='padding:8px;'>{$customer['email']}</td></tr>
                    <tr><td style='padding:8px;color:#666;'>Phone</td><td style='padding:8px;'>{$customer['phone']}</td></tr>
                    <tr style='background:#f9f9f9;'><td style='padding:8px;color:#666;'>Company</td><td style='padding:8px;'>{$customer['company_name']}</td></tr>
                    <tr><td style='padding:8px;color:#666;'>Quote #</td><td style='padding:8px;font-weight:600;'>{$quote['quote_number']}</td></tr>
                    <tr style='background:#f9f9f9;'><td style='padding:8px;color:#666;'>Total Amount</td><td style='padding:8px;font-weight:600;color:#E67E22;'>&#8377; " . number_format($quote['total_amount'], 2) . "</td></tr>
                </table>
                <p><a href='" . FRONTEND_URL . "' style='background:#2C3E50;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>Open Admin Panel</a></p>"
            );

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendAdminNewQuote — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Quote Reviewed (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendQuoteReviewed(array $quote, array $customer): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($customer['email'], $customer['name']);
            $mail->Subject = "Your Quote is Being Reviewed — {$quote['quote_number']}";

            $mail->Body = $this->wrapLayout(
                "Quote Under Review",
                "<p>Dear <strong>{$customer['name']}</strong>,</p>
                <p>Your quote <strong>{$quote['quote_number']}</strong> is currently being reviewed by our sales team.</p>
                <p>We will confirm the final pricing and availability shortly. You'll receive another email once the quote is confirmed.</p>
                " . $this->summaryBox($quote) . "
                <p style='margin-top:24px;'>
                    <a href='" . FRONTEND_URL . "/my-quotes/{$quote['id']}' style='background:#E67E22;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>Track Quote Status</a>
                </p>"
            );

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendQuoteReviewed — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Quote Confirmed — Payment Link (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendQuoteConfirmed(array $quote, array $customer, ?string $pdfPath = null): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($customer['email'], $customer['name']);
            $mail->Subject = "Quote Confirmed — Proceed to Payment | {$quote['quote_number']}";

            if ($pdfPath && file_exists($pdfPath)) {
                $mail->addAttachment($pdfPath, $quote['quote_number'] . '.pdf');
            }

            $mail->Body = $this->wrapLayout(
                "Quote Confirmed",
                "<p>Dear <strong>{$customer['name']}</strong>,</p>
                <p>Great news! Your quote <strong>{$quote['quote_number']}</strong> has been confirmed by our team.</p>
                <p>Please proceed with the payment to confirm your order. Your quote is valid until <strong>" . date('d M Y', strtotime($quote['valid_until'])) . "</strong>.</p>
                " . $this->summaryBox($quote) . "
                <p style='margin-top:24px;'>
                    <a href='" . FRONTEND_URL . "/my-quotes/{$quote['id']}' style='background:#E67E22;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>Pay Now</a>
                </p>
                <p style='margin-top:16px;font-size:13px;color:#888;'>You can pay securely via Card, UPI, or Net Banking through our payment gateway.</p>"
            );

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendQuoteConfirmed — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Payment Received — Receipt (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendPaymentReceived(array $quote, array $customer, array $payment): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($customer['email'], $customer['name']);
            $mail->Subject = "Payment Confirmed — Order in Progress | {$quote['quote_number']}";

            $mail->Body = $this->wrapLayout(
                "Payment Received",
                "<p>Dear <strong>{$customer['name']}</strong>,</p>
                <p>We have received your payment for quote <strong>{$quote['quote_number']}</strong>. Your order is now confirmed and being processed.</p>
                <table style='width:100%;border-collapse:collapse;margin:16px 0;background:#f9f9f9;border-radius:8px;overflow:hidden;'>
                    <tr><td style='padding:10px 16px;color:#666;'>Payment ID</td><td style='padding:10px 16px;font-family:monospace;'>{$payment['razorpay_payment_id']}</td></tr>
                    <tr style='background:#fff;'><td style='padding:10px 16px;color:#666;'>Amount Paid</td><td style='padding:10px 16px;font-weight:600;color:#27ae60;'>&#8377; " . number_format($payment['amount'], 2) . "</td></tr>
                    <tr><td style='padding:10px 16px;color:#666;'>Quote #</td><td style='padding:10px 16px;font-weight:600;'>{$quote['quote_number']}</td></tr>
                    <tr style='background:#fff;'><td style='padding:10px 16px;color:#666;'>Date</td><td style='padding:10px 16px;'>" . date('d M Y, h:i A') . "</td></tr>
                </table>
                <p>Our team will now arrange dispatch. You will be notified once the material is dispatched with tracking details.</p>
                <p style='margin-top:16px;'>
                    <a href='" . FRONTEND_URL . "/my-quotes/{$quote['id']}' style='background:#E67E22;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>View Order</a>
                </p>
                <p style='margin-top:24px;font-size:13px;color:#888;'>For any queries, call us at +91-7200240007 (Mon–Sat, 9AM–6PM)</p>"
            );

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendPaymentReceived — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 6. Email Verification (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendEmailVerification(array $user, string $verifyUrl): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($user['email'], $user['name']);
            $mail->Subject = "Verify your email — Shunmuga Steel";

            $mail->Body = $this->wrapLayout(
                "Verify Your Email",
                "<p>Dear <strong>{$user['name']}</strong>,</p>
                <p>Thank you for registering with Shunmuga Steel Traders. Please verify your email address to activate your account.</p>
                <p style='margin-top:24px;'>
                    <a href='{$verifyUrl}' style='background:#E67E22;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>Verify Email Address</a>
                </p>
                <p style='margin-top:20px;font-size:13px;color:#888;'>This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>"
            );
            $mail->AltBody = "Verify your email: {$verifyUrl}";

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendEmailVerification — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 7. Password Reset (Customer)
    // ─────────────────────────────────────────────────────────────
    public function sendPasswordReset(array $user, string $resetUrl): bool {
        try {
            $mail = $this->mailer();
            $mail->addAddress($user['email'], $user['name']);
            $mail->Subject = "Reset your password — Shunmuga Steel";

            $mail->Body = $this->wrapLayout(
                "Reset Your Password",
                "<p>Dear <strong>{$user['name']}</strong>,</p>
                <p>We received a request to reset the password for your account. Click the button below to set a new password.</p>
                <p style='margin-top:24px;'>
                    <a href='{$resetUrl}' style='background:#E67E22;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:600;display:inline-block;'>Reset Password</a>
                </p>
                <p style='margin-top:20px;font-size:13px;color:#888;'>This link expires in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>"
            );
            $mail->AltBody = "Reset your password: {$resetUrl}";

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log('EmailService::sendPasswordReset — ' . $e->getMessage());
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────
    private function summaryBox(array $quote): string {
        return "
        <table style='width:100%;border-collapse:collapse;margin:16px 0;background:#f9f9f9;border-radius:8px;overflow:hidden;'>
            <tr>
                <td style='padding:10px 16px;color:#666;font-size:14px;'>Quote Number</td>
                <td style='padding:10px 16px;font-weight:600;'>{$quote['quote_number']}</td>
            </tr>
            <tr style='background:#fff;'>
                <td style='padding:10px 16px;color:#666;font-size:14px;'>Subtotal</td>
                <td style='padding:10px 16px;'>&#8377; " . number_format($quote['subtotal'] ?? 0, 2) . "</td>
            </tr>
            <tr>
                <td style='padding:10px 16px;color:#666;font-size:14px;'>GST ({$quote['gst_percentage']}%)</td>
                <td style='padding:10px 16px;'>&#8377; " . number_format($quote['gst_amount'] ?? 0, 2) . "</td>
            </tr>
            <tr style='background:#E67E22;'>
                <td style='padding:12px 16px;color:#fff;font-weight:700;'>Total Amount</td>
                <td style='padding:12px 16px;color:#fff;font-weight:700;font-size:16px;'>&#8377; " . number_format($quote['total_amount'] ?? 0, 2) . "</td>
            </tr>
        </table>";
    }

    private function wrapLayout(string $title, string $content): string {
        return "
        <!DOCTYPE html>
        <html>
        <head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'></head>
        <body style='margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;'>
            <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f4f4;padding:24px 0;'>
                <tr><td align='center'>
                    <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);'>
                        <!-- Header -->
                        <tr><td style='background:#2C3E50;padding:24px 32px;text-align:center;'>
                            <h1 style='margin:0;color:#E67E22;font-size:22px;font-weight:700;letter-spacing:1px;'>SHUNMUGA STEEL TRADERS</h1>
                            <p style='margin:4px 0 0;color:#aab4be;font-size:13px;'>Authorised Dealer — SAIL · AMNS · JSW · Evonith</p>
                        </td></tr>
                        <!-- Title Bar -->
                        <tr><td style='background:#E67E22;padding:14px 32px;'>
                            <h2 style='margin:0;color:#fff;font-size:17px;font-weight:600;'>$title</h2>
                        </td></tr>
                        <!-- Body -->
                        <tr><td style='padding:28px 32px;color:#333;font-size:15px;line-height:1.7;'>
                            $content
                        </td></tr>
                        <!-- Footer -->
                        <tr><td style='background:#f8f8f8;padding:20px 32px;border-top:1px solid #eee;text-align:center;font-size:12px;color:#999;'>
                            <p style='margin:0;'>Shunmuga Steel Traders | Tamil Nadu, India | Est. 1976</p>
                            <p style='margin:4px 0 0;'>+91-7200240007 &bull; Mon–Sat: 9AM–6PM</p>
                            <p style='margin:8px 0 0;'>This is an automated email. Please do not reply directly.</p>
                        </td></tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>";
    }
}
