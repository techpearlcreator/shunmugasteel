# SHUNMUGA STEEL — LOCAL DEVELOPMENT SETUP GUIDE

## STEP 1 — WAMP SERVER SETUP

1. Download and install **WAMPServer** from https://www.wampserver.com
2. Start WAMP — tray icon should turn **GREEN**
3. Default ports: Apache on **80**, MySQL on **3306**

### Place backend in WAMP www folder
```
Copy entire backend folder to:
C:\wamp64\www\shunmugasteel\backend\
```
So the API is accessible at: `http://localhost/shunmugasteel/backend`

---

## STEP 2 — DATABASE SETUP

1. Open **phpMyAdmin** → http://localhost/phpmyadmin
   - Username: `root`
   - Password: (blank by default)

2. Click **Import** → Browse → select `C:\shunmugasteel\database\schema.sql`
   → Click **Go**

3. Now import seeders in order:
   - `database/seeders/01_tax_settings.sql`
   - `database/seeders/02_company_settings.sql`
   - `database/seeders/03_categories.sql`
   - `database/seeders/04_products.sql`
   - `database/seeders/05_admin.sql`

**OR** use MySQL command line:
```bash
mysql -u root < C:/shunmugasteel/database/run_all.sql
```

---

## STEP 3 — ENABLE MOD_REWRITE IN WAMP

The PHP API uses `.htaccess` URL rewriting. Enable it:

1. Click WAMP tray icon → **Apache** → **Apache modules** → check `rewrite_module`
2. Restart WAMP

---

## STEP 4 — INSTALL PHP PACKAGES (Composer)

1. Download **Composer** from https://getcomposer.org
2. Open terminal in `C:\wamp64\www\shunmugasteel\backend\`:
```bash
composer install
```
This installs: DOMPDF, PHPMailer, Razorpay SDK

---

## STEP 5 — CONFIGURE PHP ENVIRONMENT

Create `.env` in `C:\wamp64\www\shunmugasteel\backend\` (or edit `config/config.php` directly):

```env
DB_HOST=localhost
DB_NAME=shunmugasteel_db
DB_USER=root
DB_PASS=

JWT_SECRET=your_random_32char_secret_here_change_this

RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
RAZORPAY_MODE=test

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

BASE_URL=http://localhost/shunmugasteel/backend
FRONTEND_URL=http://localhost:5173
```

> **Gmail SMTP**: Enable 2FA on Gmail → Create "App Password" → use that as SMTP_PASS

---

## STEP 6 — START REACT FRONTEND

```bash
cd C:\shunmugasteel\frontend
npm install         # first time only
npm run dev         # starts at http://localhost:5173
```

---

## STEP 7 — START REACT ADMIN PANEL

```bash
cd C:\shunmugasteel\admin
npm install         # first time only
npm run dev         # starts at http://localhost:5174
```

---

## STEP 8 — TEST API

Open browser or Postman:
```
GET  http://localhost/shunmugasteel/backend/categories
GET  http://localhost/shunmugasteel/backend/products
POST http://localhost/shunmugasteel/backend/auth/login
     Body: { "email": "test@test.com", "password": "Password123" }
```

---

## ADMIN LOGIN CREDENTIALS (Default)

| Field    | Value                       |
|----------|-----------------------------|
| URL      | http://localhost:5174        |
| Email    | admin@shunmugasteel.com      |
| Password | Admin@1234                  |

> **IMPORTANT**: Change admin password immediately after first login!

---

## RAZORPAY TEST CARDS

| Type         | Card Number         | CVV | Expiry  |
|--------------|---------------------|-----|---------|
| Visa (test)  | 4111 1111 1111 1111 | Any | Any future date |
| Master       | 5267 3181 8797 5449 | Any | Any |
| UPI (test)   | success@razorpay    | —   | —       |

---

## PROJECT PORTS SUMMARY

| Service         | URL                                           |
|-----------------|-----------------------------------------------|
| Frontend        | http://localhost:5173                         |
| Admin Panel     | http://localhost:5174                         |
| PHP API         | http://localhost/shunmugasteel/backend        |
| phpMyAdmin      | http://localhost/phpmyadmin                   |
| WAMP Dashboard  | http://localhost                              |

---

## FOLDER STRUCTURE RECAP

```
C:\shunmugasteel\
├── frontend\          ← React public website (npm run dev → :5173)
├── admin\             ← React admin panel   (npm run dev → :5174)
├── database\          ← SQL schema + seeders
├── demo1\             ← Approved client demo (reference only)
├── MASTER_PLAN.md     ← Full project plan
└── SETUP_GUIDE.md     ← This file

C:\wamp64\www\shunmugasteel\
└── backend\           ← PHP REST API (accessible via Apache)
```
