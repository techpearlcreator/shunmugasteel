USE shunmugasteel_db;

-- ============================================================
-- PRODUCTS SEED DATA
-- ============================================================

-- 1. HR Coils & Sheets (category_id = 4)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(4, 'Hot Rolled Coils & Sheets', 'hot-rolled-coils-sheets',
 'Structural grade HR coils and sheets. IS 2062 certified. Available in custom thickness and dimensions.',
 'Hot Rolled (HR) Steel Coils and Sheets are produced by rolling steel at high temperatures. Ideal for fabrication, construction, and general engineering applications. Available from leading mills — SAIL, AMNS India, JSW Steel and Evonith.',
 'both', 'Multiple', 'in_stock', 1, 1);

SET @hr_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary, sort_order) VALUES
(@hr_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/hot-rolled-coils-sheets-bannerb1f5.jpg', 1, 1),
(@hr_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/hot-rolled-coils-sheets-bannerc5c5.jpg', 0, 2);

INSERT INTO product_specs (product_id, spec_name, spec_value, sort_order) VALUES
(@hr_id, 'Grade', 'IS 2062 E250, E350, E410', 1),
(@hr_id, 'Thickness Range', '2mm – 25mm', 2),
(@hr_id, 'Width Range', '900mm – 2000mm', 3),
(@hr_id, 'Surface Finish', 'Hot Rolled Pickled & Oiled (HRPO)', 4),
(@hr_id, 'Application', 'Structural fabrication, Bridges, Automotive, General engineering', 5);

INSERT INTO product_variants (product_id, variant_name, thickness, width, grade, price_per_unit, unit, min_order_qty) VALUES
(@hr_id, '2mm × 1250mm — IS 2062 E250', '2mm', '1250mm', 'IS 2062 E250', 0.00, 'ton', 1),
(@hr_id, '3mm × 1250mm — IS 2062 E250', '3mm', '1250mm', 'IS 2062 E250', 0.00, 'ton', 1),
(@hr_id, '4mm × 1250mm — IS 2062 E250', '4mm', '1250mm', 'IS 2062 E250', 0.00, 'ton', 1),
(@hr_id, '5mm × 1500mm — IS 2062 E250', '5mm', '1500mm', 'IS 2062 E250', 0.00, 'ton', 1),
(@hr_id, '6mm × 1500mm — IS 2062 E350', '6mm', '1500mm', 'IS 2062 E350', 0.00, 'ton', 1);

INSERT INTO product_pricing_rules (product_id, price_per_ton, primary_pricing_unit, min_order_qty) VALUES
(@hr_id, 0.00, 'ton', 1);

-- 2. CR Coils & Sheets (category_id = 5)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(5, 'Cold Rolled Coils & Sheets', 'cold-rolled-coils-sheets',
 'Precision surface finish CR coils and sheets. IS 513 certified. Ideal for automotive and appliance industries.',
 'Cold Rolled (CR) Steel Coils and Sheets offer superior surface finish and tighter dimensional tolerances compared to HR steel. Widely used in automobiles, white goods, furniture, and precision fabrication.',
 'both', 'Multiple', 'in_stock', 1, 1);

SET @cr_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@cr_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/cold-rolled-steel072e.jpg', 1),
(@cr_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/images/SST-CR-Coils-2ec0d.png', 0),
(@cr_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/0-25mm-cold-rolled-coil-1000x1000cf88.jpg', 0);

INSERT INTO product_specs (product_id, spec_name, spec_value, sort_order) VALUES
(@cr_id, 'Grade', 'IS 513 CR1, CR2, CR3, CR4', 1),
(@cr_id, 'Thickness Range', '0.25mm – 3.15mm', 2),
(@cr_id, 'Width Range', '700mm – 1500mm', 3),
(@cr_id, 'Surface Finish', 'Bright Annealed / Skin Passed', 4),
(@cr_id, 'Application', 'Automotive panels, White goods, Furniture, Precision parts', 5);

INSERT INTO product_variants (product_id, variant_name, thickness, width, grade, price_per_unit, unit, min_order_qty) VALUES
(@cr_id, '0.5mm × 1000mm — IS 513 CR2', '0.5mm', '1000mm', 'IS 513 CR2', 0.00, 'ton', 1),
(@cr_id, '0.8mm × 1000mm — IS 513 CR2', '0.8mm', '1000mm', 'IS 513 CR2', 0.00, 'ton', 1),
(@cr_id, '1.0mm × 1250mm — IS 513 CR2', '1.0mm', '1250mm', 'IS 513 CR2', 0.00, 'ton', 1),
(@cr_id, '1.2mm × 1250mm — IS 513 CR3', '1.2mm', '1250mm', 'IS 513 CR3', 0.00, 'ton', 1);

INSERT INTO product_pricing_rules (product_id, price_per_ton, primary_pricing_unit, min_order_qty) VALUES
(@cr_id, 0.00, 'ton', 1);

-- 3. GP Sheets & Coils (category_id = 6)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(6, 'GP Sheets & Coils', 'gp-sheets-coils',
 'Galvanized Plain steel sheets and coils. Superior corrosion resistance. IS 277 certified.',
 'Galvanized Plain (GP) steel sheets are cold rolled steel coated with zinc for corrosion protection. Used extensively in roofing, cladding, ducts, and general fabrication where corrosion resistance is critical.',
 'both', 'Multiple', 'in_stock', 1, 1);

SET @gp_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@gp_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/gpsheetcoilc6bd.jpg', 1),
(@gp_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/galvanized-steel-sheets47fe.jpg', 0);

INSERT INTO product_specs (product_id, spec_name, spec_value, sort_order) VALUES
(@gp_id, 'Standard', 'IS 277', 1),
(@gp_id, 'Zinc Coating', '120 GSM – 275 GSM', 2),
(@gp_id, 'Thickness Range', '0.20mm – 3.0mm', 3),
(@gp_id, 'Width Range', '600mm – 1500mm', 4),
(@gp_id, 'Application', 'Roofing, Cladding, HVAC ducts, Automotive', 5);

INSERT INTO product_pricing_rules (product_id, price_per_ton, price_per_sqft, primary_pricing_unit, min_order_qty) VALUES
(@gp_id, 0.00, 0.00, 'ton', 1);

-- 4. GC Sheets (category_id = 7)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(7, 'Galvanized Corrugated Sheets', 'galvanized-corrugated-sheets',
 'Zinc-coated corrugated roofing sheets. Lightweight, strong, and weather resistant.',
 'Galvanized Corrugated (GC) sheets are zinc-coated steel sheets with corrugated profile. Widely used for industrial and agricultural roofing, boundary walls, and temporary structures. Available in standard corrugation profiles.',
 'standard', 'Multiple', 'in_stock', 1, 1);

SET @gc_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@gc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/galvanized-corrugated-sheets7d36.jpg', 1),
(@gc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/galvanized-corrugated-sheets-48b47.png', 0);

INSERT INTO product_variants (product_id, variant_name, thickness, width, grade, price_per_unit, unit, min_order_qty) VALUES
(@gc_id, '0.45mm × 1000mm × 6ft — GI 120GSM', '0.45mm', '1000mm', 'IS 277 GI 120GSM', 0.00, 'sheet', 100),
(@gc_id, '0.47mm × 1000mm × 8ft — GI 120GSM', '0.47mm', '1000mm', 'IS 277 GI 120GSM', 0.00, 'sheet', 100),
(@gc_id, '0.50mm × 1000mm × 10ft — GI 120GSM', '0.50mm', '1000mm', 'IS 277 GI 120GSM', 0.00, 'sheet', 100),
(@gc_id, '0.63mm × 1000mm × 12ft — GI 180GSM', '0.63mm', '1000mm', 'IS 277 GI 180GSM', 0.00, 'sheet', 50);

-- 5. PPGL Colour Coils (category_id = 8)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(8, 'PPGL Colour Coated Coils', 'ppgl-colour-coated-coils',
 'Pre-painted galvalume coils — 30+ colour shades. Excellent weathering and corrosion resistance.',
 'Pre-Painted Galvalume (PPGL) coils feature a zinc-aluminium alloy coating with factory-applied paint. Available in 30+ colours. Ideal for industrial roofing, wall cladding, and architectural applications where aesthetics and durability are both required.',
 'both', 'Multiple', 'in_stock', 1, 1);

SET @ppgl_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@ppgl_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/Color-Coated-Coilsb58b.jpg', 1),
(@ppgl_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/color-coilb85d.png', 0);

INSERT INTO product_pricing_rules (product_id, price_per_ton, price_per_sqft, primary_pricing_unit, min_order_qty) VALUES
(@ppgl_id, 0.00, 0.00, 'sqft', 1);

-- 6. GP Slitted Coil (category_id = 9)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(9, 'GP Slitted Coils', 'gp-slitted-coils',
 'Galvanized Plain slitted coils cut to custom slit widths. Minimum order applicable.',
 'GP Slitted Coils are galvanized steel coils precision-cut to custom slit widths for tube mills, roll-forming lines, and stamping operations. Available in various zinc coating grades.',
 'custom', 'Multiple', 'in_stock', 0);

SET @gpsc_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@gpsc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/gp-slit-coil-952cf2f.jpg', 1);

INSERT INTO product_pricing_rules (product_id, price_per_ton, primary_pricing_unit, min_order_qty) VALUES
(@gpsc_id, 0.00, 'ton', 1);

-- 7. CR Slitted Coil (category_id = 10)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(10, 'CR Slitted Coils', 'cr-slitted-coils',
 'Cold Rolled slitted coils with precision width cuts for automotive and appliance industries.',
 'CR Slitted Coils are cold rolled steel coils slit to exact customer-specified widths. High dimensional accuracy with tight tolerances. Suitable for tube mills, lock industries, and precision roll-forming.',
 'custom', 'Multiple', 'in_stock', 0);

SET @crsc_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@crsc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/images/cr-slit-coilsa096.jpg', 1);

INSERT INTO product_pricing_rules (product_id, price_per_ton, primary_pricing_unit, min_order_qty) VALUES
(@crsc_id, 0.00, 'ton', 1);

-- 8. Decking Sheets (category_id = 11)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(11, 'Steel Decking Sheets', 'steel-decking-sheets',
 'Composite floor decking sheets for RCC slabs in industrial and commercial construction.',
 'Steel Decking Sheets (floor deck) are profiled steel sheets used as permanent formwork and reinforcement for concrete slabs. Significantly reduces construction time and concrete usage.',
 'standard', 'Multiple', 'in_stock', 1, 1);

SET @ds_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@ds_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/decking-sheets-17e37.jpg', 1),
(@ds_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/decking-sheetsa142.jpg', 0);

INSERT INTO product_variants (product_id, variant_name, thickness, grade, price_per_unit, unit, min_order_qty) VALUES
(@ds_id, '0.8mm — 76mm Rib Profile', '0.8mm', 'Galvalume AZ150', 0.00, 'sqft', 500),
(@ds_id, '0.9mm — 76mm Rib Profile', '0.9mm', 'Galvalume AZ150', 0.00, 'sqft', 500),
(@ds_id, '1.0mm — 76mm Rib Profile', '1.0mm', 'Galvalume AZ150', 0.00, 'sqft', 500);

-- 9. PUF Panels (category_id = 12)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(12, 'PUF Sandwich Panels', 'puf-sandwich-panels',
 'Polyurethane foam insulated sandwich panels for cold rooms, warehouses, and industrial buildings.',
 'PUF (Polyurethane Foam) Sandwich Panels consist of two steel sheets bonded to a rigid polyurethane foam core. Excellent thermal and sound insulation. Used for cold rooms, pharmaceutical facilities, and industrial buildings.',
 'custom', 'Multiple', 'in_stock', 1, 1);

SET @puf_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@puf_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/PUF Panels 1c328.png', 1),
(@puf_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/PUF Panels8be3.png', 0);

INSERT INTO product_pricing_rules (product_id, price_per_sqft, primary_pricing_unit, min_order_qty) VALUES
(@puf_id, 0.00, 'sqft', 100);

-- 10. UPVC Sheets (category_id = 13)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(13, 'UPVC Roofing Sheets', 'upvc-roofing-sheets',
 'UV-resistant UPVC roofing sheets. Lightweight, corrosion-free, and long-lasting.',
 'UPVC (Unplasticized Polyvinyl Chloride) roofing sheets are lightweight, corrosion-resistant, and UV-stabilized. Ideal for industrial sheds, warehouses, and agricultural buildings. Available in various corrugation profiles and colours.',
 'standard', 'Multiple', 'in_stock', 0);

SET @upvc_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@upvc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/UPVC Sheet46e3.png', 1);

INSERT INTO product_variants (product_id, variant_name, thickness, grade, price_per_unit, unit, min_order_qty) VALUES
(@upvc_id, '2mm Corrugated UPVC Sheet', '2mm', 'UPVC Grade A', 0.00, 'sheet', 50),
(@upvc_id, '2.5mm Corrugated UPVC Sheet', '2.5mm', 'UPVC Grade A', 0.00, 'sheet', 50),
(@upvc_id, '3mm Corrugated UPVC Sheet', '3mm', 'UPVC Grade A', 0.00, 'sheet', 25);

-- 11. Polycarbonate Sheets (category_id = 14)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(14, 'Polycarbonate Roofing Sheets', 'polycarbonate-roofing-sheets',
 'Transparent and tinted polycarbonate sheets for natural daylighting in industrial roofs.',
 'Polycarbonate sheets allow natural light into industrial buildings while offering impact resistance and UV protection. Available in clear, opal, and tinted variants. Lightweight alternative to glass.',
 'standard', 'Multiple', 'in_stock', 0);

SET @pc_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@pc_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/polycarbonate-sheets-1b014.jpg', 1);

-- 12. Purlin (category_id = 15)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured, sort_order) VALUES
(15, 'Z & C Purlin', 'z-c-purlin',
 'Hot-dip galvanized Z and C section purlin for roofing structures.',
 'Purlin are horizontal structural members forming the secondary steel in a building frame supporting roof and wall cladding. Z-purlin and C-purlin available in various sizes. Pre-punched with installation holes for quick assembly.',
 'standard', 'Multiple', 'in_stock', 1, 1);

SET @purlin_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@purlin_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/purlin-108a6.jpg', 1),
(@purlin_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/purlinc517.jpg', 0);

INSERT INTO product_variants (product_id, variant_name, thickness, grade, price_per_unit, unit, min_order_qty) VALUES
(@purlin_id, 'Z Purlin 150×65mm 2mm thk', '2mm', 'S250', 0.00, 'meter', 100),
(@purlin_id, 'Z Purlin 200×65mm 2.5mm thk', '2.5mm', 'S250', 0.00, 'meter', 100),
(@purlin_id, 'C Purlin 150×65mm 2mm thk', '2mm', 'S250', 0.00, 'meter', 100),
(@purlin_id, 'C Purlin 200×65mm 2.5mm thk', '2.5mm', 'S250', 0.00, 'meter', 100);

-- 13. Roofing Screws (category_id = 16)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(16, 'Roofing Screws', 'roofing-screws',
 'Self-drilling hex head screws with EPDM washer for metal roofing.',
 'High-tensile self-drilling roofing screws with EPDM bonded washer for weather-tight fixing of roofing sheets to purlin. Zinc-plated and available in various lengths.',
 'standard', 'Multiple', 'in_stock', 0);

SET @screw_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@screw_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/screws1580.jpg', 1);

INSERT INTO product_variants (product_id, variant_name, grade, price_per_unit, unit, min_order_qty) VALUES
(@screw_id, 'HEX 14 × 35mm Self Drilling — 250pcs/box', 'Zinc Plated', 0.00, 'box', 5),
(@screw_id, 'HEX 14 × 50mm Self Drilling — 250pcs/box', 'Zinc Plated', 0.00, 'box', 5),
(@screw_id, 'HEX 14 × 75mm Self Drilling — 250pcs/box', 'Zinc Plated', 0.00, 'box', 5);

-- 14. Turbo Ventilator (category_id = 17)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(17, 'Turbo Ventilator', 'turbo-ventilator',
 'Wind-driven turbo ventilators for natural industrial roof ventilation. No electricity required.',
 'Turbo Ventilators are wind-driven exhaust ventilators installed on industrial roofs to extract hot air, fumes, and moisture without electricity. Stainless steel or aluminium construction. Various sizes from 300mm to 600mm diameter.',
 'standard', 'Multiple', 'in_stock', 0);

SET @turbo_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@turbo_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/Turbo-Fan12e6.jpg', 1);

INSERT INTO product_variants (product_id, variant_name, grade, price_per_unit, unit, min_order_qty) VALUES
(@turbo_id, '300mm Diameter Turbo Ventilator', 'Aluminium', 0.00, 'piece', 1),
(@turbo_id, '450mm Diameter Turbo Ventilator', 'Aluminium', 0.00, 'piece', 1),
(@turbo_id, '600mm Diameter Turbo Ventilator', 'SS 304', 0.00, 'piece', 1);

-- 15. Roofing Accessories (category_id = 18)
INSERT INTO products (category_id, name, slug, short_description, description, product_type, brand, stock_status, is_featured) VALUES
(18, 'Roofing Accessories', 'roofing-accessories',
 'Ridge caps, flashings, gutters, downspouts and complete roofing accessory solutions.',
 'Complete range of roofing accessories including ridge caps, eave flashings, barge boards, gutters, and downspouts. Colour-matched to PPGL sheets. Available in galvanized and colour-coated finishes.',
 'standard', 'Multiple', 'in_stock', 0);

SET @ra_id = LAST_INSERT_ID();

INSERT INTO product_images (product_id, image_path, is_primary) VALUES
(@ra_id, '../../My Web Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/roofing-accessories-types0572.jpg', 1);
