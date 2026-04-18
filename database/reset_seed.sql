USE shunmugasteel_db;

SET FOREIGN_KEY_CHECKS = 0;

-- Drop all tables to ensure clean schema recreation
DROP TABLE IF EXISTS quote_status_history;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS quote_items;
DROP TABLE IF EXISTS quotes;
DROP TABLE IF EXISTS product_pricing_rules;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_specs;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;

-- Recreate tables with correct schema
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image VARCHAR(255),
  description TEXT,
  parent_id INT DEFAULT NULL,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(400),
  product_type ENUM('standard','custom','both') DEFAULT 'standard',
  brand VARCHAR(50),
  stock_status ENUM('in_stock','limited','on_order','out_of_stock') DEFAULT 'in_stock',
  is_featured TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  spec_name VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_name VARCHAR(150) NOT NULL,
  thickness VARCHAR(20),
  width VARCHAR(20),
  length VARCHAR(20),
  grade VARCHAR(50),
  price_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(20) DEFAULT 'ton',
  min_order_qty DECIMAL(10,2) DEFAULT 1,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE product_pricing_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL UNIQUE,
  price_per_kg DECIMAL(10,2) DEFAULT 0.00,
  price_per_ton DECIMAL(10,2) DEFAULT 0.00,
  price_per_meter DECIMAL(10,2) DEFAULT 0.00,
  price_per_sqft DECIMAL(10,2) DEFAULT 0.00,
  price_per_sheet DECIMAL(10,2) DEFAULT 0.00,
  primary_pricing_unit ENUM('kg','ton','meter','sqft','sheet') DEFAULT 'kg',
  min_order_qty DECIMAL(10,2) DEFAULT 1,
  density DECIMAL(6,3) DEFAULT 7.850,
  admin_notes VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT UNSIGNED NOT NULL,
  status ENUM('submitted','reviewed','confirmed','payment_pending','paid','dispatched','cancelled') DEFAULT 'submitted',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  gst_percentage DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  other_charges DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  delivery_address TEXT,
  delivery_city VARCHAR(50),
  delivery_pincode VARCHAR(10),
  customer_notes TEXT,
  admin_notes TEXT,
  valid_until DATE,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE quote_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  product_name VARCHAR(150) NOT NULL,
  brand VARCHAR(50),
  specifications JSON,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  is_custom TINYINT(1) DEFAULT 0,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

CREATE TABLE quote_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  old_status VARCHAR(30),
  new_status VARCHAR(30) NOT NULL,
  changed_by_type ENUM('admin','user','system') DEFAULT 'system',
  changed_by_id INT DEFAULT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50),
  status ENUM('created','pending','captured','failed','refunded') DEFAULT 'created',
  failure_reason VARCHAR(255),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
) ENGINE=InnoDB;

-- Now re-run seeders in order:
--   03_categories.sql  → then
--   04_products.sql
