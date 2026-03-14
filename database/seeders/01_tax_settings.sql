USE shunmugasteel_db;

-- Default Tax & GST Settings
INSERT INTO tax_settings (setting_key, setting_value, label, description) VALUES
('default_gst', '18.00', 'Default GST Rate (%)', 'Applied to all products unless overridden'),
('steel_flat_gst', '18.00', 'Flat Steel Products GST (%)', 'HR Coils, CR Coils, GP Sheets, GC Sheets, PPGL'),
('roofing_gst', '18.00', 'Roofing Products GST (%)', 'Decking Sheets, PUF Panels, UPVC, Polycarbonate'),
('accessories_gst', '18.00', 'Accessories GST (%)', 'Purlin, Screws, Turbo Fan, Roofing Accessories'),
('quote_validity_days', '7', 'Quote Validity (Days)', 'Number of days a quote remains valid after generation'),
('loading_charges', '500.00', 'Default Loading Charges (₹)', 'Per order loading charge added to quote'),
('freight_per_km', '0.00', 'Freight Rate per KM (₹)', 'Set 0 to disable auto freight calculation'),
('min_order_value', '5000.00', 'Minimum Order Value (₹)', 'Minimum quote value accepted');
