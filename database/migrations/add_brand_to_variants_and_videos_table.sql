-- Migration: add brand column to product_variants + create product_videos table
-- Run once against shunmugasteel_db

USE shunmugasteel_db;

-- Add brand field to variants (if not already present)
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS brand VARCHAR(100) DEFAULT NULL
    COMMENT 'e.g. SAIL, JSW, AMNS India'
    AFTER grade;

-- Create product_videos table (if not already present)
CREATE TABLE IF NOT EXISTS product_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  video_path VARCHAR(500) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;
