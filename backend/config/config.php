<?php
// ============================================================
// SHUNMUGA STEEL — Application Config
// ============================================================

define('DB_HOST',     getenv('DB_HOST')     ?: 'localhost');
define('DB_NAME',     getenv('DB_NAME')     ?: 'shunmugasteel_db');
define('DB_USER',     getenv('DB_USER')     ?: 'root');
define('DB_PASS',     getenv('DB_PASS')     ?: '');

define('JWT_SECRET',  getenv('JWT_SECRET')  ?: 'CHANGE_THIS_SECRET_IN_PRODUCTION_MIN_32_CHARS');
define('JWT_EXPIRY',  60 * 60 * 24 * 7);   // 7 days in seconds

define('RAZORPAY_KEY_ID',     getenv('RAZORPAY_KEY_ID')     ?: '');
define('RAZORPAY_KEY_SECRET', getenv('RAZORPAY_KEY_SECRET') ?: '');
define('RAZORPAY_MODE',       getenv('RAZORPAY_MODE')       ?: 'test');

define('SMTP_HOST',     getenv('SMTP_HOST')     ?: 'smtp.gmail.com');
define('SMTP_PORT',     getenv('SMTP_PORT')     ?: 587);
define('SMTP_USER',     getenv('SMTP_USER')     ?: '');
define('SMTP_PASS',     getenv('SMTP_PASS')     ?: '');
define('SMTP_FROM',     getenv('SMTP_FROM')     ?: '');
define('SMTP_FROM_NAME', 'Shunmuga Steel Traders');

define('BASE_URL',    getenv('BASE_URL')    ?: 'http://localhost/shunmugasteel/backend');
define('UPLOAD_DIR',  __DIR__ . '/../uploads/');
define('PDF_DIR',     __DIR__ . '/../quotes_pdf/');
define('FRONTEND_URL', getenv('FRONTEND_URL') ?: 'http://localhost:5173');

// MinIO (S3-compatible object storage)
define('MINIO_ENDPOINT', getenv('MINIO_ENDPOINT') ?: 'http://localhost:9000');
define('MINIO_KEY',      getenv('MINIO_KEY')      ?: 'minioadmin');
define('MINIO_SECRET',   getenv('MINIO_SECRET')   ?: 'minioadmin');
define('MINIO_BUCKET',   getenv('MINIO_BUCKET')   ?: 'shunmugasteel');
define('MINIO_REGION',   getenv('MINIO_REGION')   ?: 'us-east-1');
