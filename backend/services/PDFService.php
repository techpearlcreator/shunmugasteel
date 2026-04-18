<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Dompdf\Dompdf;
use Dompdf\Options;

class PDFService {

    /**
     * Generate a quote PDF and save it to PDF_DIR.
     * Returns the full path to the saved file, or false on failure.
     */
    public function generateQuotePDF(array $quote, array $items, array $customer): string|false {
        try {
            $options = new Options();
            $options->set('defaultFont', 'Helvetica');
            $options->set('isRemoteEnabled', false);
            $options->set('isHtml5ParserEnabled', true);

            $dompdf = new Dompdf($options);
            $html   = $this->buildHTML($quote, $items, $customer);
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            // Ensure PDF_DIR exists
            if (!is_dir(PDF_DIR)) {
                mkdir(PDF_DIR, 0755, true);
            }

            $filename = PDF_DIR . $quote['quote_number'] . '.pdf';
            file_put_contents($filename, $dompdf->output());

            return $filename;
        } catch (\Exception $e) {
            error_log('PDFService::generateQuotePDF — ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Stream a PDF directly to browser for download.
     */
    public function streamQuotePDF(array $quote, array $items, array $customer): void {
        $options = new Options();
        $options->set('defaultFont', 'Helvetica');
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($this->buildHTML($quote, $items, $customer));
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        $dompdf->stream($quote['quote_number'] . '.pdf', ['Attachment' => true]);
        exit;
    }

    // ─────────────────────────────────────────────────────────────
    // HTML Template
    // ─────────────────────────────────────────────────────────────
    private function buildHTML(array $quote, array $items, array $customer): string {
        $quoteNum   = htmlspecialchars($quote['quote_number']);
        $validUntil = date('d M Y', strtotime($quote['valid_until']));
        $dateIssued = date('d M Y', strtotime($quote['created_at']));
        $gstPct     = $quote['gst_percentage'] ?? 18;
        $subtotal   = number_format($quote['subtotal'] ?? 0, 2);
        $gstAmt     = number_format($quote['gst_amount'] ?? 0, 2);
        $total      = number_format($quote['total_amount'] ?? 0, 2);

        // Customer details
        $custName    = htmlspecialchars($customer['name'] ?? '');
        $custCompany = htmlspecialchars($customer['company_name'] ?? '');
        $custEmail   = htmlspecialchars($customer['email'] ?? '');
        $custPhone   = htmlspecialchars($customer['phone'] ?? '');
        $custGST     = htmlspecialchars($customer['gst_number'] ?? 'Not provided');

        // Delivery address (stored as JSON)
        $addr = is_array($quote['delivery_address'])
            ? $quote['delivery_address']
            : (json_decode($quote['delivery_address'] ?? '{}', true) ?: []);
        $addrLine = implode(', ', array_filter([
            $addr['address'] ?? '',
            $addr['city']    ?? '',
            $addr['state']   ?? '',
            $addr['pincode'] ?? '',
        ]));

        // Build line items rows
        $rowsHTML   = '';
        $rowBg      = ['#ffffff', '#fafafa'];
        foreach ($items as $i => $item) {
            $bg       = $rowBg[$i % 2];
            $name     = htmlspecialchars($item['product_name']);
            $specs    = $item['specifications'] ?? '';
            if (is_string($specs)) {
                $specsArr = json_decode($specs, true) ?? [];
            } else {
                $specsArr = (array)$specs;
            }
            $specsText = $this->formatSpecs($specsArr);
            $qty       = htmlspecialchars((string)$item['quantity']) . ' ' . htmlspecialchars($item['unit'] ?? '');
            $brand     = htmlspecialchars($item['brand'] ?? '');
            $unitPrice = $item['is_custom'] ? 'TBD' : 'Rs ' . number_format($item['unit_price'] ?? 0, 2);
            $lineTotal = $item['is_custom'] ? 'TBD' : 'Rs ' . number_format($item['total_price'] ?? 0, 2);
            $customTag = $item['is_custom'] ? ' <span style="font-size:9px;background:#e8f4fd;color:#2980b9;padding:1px 5px;border-radius:3px;">Custom</span>' : '';

            $rowsHTML .= "
            <tr style='background:$bg;'>
                <td style='padding:8px 10px;font-size:12px;color:#333;border-bottom:1px solid #eee;'>" . ($i + 1) . "</td>
                <td style='padding:8px 10px;font-size:12px;color:#333;border-bottom:1px solid #eee;'>$name $customTag<br><span style='font-size:10px;color:#888;'>$brand</span></td>
                <td style='padding:8px 10px;font-size:11px;color:#555;border-bottom:1px solid #eee;'>$specsText</td>
                <td style='padding:8px 10px;font-size:12px;color:#333;border-bottom:1px solid #eee;text-align:center;'>$qty</td>
                <td style='padding:8px 10px;font-size:12px;color:#333;border-bottom:1px solid #eee;text-align:right;'>$unitPrice</td>
                <td style='padding:8px 10px;font-size:12px;font-weight:600;color:#2C3E50;border-bottom:1px solid #eee;text-align:right;'>$lineTotal</td>
            </tr>";
        }

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                * { margin:0; padding:0; box-sizing:border-box; }
                body { font-family: Helvetica, Arial, sans-serif; font-size:13px; color:#333; background:#fff; }
                .page { padding:32px 36px; }

                /* Header */
                .header { display:table; width:100%; margin-bottom:28px; }
                .header-left { display:table-cell; vertical-align:top; }
                .header-right { display:table-cell; vertical-align:top; text-align:right; }
                .company-name { font-size:22px; font-weight:700; color:#2C3E50; letter-spacing:0.5px; }
                .company-sub { font-size:10px; color:#E67E22; font-weight:600; letter-spacing:1px; margin-top:2px; }
                .company-contact { font-size:10px; color:#777; margin-top:6px; line-height:1.6; }
                .doc-title { font-size:26px; font-weight:700; color:#E67E22; letter-spacing:1px; }
                .doc-meta { font-size:11px; color:#555; margin-top:6px; line-height:1.7; }

                /* Divider */
                .divider { border:none; border-top:2px solid #E67E22; margin:0 0 20px; }

                /* Info grid */
                .info-grid { display:table; width:100%; margin-bottom:20px; }
                .info-col { display:table-cell; width:50%; vertical-align:top; }
                .info-box { background:#f8f8f8; border-radius:6px; padding:14px 16px; margin-right:8px; }
                .info-box-right { background:#f8f8f8; border-radius:6px; padding:14px 16px; margin-left:8px; }
                .info-label { font-size:9px; font-weight:700; color:#E67E22; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px; }
                .info-value { font-size:12px; color:#333; line-height:1.7; }
                .info-value strong { color:#2C3E50; }

                /* Table */
                table.items { width:100%; border-collapse:collapse; margin-bottom:20px; }
                table.items thead tr { background:#2C3E50; }
                table.items thead th { padding:10px 10px; font-size:10px; font-weight:700; color:#fff; letter-spacing:0.5px; text-align:left; }
                table.items thead th:last-child,
                table.items thead th:nth-child(5) { text-align:right; }
                table.items thead th:nth-child(4) { text-align:center; }

                /* Totals */
                .totals-wrap { display:table; width:100%; }
                .totals-spacer { display:table-cell; width:60%; }
                .totals-box { display:table-cell; width:40%; }
                .total-row { display:table; width:100%; padding:6px 0; border-bottom:1px solid #eee; }
                .total-label { display:table-cell; font-size:12px; color:#666; }
                .total-value { display:table-cell; font-size:12px; color:#333; text-align:right; }
                .total-row.grand { background:#2C3E50; border-radius:6px; padding:10px 12px; margin-top:4px; }
                .total-row.grand .total-label { color:#fff; font-weight:700; font-size:13px; }
                .total-row.grand .total-value { color:#E67E22; font-weight:700; font-size:14px; }

                /* Notes / Terms */
                .notes-section { margin-top:20px; }
                .notes-title { font-size:10px; font-weight:700; color:#2C3E50; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
                .notes-text { font-size:11px; color:#666; line-height:1.7; }

                .validity-banner { background:#fff8f0; border:1px solid #f0c080; border-radius:6px; padding:10px 14px; margin-bottom:20px; font-size:12px; color:#b7650a; }

                /* Footer */
                .footer { margin-top:28px; padding-top:16px; border-top:1px solid #eee; display:table; width:100%; }
                .footer-left { display:table-cell; font-size:10px; color:#999; }
                .footer-right { display:table-cell; text-align:right; font-size:10px; color:#999; }
                .stamp-area { margin-top:32px; padding-top:20px; border-top:1px dashed #ddd; display:table; width:100%; }
                .stamp-col { display:table-cell; width:50%; font-size:11px; color:#555; }
                .stamp-col.right { text-align:right; }
            </style>
        </head>
        <body>
        <div class='page'>

            <!-- Header -->
            <div class='header'>
                <div class='header-left'>
                    <div class='company-name'>SHUNMUGA STEEL TRADERS</div>
                    <div class='company-sub'>Authorised Dealer &mdash; SAIL &bull; AMNS India &bull; JSW &bull; Evonith</div>
                    <div class='company-contact'>
                        Tamil Nadu, India &nbsp;&bull;&nbsp; Est. 1976<br>
                        +91-7200240007 &nbsp;&bull;&nbsp; Mon&ndash;Sat: 9AM&ndash;6PM
                    </div>
                </div>
                <div class='header-right'>
                    <div class='doc-title'>QUOTATION</div>
                    <div class='doc-meta'>
                        <strong>#$quoteNum</strong><br>
                        Date: $dateIssued
                    </div>
                </div>
            </div>

            <hr class='divider'>

            <!-- Validity Banner -->
            <div class='validity-banner'>
                &#9200; This quote is valid until <strong>$validUntil</strong>. Prices subject to market fluctuation after this date.
            </div>

            <!-- Bill To / Delivery Info -->
            <div class='info-grid'>
                <div class='info-col'>
                    <div class='info-box'>
                        <div class='info-label'>Bill To</div>
                        <div class='info-value'>
                            <strong>$custName</strong><br>
                            " . ($custCompany ? "$custCompany<br>" : '') . "
                            GST: $custGST<br>
                            $custPhone<br>
                            $custEmail
                        </div>
                    </div>
                </div>
                <div class='info-col'>
                    <div class='info-box-right'>
                        <div class='info-label'>Delivery Address</div>
                        <div class='info-value'>
                            " . ($addrLine ? htmlspecialchars($addrLine) : 'As per billing address') . "
                            " . (!empty($addr['name']) ? '<br><strong>' . htmlspecialchars($addr['name']) . '</strong>' : '') . "
                            " . (!empty($addr['phone']) ? '<br>' . htmlspecialchars($addr['phone']) : '') . "
                        </div>
                    </div>
                </div>
            </div>

            <!-- Line Items Table -->
            <table class='items'>
                <thead>
                    <tr>
                        <th style='width:4%;'>#</th>
                        <th style='width:26%;'>Product</th>
                        <th style='width:30%;'>Specifications</th>
                        <th style='width:12%;text-align:center;'>Qty</th>
                        <th style='width:14%;text-align:right;'>Unit Price</th>
                        <th style='width:14%;text-align:right;'>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    $rowsHTML
                </tbody>
            </table>

            <!-- Totals -->
            <div class='totals-wrap'>
                <div class='totals-spacer'></div>
                <div class='totals-box'>
                    <div class='total-row'>
                        <span class='total-label'>Subtotal</span>
                        <span class='total-value'>Rs $subtotal</span>
                    </div>
                    <div class='total-row'>
                        <span class='total-label'>GST ($gstPct%)</span>
                        <span class='total-value'>+ Rs $gstAmt</span>
                    </div>
                    <div class='total-row grand'>
                        <span class='total-label'>Total Amount</span>
                        <span class='total-value'>Rs $total</span>
                    </div>
                </div>
            </div>

            <!-- Customer Notes -->
            " . (!empty($quote['customer_notes']) ? "
            <div class='notes-section' style='margin-top:16px;'>
                <div class='notes-title'>Customer Notes</div>
                <div class='notes-text'>" . htmlspecialchars($quote['customer_notes']) . "</div>
            </div>" : '') . "

            <!-- Terms -->
            <div class='notes-section'>
                <div class='notes-title'>Terms &amp; Conditions</div>
                <div class='notes-text'>
                    1. This quotation is valid for 7 days from the date of issue.<br>
                    2. Prices are subject to change based on market rates and material availability.<br>
                    3. Transport / delivery charges are not included unless specified.<br>
                    4. GST will be charged as applicable at the time of invoice.<br>
                    5. Payment terms as agreed. Advance required to confirm order.
                </div>
            </div>

            <!-- Signature Area -->
            <div class='stamp-area'>
                <div class='stamp-col'>
                    <p style='margin-bottom:36px;'>Customer Acceptance:</p>
                    <p>_______________________________</p>
                    <p style='margin-top:4px;font-size:10px;color:#aaa;'>Signature &amp; Date</p>
                </div>
                <div class='stamp-col right'>
                    <p style='margin-bottom:36px;'>For Shunmuga Steel Traders:</p>
                    <p>_______________________________</p>
                    <p style='margin-top:4px;font-size:10px;color:#aaa;'>Authorised Signatory</p>
                </div>
            </div>

            <!-- Footer -->
            <div class='footer'>
                <div class='footer-left'>Generated on " . date('d M Y') . " &bull; $quoteNum</div>
                <div class='footer-right'>Shunmuga Steel Traders &bull; Tamil Nadu &bull; Est. 1976</div>
            </div>

        </div>
        </body>
        </html>";
    }

    private function formatSpecs(array $specs): string {
        if (isset($specs['variant'])) return htmlspecialchars($specs['variant']);
        $parts = [];
        foreach (['thickness', 'width', 'length', 'grade'] as $k) {
            if (!empty($specs[$k])) {
                $parts[] = ucfirst($k) . ': ' . htmlspecialchars((string)$specs[$k]);
            }
        }
        // Custom dimension fields
        foreach (['length_mm', 'width_mm', 'thickness_mm', 'height_mm'] as $k) {
            if (!empty($specs[$k])) {
                $parts[] = str_replace('_mm', '', ucfirst($k)) . ': ' . htmlspecialchars((string)$specs[$k]) . 'mm';
            }
        }
        return implode(', ', $parts) ?: '—';
    }
}
