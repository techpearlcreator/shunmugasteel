-- Run this file to set up the entire database from scratch
-- Usage: mysql -u root -p < run_all.sql

SOURCE schema.sql;
SOURCE seeders/01_tax_settings.sql;
SOURCE seeders/02_company_settings.sql;
SOURCE seeders/03_categories.sql;
SOURCE seeders/04_products.sql;
SOURCE seeders/05_admin.sql;

SELECT 'Database setup complete!' AS status;
