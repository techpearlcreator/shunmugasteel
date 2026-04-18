-- ============================================================
-- SHUNMUGA STEEL TRADERS — Database Schema
-- Run this in phpMyAdmin: select shunmugasteel_db → SQL tab → paste → Go
-- ============================================================

CREATE DATABASE IF NOT EXISTS `shunmugasteel_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `shunmugasteel_db`;

-- ─── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`                  VARCHAR(100)  NOT NULL,
  `email`                 VARCHAR(150)  NOT NULL UNIQUE,
  `phone`                 VARCHAR(20)   NOT NULL,
  `company_name`          VARCHAR(150)  DEFAULT NULL,
  `gst_number`            VARCHAR(20)   DEFAULT NULL,
  `address`               TEXT          DEFAULT NULL,
  `city`                  VARCHAR(100)  DEFAULT NULL,
  `state`                 VARCHAR(100)  DEFAULT NULL,
  `pincode`               VARCHAR(10)   DEFAULT NULL,
  `password`              VARCHAR(255)  NOT NULL,
  `email_verified`        TINYINT(1)    NOT NULL DEFAULT 0,
  `email_verify_token`    VARCHAR(100)  DEFAULT NULL,
  `reset_token`           VARCHAR(100)  DEFAULT NULL,
  `reset_token_expires`   DATETIME      DEFAULT NULL,
  `status`                ENUM('active','inactive','banned') NOT NULL DEFAULT 'active',
  `created_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ADMINS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `admins` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(150) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  `last_login` DATETIME     DEFAULT NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CATEGORIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(150) NOT NULL,
  `slug`        VARCHAR(150) NOT NULL UNIQUE,
  `image`       VARCHAR(255) DEFAULT NULL,
  `description` TEXT         DEFAULT NULL,
  `parent_id`   INT UNSIGNED DEFAULT NULL,
  `sort_order`  INT          NOT NULL DEFAULT 0,
  `status`      ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
  `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id`       INT UNSIGNED NOT NULL,
  `name`              VARCHAR(200) NOT NULL,
  `slug`              VARCHAR(200) NOT NULL UNIQUE,
  `description`       TEXT         DEFAULT NULL,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `product_type`      ENUM('standard','custom','both') NOT NULL DEFAULT 'standard',
  `brand`             VARCHAR(100) DEFAULT NULL,
  `stock_status`      ENUM('in_stock','out_of_stock','made_to_order') NOT NULL DEFAULT 'in_stock',
  `is_featured`       TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order`        INT          NOT NULL DEFAULT 0,
  `status`            ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT IMAGES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_images` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `is_primary` TINYINT(1)   NOT NULL DEFAULT 0,
  `sort_order` INT          NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT VARIANTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id`     INT UNSIGNED   NOT NULL,
  `variant_name`   VARCHAR(200)   NOT NULL,
  `thickness`      DECIMAL(8,3)   DEFAULT NULL COMMENT 'mm',
  `width`          DECIMAL(8,2)   DEFAULT NULL COMMENT 'mm',
  `length`         DECIMAL(8,2)   DEFAULT NULL COMMENT 'mm',
  `grade`          VARCHAR(50)    DEFAULT NULL,
  `unit`           VARCHAR(20)    NOT NULL DEFAULT 'kg',
  `price_per_unit` DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  `stock_status`   ENUM('in_stock','out_of_stock') NOT NULL DEFAULT 'in_stock',
  `sort_order`     INT            NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT PRICING RULES (custom dimension pricing) ────────
