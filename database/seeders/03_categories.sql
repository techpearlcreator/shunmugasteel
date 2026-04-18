USE shunmugasteel_db;

-- Parent Categories
INSERT IGNORE INTO categories (name, slug, image, description, parent_id, sort_order) VALUES
('Flat Products', 'flat-products', 'uploads/categories/flat-products.jpg', 'High-quality flat steel products including HR Coils, CR Coils, GP and GC Sheets', NULL, 1),
('Roofing Products', 'roofing-products', 'uploads/categories/roofing-products.jpg', 'Complete roofing solutions — decking sheets, PUF panels, UPVC and polycarbonate sheets', NULL, 2),
('Accessories', 'accessories', 'uploads/categories/accessories.jpg', 'Roofing and structural accessories — purlin, screws, turbo fans, ridge caps', NULL, 3);

-- Flat Products Sub-categories
INSERT IGNORE INTO categories (name, slug, image, description, parent_id, sort_order) VALUES
('HR Coils & Sheets', 'hr-coils-sheets', 'uploads/categories/hr-coils.jpg', 'Hot Rolled steel coils and sheets — structural grade', 1, 1),
('CR Coils & Sheets', 'cr-coils-sheets', 'uploads/categories/cr-coils.jpg', 'Cold Rolled steel coils and sheets — precision surface finish', 1, 2),
('GP Sheets & Coils', 'gp-sheets-coils', 'uploads/categories/gp-sheets.jpg', 'Galvanized Plain sheets and coils — corrosion resistant', 1, 3),
('GC Sheets', 'gc-sheets', 'uploads/categories/gc-sheets.jpg', 'Galvanized Corrugated sheets — for roofing and cladding', 1, 4),
('PPGL Colour Coils', 'ppgl-colour-coils', 'uploads/categories/ppgl-coils.jpg', 'Pre-Painted Galvalume — 30+ colour shades available', 1, 5),
('GP Slitted Coil', 'gp-slitted-coil', 'uploads/categories/gp-slitted-coil.jpg', 'Galvanized Plain slitted coils — custom slit widths', 1, 6),
('CR Slitted Coil', 'cr-slitted-coil', 'uploads/categories/cr-slitted-coil.jpg', 'Cold Rolled slitted coils — precision width cuts', 1, 7);

-- Roofing Products Sub-categories
INSERT IGNORE INTO categories (name, slug, image, description, parent_id, sort_order) VALUES
('Decking Sheets', 'decking-sheets', 'uploads/categories/decking-sheets.jpg', 'Steel decking / floor deck sheets for industrial construction', 2, 1),
('PUF Panels', 'puf-panels', 'uploads/categories/puf-panels.jpg', 'Polyurethane Foam insulated sandwich panels — walls and roofing', 2, 2),
('UPVC Sheets', 'upvc-sheets', 'uploads/categories/upvc-sheets.jpg', 'UPVC roofing sheets — lightweight and UV resistant', 2, 3),
('Polycarbonate Sheets', 'polycarbonate-sheets', 'uploads/categories/polycarbonate-sheets.jpg', 'Polycarbonate transparent/tinted roofing sheets', 2, 4);

-- Accessories Sub-categories
INSERT IGNORE INTO categories (name, slug, image, description, parent_id, sort_order) VALUES
('Purlin', 'purlin', 'uploads/categories/purlin.jpg', 'Z and C section purlin for roofing support structures', 3, 1),
('Roofing Screws', 'roofing-screws', 'uploads/categories/screws.jpg', 'Self-drilling and self-tapping roofing screws with EPDM washer', 3, 2),
('Turbo Ventilator', 'turbo-ventilator', 'uploads/categories/turbo-fan.jpg', 'Wind-driven turbo ventilators for industrial roofing', 3, 3),
('Roofing Accessories', 'roofing-accessories', 'uploads/categories/roofing-accessories.jpg', 'Ridge caps, flashings, gutters, downspouts and other roofing accessories', 3, 4);
