USE shunmugasteel_db;

-- ============================================================
-- SAMPLE PRICES — realistic Indian steel market rates (₹/ton)
-- Update variants and pricing rules for all 15 products
-- ============================================================

-- 1. HR Coils & Sheets
SET @hr = (SELECT id FROM products WHERE slug = 'hot-rolled-coils-sheets');
UPDATE product_variants SET price_per_unit = 55000 WHERE product_id = @hr AND variant_name LIKE '2mm%';
UPDATE product_variants SET price_per_unit = 56500 WHERE product_id = @hr AND variant_name LIKE '3mm%';
UPDATE product_variants SET price_per_unit = 57000 WHERE product_id = @hr AND variant_name LIKE '4mm%';
UPDATE product_variants SET price_per_unit = 58000 WHERE product_id = @hr AND variant_name LIKE '5mm%';
UPDATE product_variants SET price_per_unit = 59500 WHERE product_id = @hr AND variant_name LIKE '6mm%';
UPDATE product_pricing_rules SET price_per_ton = 56000 WHERE product_id = @hr;

-- 2. CR Coils & Sheets
SET @cr = (SELECT id FROM products WHERE slug = 'cold-rolled-coils-sheets');
UPDATE product_variants SET price_per_unit = 70000 WHERE product_id = @cr AND variant_name LIKE '0.5mm%';
UPDATE product_variants SET price_per_unit = 71500 WHERE product_id = @cr AND variant_name LIKE '0.8mm%';
UPDATE product_variants SET price_per_unit = 72000 WHERE product_id = @cr AND variant_name LIKE '1.0mm%';
UPDATE product_variants SET price_per_unit = 73500 WHERE product_id = @cr AND variant_name LIKE '1.2mm%';
UPDATE product_pricing_rules SET price_per_ton = 71000 WHERE product_id = @cr;

-- 3. GP Sheets & Coils
SET @gp = (SELECT id FROM products WHERE slug = 'gp-sheets-coils');
UPDATE product_pricing_rules SET price_per_ton = 84000, price_per_sqft = 78 WHERE product_id = @gp;

-- 4. GC Sheets
SET @gc = (SELECT id FROM products WHERE slug = 'galvanized-corrugated-sheets');
UPDATE product_variants SET price_per_unit = 310 WHERE product_id = @gc AND variant_name LIKE '0.45mm%';
UPDATE product_variants SET price_per_unit = 330 WHERE product_id = @gc AND variant_name LIKE '0.47mm%';
UPDATE product_variants SET price_per_unit = 360 WHERE product_id = @gc AND variant_name LIKE '0.50mm%';
UPDATE product_variants SET price_per_unit = 480 WHERE product_id = @gc AND variant_name LIKE '0.63mm%';

-- 5. PPGL Colour Coated Coils
SET @ppgl = (SELECT id FROM products WHERE slug = 'ppgl-colour-coated-coils');
UPDATE product_pricing_rules SET price_per_ton = 94000, price_per_sqft = 95 WHERE product_id = @ppgl;

-- 6. GP Slitted Coils
SET @gpsc = (SELECT id FROM products WHERE slug = 'gp-slitted-coils');
UPDATE product_pricing_rules SET price_per_ton = 86000 WHERE product_id = @gpsc;

-- 7. CR Slitted Coils
SET @crsc = (SELECT id FROM products WHERE slug = 'cr-slitted-coils');
UPDATE product_pricing_rules SET price_per_ton = 73000 WHERE product_id = @crsc;

-- 8. Steel Decking Sheets
SET @ds = (SELECT id FROM products WHERE slug = 'steel-decking-sheets');
UPDATE product_variants SET price_per_unit = 98  WHERE product_id = @ds AND variant_name LIKE '0.8mm%';
UPDATE product_variants SET price_per_unit = 110 WHERE product_id = @ds AND variant_name LIKE '0.9mm%';
UPDATE product_variants SET price_per_unit = 122 WHERE product_id = @ds AND variant_name LIKE '1.0mm%';

-- 9. PUF Sandwich Panels
SET @puf = (SELECT id FROM products WHERE slug = 'puf-sandwich-panels');
UPDATE product_pricing_rules SET price_per_sqft = 175 WHERE product_id = @puf;

-- 10. UPVC Roofing Sheets
SET @upvc = (SELECT id FROM products WHERE slug = 'upvc-roofing-sheets');
UPDATE product_variants SET price_per_unit = 820  WHERE product_id = @upvc AND variant_name LIKE '2mm%';
UPDATE product_variants SET price_per_unit = 1050 WHERE product_id = @upvc AND variant_name LIKE '2.5mm%';
UPDATE product_variants SET price_per_unit = 1280 WHERE product_id = @upvc AND variant_name LIKE '3mm%';

-- 11. Polycarbonate Roofing Sheets  (no variants — custom pricing)
-- (no variants seeded; available on request)

-- 12. Z & C Purlin
SET @purlin = (SELECT id FROM products WHERE slug = 'z-c-purlin');
UPDATE product_variants SET price_per_unit = 68  WHERE product_id = @purlin AND variant_name LIKE 'Z Purlin 150%';
UPDATE product_variants SET price_per_unit = 82  WHERE product_id = @purlin AND variant_name LIKE 'Z Purlin 200%';
UPDATE product_variants SET price_per_unit = 65  WHERE product_id = @purlin AND variant_name LIKE 'C Purlin 150%';
UPDATE product_variants SET price_per_unit = 78  WHERE product_id = @purlin AND variant_name LIKE 'C Purlin 200%';

-- 13. Roofing Screws
SET @screw = (SELECT id FROM products WHERE slug = 'roofing-screws');
UPDATE product_variants SET price_per_unit = 2800 WHERE product_id = @screw AND variant_name LIKE '%35mm%';
UPDATE product_variants SET price_per_unit = 3100 WHERE product_id = @screw AND variant_name LIKE '%50mm%';
UPDATE product_variants SET price_per_unit = 3600 WHERE product_id = @screw AND variant_name LIKE '%75mm%';

-- 14. Turbo Ventilator
SET @turbo = (SELECT id FROM products WHERE slug = 'turbo-ventilator');
UPDATE product_variants SET price_per_unit = 6500  WHERE product_id = @turbo AND variant_name LIKE '300mm%';
UPDATE product_variants SET price_per_unit = 9800  WHERE product_id = @turbo AND variant_name LIKE '450mm%';
UPDATE product_variants SET price_per_unit = 15500 WHERE product_id = @turbo AND variant_name LIKE '600mm%';

-- 15. Roofing Accessories (no fixed variants — custom quote)
-- (price on request)

-- Verify
SELECT p.name, pv.variant_name, pv.price_per_unit, pv.unit
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
ORDER BY p.id, pv.id;
