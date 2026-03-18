-- ============================================================
-- SHUNMUGA STEEL TRADERS — DATABASE SCHEMA
-- Database: shunmugasteel_db
-- Created: 2026-03-13
-- ============================================================

CREATE DATABASE IF NOT EXISTS shunmugasteel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shunmugasteel_db;

-- ============================================================
-- ADMINS
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','manager') DEFAULT 'super_admin',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- USERS (Customers)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL,
  company_name VARCHAR(150),
  gst_number VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50) DEFAULT 'Tamil Nadu',
  pincode VARCHAR(10),
  password VARCHAR(255) NOT NULL,
  email_verified TINYINT(1) DEFAULT 0,
  email_verify_token VARCHAR(100),
  reset_token VARCHAR(100),
  reset_token_expires TIMESTAMP NULL,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
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

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(400),
  product_type ENUM('standard','custom','both') DEFAULT 'standard',
  brand VARCHAR(50) COMMENT 'SAIL, AMNS, JSW, Evonith, Multiple',
  stock_status ENUM('in_stock','limited','on_order','out_of_stock') DEFAULT 'in_stock',
  is_featured TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCT VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  video_path VARCHAR(500) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCT SPECIFICATIONS (for detail page table)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  spec_name VARCHAR(100) NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- STANDARD PRODUCT VARIANTS (fixed size — price visible)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_name VARCHAR(150) NOT NULL COMMENT 'e.g. 3mm x 1250mm x 2500mm IS2062',
  thickness VARCHAR(20),
  width VARCHAR(20),
  length VARCHAR(20),
  grade VARCHAR(50) COMMENT 'IS 2062 E250, IS 513, etc.',
  price_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit VARCHAR(20) DEFAULT 'ton' COMMENT 'ton, kg, sheet, meter, sqft',
  min_order_qty DECIMAL(10,2) DEFAULT 1,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- CUSTOM PRODUCT PRICING RULES (dimension-based — price hidden)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_pricing_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL UNIQUE,
  price_per_kg DECIMAL(10,2) DEFAULT 0.00,
  price_per_ton DECIMAL(10,2) DEFAULT 0.00,
  price_per_meter DECIMAL(10,2) DEFAULT 0.00,
  price_per_sqft DECIMAL(10,2) DEFAULT 0.00,
  price_per_sheet DECIMAL(10,2) DEFAULT 0.00,
  primary_pricing_unit ENUM('kg','ton','meter','sqft','sheet') DEFAULT 'kg',
  min_order_qty DECIMAL(10,2) DEFAULT 1,
  density DECIMAL(6,3) DEFAULT 7.850 COMMENT 'steel density g/cm3 for weight calc',
  admin_notes VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TAX & GST SETTINGS (admin editable)
-- ============================================================
CREATE TABLE IF NOT EXISTS tax_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value VARCHAR(100) NOT NULL,
  label VARCHAR(100),
  description VARCHAR(200),
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- QUOTES (header)
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'SST-2026-0001',
  user_id INT UNSIGNED NOT NULL,
  status ENUM(
    'submitted',
    'reviewed',
    'confirmed',
    'payment_pending',
    'paid',
    'dispatched',
    'cancelled'
  ) DEFAULT 'submitted',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  gst_percentage DECIMAL(5,2) NOT NULL DEFAULT 18.00,
  gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  other_charges DECIMAL(10,2) DEFAULT 0.00 COMMENT 'freight, loading etc.',
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  delivery_address TEXT,
  delivery_city VARCHAR(50),
  delivery_pincode VARCHAR(10),
  customer_notes TEXT,
  admin_notes TEXT,
  valid_until DATE,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================================
-- QUOTE ITEMS (line items)
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT DEFAULT NULL,
  product_name VARCHAR(150) NOT NULL COMMENT 'snapshot at time of quote',
  brand VARCHAR(50),
  specifications JSON COMMENT '{"thickness":"3mm","width":"1250mm","length":"2500mm","grade":"IS2062","custom":true}',
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  is_custom TINYINT(1) DEFAULT 0,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- ============================================================
-- QUOTE STATUS HISTORY (tracking timeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_status_history (
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

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT NOT NULL,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50) COMMENT 'card, upi, netbanking, wallet',
  status ENUM('created','pending','captured','failed','refunded') DEFAULT 'created',
  failure_reason VARCHAR(255),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
) ENGINE=InnoDB;

-- ============================================================
-- COMPANY SETTINGS (admin editable — contact, SMTP, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS company_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  setting_group VARCHAR(50) DEFAULT 'general' COMMENT 'general, smtp, payment, quote',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
