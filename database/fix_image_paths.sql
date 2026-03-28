USE shunmugasteel_db;

-- Fix product_images paths to clean filenames under uploads/products/
-- Spaces in filenames are also sanitised (PUF Panels, UPVC Sheet)

UPDATE product_images SET image_path = 'uploads/products/hot-rolled-coils-sheets-bannerb1f5.jpg'
  WHERE image_path LIKE '%hot-rolled-coils-sheets-bannerb1f5%';

UPDATE product_images SET image_path = 'uploads/products/hot-rolled-coils-sheets-bannerc5c5.jpg'
  WHERE image_path LIKE '%hot-rolled-coils-sheets-bannerc5c5%';

UPDATE product_images SET image_path = 'uploads/products/cold-rolled-steel072e.jpg'
  WHERE image_path LIKE '%cold-rolled-steel072e%';

UPDATE product_images SET image_path = 'uploads/products/SST-CR-Coils-2ec0d.png'
  WHERE image_path LIKE '%SST-CR-Coils-2ec0d%';

UPDATE product_images SET image_path = 'uploads/products/0-25mm-cold-rolled-coil-1000x1000cf88.jpg'
  WHERE image_path LIKE '%0-25mm-cold-rolled-coil%';

UPDATE product_images SET image_path = 'uploads/products/gpsheetcoilc6bd.jpg'
  WHERE image_path LIKE '%gpsheetcoilc6bd%';

UPDATE product_images SET image_path = 'uploads/products/galvanized-steel-sheets47fe.jpg'
  WHERE image_path LIKE '%galvanized-steel-sheets47fe%';

UPDATE product_images SET image_path = 'uploads/products/galvanized-corrugated-sheets7d36.jpg'
  WHERE image_path LIKE '%galvanized-corrugated-sheets7d36%';

UPDATE product_images SET image_path = 'uploads/products/galvanized-corrugated-sheets-48b47.png'
  WHERE image_path LIKE '%galvanized-corrugated-sheets-48b47%';

UPDATE product_images SET image_path = 'uploads/products/Color-Coated-Coilsb58b.jpg'
  WHERE image_path LIKE '%Color-Coated-Coilsb58b%';

UPDATE product_images SET image_path = 'uploads/products/color-coilb85d.png'
  WHERE image_path LIKE '%color-coilb85d%';

UPDATE product_images SET image_path = 'uploads/products/gp-slit-coil-952cf2f.jpg'
  WHERE image_path LIKE '%gp-slit-coil-952cf2f%';

UPDATE product_images SET image_path = 'uploads/products/cr-slit-coilsa096.jpg'
  WHERE image_path LIKE '%cr-slit-coilsa096%';

UPDATE product_images SET image_path = 'uploads/products/decking-sheets-17e37.jpg'
  WHERE image_path LIKE '%decking-sheets-17e37%';

UPDATE product_images SET image_path = 'uploads/products/decking-sheetsa142.jpg'
  WHERE image_path LIKE '%decking-sheetsa142%';

UPDATE product_images SET image_path = 'uploads/products/PUF-Panels-1c328.png'
  WHERE image_path LIKE '%PUF Panels 1c328%' OR image_path LIKE '%PUF-Panels-1c328%';

UPDATE product_images SET image_path = 'uploads/products/PUF-Panels8be3.png'
  WHERE image_path LIKE '%PUF Panels8be3%' OR image_path LIKE '%PUF-Panels8be3%';

UPDATE product_images SET image_path = 'uploads/products/UPVC-Sheet46e3.png'
  WHERE image_path LIKE '%UPVC Sheet46e3%' OR image_path LIKE '%UPVC-Sheet46e3%';

UPDATE product_images SET image_path = 'uploads/products/polycarbonate-sheets-1b014.jpg'
  WHERE image_path LIKE '%polycarbonate-sheets-1b014%';

UPDATE product_images SET image_path = 'uploads/products/purlin-108a6.jpg'
  WHERE image_path LIKE '%purlin-108a6%';

UPDATE product_images SET image_path = 'uploads/products/purlinc517.jpg'
  WHERE image_path LIKE '%purlinc517%';

UPDATE product_images SET image_path = 'uploads/products/screws1580.jpg'
  WHERE image_path LIKE '%screws1580%';

UPDATE product_images SET image_path = 'uploads/products/Turbo-Fan12e6.jpg'
  WHERE image_path LIKE '%Turbo-Fan12e6%';

UPDATE product_images SET image_path = 'uploads/products/roofing-accessories-types0572.jpg'
  WHERE image_path LIKE '%roofing-accessories-types0572%';

-- Verify
SELECT id, product_id, image_path, is_primary FROM product_images ORDER BY product_id, is_primary DESC;