CREATE TABLE IF NOT EXISTS `product_pricing_rules` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id`           INT UNSIGNED  NOT NULL UNIQUE,
  `primary_pricing_unit` ENUM('kg','ton','meter','sqft','sheet') NOT NULL DEFAULT 'kg',
  `price_per_kg`         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_per_ton`        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_per_meter`      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_per_sqft`       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_per_sheet`      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRODUCT SPECS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `spec_key`   VARCHAR(100) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── QUOTES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `quotes` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_number`     VARCHAR(30)   NOT NULL UNIQUE,
  `user_id`          INT UNSIGNED  NOT NULL,
  `status`           ENUM('submitted','reviewed','confirmed','payment_pending','paid','dispatched','cancelled')
                     NOT NULL DEFAULT 'submitted',
  `subtotal`         DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `gst_percentage`   DECIMAL(5,2)  NOT NULL DEFAULT 18.00,
  `gst_amount`       DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `total_amount`     DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `delivery_address` JSON          DEFAULT NULL,
  `customer_notes`   TEXT          DEFAULT NULL,
  `admin_notes`      TEXT          DEFAULT NULL,
  `valid_until`      DATE          DEFAULT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── QUOTE ITEMS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `quote_items` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_id`       INT UNSIGNED  NOT NULL,
  `product_id`     INT UNSIGNED  DEFAULT NULL,
  `variant_id`     INT UNSIGNED  DEFAULT NULL,
  `product_name`   VARCHAR(200)  NOT NULL,
  `brand`          VARCHAR(100)  DEFAULT NULL,
  `specifications` JSON          DEFAULT NULL,
  `quantity`       DECIMAL(10,3) NOT NULL,
  `unit`           VARCHAR(20)   NOT NULL DEFAULT 'kg',
  `unit_price`     DECIMAL(12,2) NOT NULL,
  `total_price`    DECIMAL(14,2) NOT NULL,
  `is_custom`      TINYINT(1)    NOT NULL DEFAULT 0,
  FOREIGN KEY (`quote_id`)   REFERENCES `quotes`(`id`)           ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)         ON DELETE SET NULL,
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── QUOTE STATUS HISTORY ────────────────────────────────────
CREATE TABLE IF NOT EXISTS `quote_status_history` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_id`         INT UNSIGNED NOT NULL,
  `old_status`       VARCHAR(30)  DEFAULT NULL,
  `new_status`       VARCHAR(30)  NOT NULL,
  `changed_by_type`  ENUM('user','admin','system') NOT NULL DEFAULT 'system',
  `changed_by_id`    INT UNSIGNED DEFAULT NULL,
  `notes`            TEXT         DEFAULT NULL,
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PAYMENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `payments` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `quote_id`             INT UNSIGNED  NOT NULL,
  `razorpay_order_id`    VARCHAR(100)  DEFAULT NULL,
  `razorpay_payment_id`  VARCHAR(100)  DEFAULT NULL,
  `razorpay_signature`   VARCHAR(255)  DEFAULT NULL,
  `amount`               DECIMAL(14,2) NOT NULL,
  `currency`             VARCHAR(5)    NOT NULL DEFAULT 'INR',
  `payment_method`       VARCHAR(50)   DEFAULT NULL,
  `status`               ENUM('created','captured','failed','refunded') NOT NULL DEFAULT 'created',
  `paid_at`              DATETIME      DEFAULT NULL,
  `created_at`           DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── COMPANY SETTINGS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `company_settings` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key`   VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT         DEFAULT NULL,
  `setting_group` VARCHAR(50)  NOT NULL DEFAULT 'general',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── TAX SETTINGS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `tax_settings` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key`   VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` VARCHAR(50)  NOT NULL,
  `label`         VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default tax settings
INSERT IGNORE INTO `tax_settings` (`setting_key`, `setting_value`, `label`) VALUES
  ('default_gst',          '18',  'Default GST Rate (%)'),
  ('quote_validity_days',  '7',   'Quote Validity (days)'),
  ('cgst_rate',            '9',   'CGST Rate (%)'),
  ('sgst_rate',            '9',   'SGST Rate (%)'),
  ('igst_rate',            '18',  'IGST Rate (%)');

-- Default company settings
INSERT IGNORE INTO `company_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
  ('company_name',      'Shunmuga Steel Traders',           'general'),
  ('company_email',     'info@shunmugasteel.com',           'general'),
  ('company_phone',     '+91 98765 43210',                  'general'),
  ('company_address',   'Tamil Nadu, India',                'general'),
  ('company_gstin',     '',                                 'general'),
  ('hurry_deal_enabled','0',                                'hurry_deal'),
  ('hurry_deal_title',  'Limited Time Offer!',              'hurry_deal'),
  ('hurry_deal_subtitle','Grab the best steel deals now',   'hurry_deal'),
  ('hurry_deal_slug',   '',                                 'hurry_deal'),
  ('hurry_deal_end',    '',                                 'hurry_deal');

-- Admin user: created separately via setup endpoint.
-- After importing this schema, open:
--   http://localhost/shunmugasteel/backend/setup?key=sst_setup_2024
-- Then login with: admin@shunmugasteel.com / Admin@2024
