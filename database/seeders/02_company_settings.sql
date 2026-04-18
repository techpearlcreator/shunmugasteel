USE shunmugasteel_db;

INSERT INTO company_settings (setting_key, setting_value, setting_group) VALUES
-- General
('company_name', 'Shunmuga Steel Traders', 'general'),
('company_tagline', "Tamil Nadu's No.1 Steel Supplier Since 1976", 'general'),
('company_established', '1976', 'general'),
('company_gst_number', '', 'general'),
('company_cin', '', 'general'),
('company_address', '', 'general'),
('company_city', 'Tamil Nadu', 'general'),
('company_state', 'Tamil Nadu', 'general'),
('company_pincode', '', 'general'),
('company_phone', '', 'general'),
('company_email', '', 'general'),
('company_whatsapp', '', 'general'),
('company_website', 'www.shunmugasteel.com', 'general'),
('working_hours', 'Monday–Saturday: 9:00 AM – 6:00 PM', 'general'),
-- SMTP
('smtp_host', 'smtp.gmail.com', 'smtp'),
('smtp_port', '587', 'smtp'),
('smtp_username', '', 'smtp'),
('smtp_password', '', 'smtp'),
('smtp_from_name', 'Shunmuga Steel Traders', 'smtp'),
('smtp_from_email', '', 'smtp'),
-- Payment
('razorpay_key_id', '', 'payment'),
('razorpay_key_secret', '', 'payment'),
('razorpay_mode', 'test', 'payment'),
-- Quote
('quote_prefix', 'SST', 'quote'),
('quote_footer_terms', 'This quotation is valid for 7 days from the date of issue. Prices are subject to change based on market conditions. GST as applicable. Delivery charges extra unless specified. E&OE.', 'quote'),
('quote_bank_name', '', 'quote'),
('quote_account_number', '', 'quote'),
('quote_ifsc', '', 'quote'),
('quote_upi_id', '', 'quote');
