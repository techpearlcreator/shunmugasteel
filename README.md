# Shunmuga Steel Traders — Full Stack Web Application

B2B steel trading platform for Shunmuga Steel Traders, Chennai. Customers can browse products, build quote baskets, and request quotes. Admins manage products, quotes, customers, and site settings through a dedicated panel.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Frontend Routes](#frontend-routes)
- [Admin Panel Routes](#admin-panel-routes)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [NPM Scripts](#npm-scripts)
- [Default Credentials](#default-credentials)
- [Key Features](#key-features)

---

## Tech Stack

### Frontend — Public Site (`/frontend`)
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.13.1 | Client-side routing |
| Vite | 8.0.0 | Build tool / dev server |
| Axios | 1.13.6 | HTTP client |
| Zustand | 5.0.11 | State management |
| React Hook Form | 7.71.2 | Form handling |
| Framer Motion | 12.36.0 | Animations |
| Swiper | 12.1.2 | Hero / product sliders |
| Tailwind CSS | 4.2.1 | Utility CSS |

### Admin Panel — (`/admin`)
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.13.1 | Routing |
| Vite | 8.0.0 | Build tool |
| Axios | 1.13.6 | HTTP client |
| Zustand | 5.0.11 | Auth state |
| React Query | 5.90.21 | Data fetching / cache |
| React Hook Form | 7.71.2 | Form handling |
| Recharts | 3.8.0 | Dashboard charts |
| Tailwind CSS | 4.2.1 | Utility CSS |

### Backend — PHP REST API (`/backend`)
| Package | Version | Purpose |
|---------|---------|---------|
| PHP | ≥ 8.2 | Server language |
| MySQL | 8.0 | Database |
| DOMPDF | 3.0 | Quote PDF generation |
| PHPMailer | 6.9 | SMTP email |
| Razorpay SDK | 2.9 | Payment gateway |
| AWS SDK for PHP | 3.0 | MinIO / S3 image storage |

### Infrastructure
| Tool | Purpose |
|------|---------|
| WAMP Server | Local Apache + MySQL + PHP |
| MinIO | S3-compatible object storage for product images |
| phpMyAdmin | Database management UI |
| Composer | PHP dependency manager |
| Git | Version control |

---

## Project Structure

```
shunmugasteel/
│
├── frontend/                        # React public website (port 5173)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # ProtectedRoute
│   │   │   ├── home/                # HeroSlider, CategoryGrid, FeaturedProducts, BrandStrip
│   │   │   ├── layout/              # Header, Footer, Layout
│   │   │   ├── products/            # ProductCard, ProductGrid, ProductFilter
│   │   │   ├── quote/               # QuoteBasket, QuoteCalculator, QuotePDFPreview
│   │   │   └── ui/                  # Shared UI components
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── BrandsPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── VerifyEmailPage.jsx
│   │   │   ├── QuoteBasketPage.jsx
│   │   │   ├── PaymentSuccessPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── dashboard/
│   │   │       ├── MyQuotes.jsx
│   │   │       ├── QuoteDetail.jsx
│   │   │       └── ProfilePage.jsx
│   │   ├── services/                # API service functions
│   │   │   ├── api.js               # Axios base instance
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── quoteService.js
│   │   │   └── paymentService.js
│   │   ├── store/                   # Zustand state
│   │   │   ├── authStore.js
│   │   │   └── quoteStore.js
│   │   └── utils/
│   │       └── cdn.js               # Image URL helpers
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── admin/                           # React admin panel (port 5174)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # ProtectedAdmin
│   │   │   ├── layout/              # AdminLayout, Sidebar
│   │   │   └── ui/                  # Badge, Button, ConfirmDialog, FormInput, Modal, Spinner, StatCard
│   │   ├── pages/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx        # KPI cards + revenue chart
│   │   │   ├── Categories.jsx       # Category CRUD
│   │   │   ├── Products.jsx         # Product CRUD + images/variants/pricing tabs
│   │   │   ├── QuoteLogs.jsx        # All quotes with status filter
│   │   │   ├── quotes/
│   │   │   │   └── QuoteDetail.jsx  # Quote review + status update
│   │   │   ├── Customers.jsx        # Customer list + quote history
│   │   │   ├── Payments.jsx         # Payment records
│   │   │   └── Settings.jsx         # Company, SMTP, Payment, Deal Banner, GST tabs
│   │   ├── services/
│   │   │   ├── api.js               # Axios base instance
│   │   │   └── adminApi.js          # All admin API calls
│   │   └── store/
│   │       └── adminAuthStore.js    # Admin auth (Zustand)
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── backend/                         # PHP REST API (Apache/WAMP)
│   ├── config/
│   │   ├── config.php               # All constants: DB, JWT, Razorpay, SMTP, MinIO
│   │   ├── database.php             # PDO singleton
│   │   └── cors.php                 # CORS headers
│   ├── controllers/
│   │   ├── AuthController.php       # Auth: register, login, verify email, reset password
│   │   ├── CategoryController.php   # Public category listing
│   │   ├── ProductController.php    # Public product listing + detail
│   │   ├── QuoteController.php      # Customer quotes + PDF download
│   │   ├── PaymentController.php    # Razorpay order, verify, webhook
│   │   └── AdminController.php      # All admin CRUD operations
│   ├── middleware/
│   │   ├── AuthMiddleware.php        # JWT validation
│   │   └── AdminMiddleware.php       # Admin role check
│   ├── services/
│   │   ├── EmailService.php          # PHPMailer: quote emails
│   │   ├── PDFService.php            # DOMPDF: quote PDF
│   │   └── MinioService.php          # AWS SDK: image upload/delete
│   ├── routes/
│   │   └── api.php                   # All route definitions
│   ├── uploads/
│   │   ├── categories/               # Category images (local fallback)
│   │   └── products/                 # Product images (local fallback)
│   ├── quotes_pdf/                   # Generated quote PDFs
│   ├── index.php                     # Entry point
│   ├── setup-admin.php               # One-time admin seed script
│   └── composer.json
│
├── database/                         # SQL files
│   ├── schema.sql                    # Full database schema
│   ├── reset_seed.sql                # Drop + recreate tables + reset for seeding
│   ├── run_all.sql                   # Run all seeders in order
│   └── seeders/
│       ├── 01_tax_settings.sql       # GST default (18%)
│       ├── 02_company_settings.sql   # Company info, SMTP, Razorpay placeholders
│       ├── 03_categories.sql         # 18 categories (3 parent + 15 sub)
│       ├── 04_products.sql           # 15 products with variants, specs, pricing
│       └── 05_admin.sql              # Default admin user
│
├── .gitignore
├── MASTER_PLAN.md                    # Full project specification
├── SETUP_GUIDE.md                    # Detailed local setup guide
└── README.md
```

---

## Database Schema

### 14 Tables

| Table | Purpose |
|-------|---------|
| `admins` | Admin user accounts for panel login |
| `users` | Customer accounts (email + phone verified) |
| `categories` | Two-level category hierarchy (parent → sub) |
| `products` | Product catalog with type: `standard`, `custom`, `both` |
| `product_images` | Multiple images per product; one marked `is_primary` |
| `product_specs` | Technical spec rows shown in product detail table |
| `product_variants` | Fixed-size variants with visible prices (standard products) |
| `product_pricing_rules` | Dimension-based pricing for custom products (hidden prices) |
| `tax_settings` | GST percentage config (editable by admin) |
| `quotes` | Quote header: totals, status, delivery address, PDF path |
| `quote_items` | Line items per quote with spec snapshot (JSON) |
| `quote_status_history` | Full audit trail of every status change |
| `payments` | Razorpay payment records linked to quotes |
| `company_settings` | Key-value store for all admin-editable settings |

### Quote Status Flow

```
submitted → reviewed → confirmed → payment_pending → paid → dispatched
                                                          ↘ cancelled
```

### Product Type Logic

| Type | Pricing | Variants |
|------|---------|----------|
| `standard` | Prices visible — fixed variants | Size/grade dropdown |
| `custom` | Prices hidden — "Request Quote" | User enters dimensions |
| `both` | Has both fixed variants AND custom dimensions | Combined UI |

---

## API Routes

**Base URL:** `http://localhost/shunmugasteel/backend`

### Public Routes — No Auth Required

```
POST   /auth/register                    Register new customer
POST   /auth/login                       Customer login → JWT
POST   /auth/logout                      Logout
GET    /auth/me                          Current user info (token required)
GET    /auth/verify-email?token=xxx      Email verification
POST   /auth/forgot-password             Send reset email
POST   /auth/reset-password              Reset with token

GET    /categories                       All categories (with sub-categories)
GET    /categories/:slug                 Category + its products

GET    /products                         All active products (filters: category, brand, search, featured)
GET    /products/:slug                   Product detail + images + specs + variants + pricing

GET    /hurry-deal                       Deal banner config (enabled, title, end date, product slug)

GET    /setup?key=sst_setup_2024         One-time admin account creation (DELETE after use)
```

### Customer Routes — JWT Required

```
GET    /quotes                           List user's quotes
POST   /quotes                           Create new quote
GET    /quotes/:id                       Single quote detail
POST   /quotes/calculate                 Calculate totals with GST
GET    /quotes/:id/pdf                   Download quote as PDF

POST   /payment/create-order             Create Razorpay order
POST   /payment/verify                   Verify payment signature
GET    /payment/quote/:id                Payment info for a quote
POST   /payment/webhook                  Razorpay webhook (no auth, raw body)
```

### Admin Routes — Admin JWT Required

```
POST   /admin/auth                       Admin login → JWT

GET    /admin/dashboard                  KPIs: quotes, revenue, customers, monthly chart

GET    /admin/categories                 All categories
POST   /admin/categories                 Create category
PUT    /admin/categories/:id             Update category
DELETE /admin/categories/:id             Deactivate category

GET    /admin/products                   All products (with primary image)
POST   /admin/products                   Create product
GET    /admin/products/:id               Product detail (images, variants, pricing, specs)
PUT    /admin/products/:id               Update product
DELETE /admin/products/:id               Deactivate product

GET    /admin/products/:id/variants      List variants
POST   /admin/products/:id/variants      Add variant
PUT    /admin/products/:id/variants/:vid Update variant
DELETE /admin/products/:id/variants/:vid Delete variant

GET    /admin/products/:id/pricing       Get pricing rule
POST   /admin/products/:id/pricing       Create / upsert pricing rule
PUT    /admin/products/:id/pricing       Update pricing rule

GET    /admin/products/:id/images        List product images
POST   /admin/products/:id/images        Upload image → MinIO (multipart/form-data)
PUT    /admin/products/:id/images/:imgId Set as primary image
DELETE /admin/products/:id/images/:imgId Delete image from MinIO + DB

GET    /admin/quotes                     All quotes (filter by status)
GET    /admin/quotes/:id                 Quote detail + items + status history
PATCH  /admin/quotes/:id                 Update status + trigger email

GET    /admin/customers                  All customers
GET    /admin/customers/:id              Customer + quote stats

GET    /admin/payments                   All payment records

GET    /admin/settings                   All settings (company + tax)
PUT    /admin/settings                   Save settings
```

---

## Frontend Routes

**Dev URL:** `http://localhost:5173`

| Path | Component | Auth |
|------|-----------|------|
| `/` | `Home.jsx` | Public |
| `/products/:categorySlug` | `CategoryPage.jsx` | Public |
| `/product/:productSlug` | `ProductDetail.jsx` | Public |
| `/brands` | `BrandsPage.jsx` | Public |
| `/about` | `AboutPage.jsx` | Public |
| `/contact` | `ContactPage.jsx` | Public |
| `/login` | `LoginPage.jsx` | Guest only |
| `/register` | `RegisterPage.jsx` | Guest only |
| `/forgot-password` | `ForgotPasswordPage.jsx` | Guest only |
| `/reset-password` | `ResetPasswordPage.jsx` | Guest only |
| `/verify-email` | `VerifyEmailPage.jsx` | Public |
| `/quote-basket` | `QuoteBasketPage.jsx` | Public (login to submit) |
| `/payment/success` | `PaymentSuccessPage.jsx` | Protected |
| `/my-quotes` | `dashboard/MyQuotes.jsx` | Protected |
| `/my-quotes/:id` | `dashboard/QuoteDetail.jsx` | Protected |
| `/profile` | `dashboard/ProfilePage.jsx` | Protected |
| `*` | `NotFoundPage.jsx` | Public |

---

## Admin Panel Routes

**Dev URL:** `http://localhost:5174`

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `AdminLogin.jsx` | Admin authentication |
| `/dashboard` | `Dashboard.jsx` | KPIs, revenue chart, recent quotes |
| `/categories` | `Categories.jsx` | Add / edit / deactivate categories |
| `/products` | `Products.jsx` | Products with Info / Variants / Pricing / Images tabs |
| `/quotes` | `QuoteLogs.jsx` | All customer quotes with status filter |
| `/quotes/:id` | `QuoteDetail.jsx` | Review quote, update status, add notes |
| `/customers` | `Customers.jsx` | Customer list + quote history |
| `/payments` | `Payments.jsx` | Razorpay payment records |
| `/settings` | `Settings.jsx` | Company / Email / Payment / Quotes / Deal Banner / GST tabs |

---

## Environment Variables

### `frontend/.env`
```env
VITE_API_URL=http://localhost/shunmugasteel/backend
VITE_APP_NAME=Shunmuga Steel Traders
VITE_RAZORPAY_KEY_ID=rzp_test_REPLACE_WITH_YOUR_KEY
```

### `admin/.env`
```env
VITE_API_URL=http://localhost/shunmugasteel/backend
VITE_APP_NAME=Shunmuga Steel — Admin
```

### `backend/config/config.php` (set as env vars or edit directly)
```env
# Database
DB_HOST=localhost
DB_NAME=shunmugasteel_db
DB_USER=root
DB_PASS=

# Auth
JWT_SECRET=minimum_32_character_random_secret_here

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_MODE=test

# SMTP (Gmail App Password — not login password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your@gmail.com

# URLs
BASE_URL=http://localhost/shunmugasteel/backend
FRONTEND_URL=http://localhost:5173

# MinIO (optional — for product image uploads)
MINIO_ENDPOINT=http://localhost:9000
MINIO_KEY=minioadmin
MINIO_SECRET=minioadmin
MINIO_BUCKET=shunmugasteel
MINIO_REGION=us-east-1
```

---

## Local Setup

### Prerequisites
- [WAMP Server](https://www.wampserver.com/) (Apache + MySQL 8 + PHP 8.2)
- [Node.js](https://nodejs.org/) 18+
- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)
- [MinIO](https://min.io/download) *(optional — only for image uploads)*

### 1. Clone the repository

```bash
git clone https://github.com/techpearlcreator/shunmugasteel.git
cd shunmugasteel
```

### 2. Place backend under WAMP

Copy or symlink the project so Apache can serve it:
```
C:\wamp64\www\shunmugasteel\backend\
```
The API will be accessible at `http://localhost/shunmugasteel/backend`

### 3. Enable mod_rewrite in Apache

In WAMP tray → Apache → Apache Modules → enable `rewrite_module`

### 4. Set up the database

Open phpMyAdmin (`http://localhost/phpmyadmin`) and run in this order:

```sql
-- Step 1: Schema + tables
SOURCE database/schema.sql;

-- Step 2: Seed data
SOURCE database/reset_seed.sql;
SOURCE database/seeders/01_tax_settings.sql;
SOURCE database/seeders/02_company_settings.sql;
SOURCE database/seeders/03_categories.sql;
SOURCE database/seeders/04_products.sql;
SOURCE database/seeders/05_admin.sql;
```

Or use the master runner:
```sql
SOURCE database/run_all.sql;
```

### 5. Install PHP dependencies

```bash
cd backend
composer install
```

### 6. Install frontend dependencies

```bash
# Public website
cd frontend
npm install

# Admin panel
cd ../admin
npm install
```

### 7. Start MinIO (optional — for image uploads)

```bash
minio server C:\minio-data --console-address :9001
```
- API: `http://localhost:9000`
- Console: `http://localhost:9001` (login: `minioadmin` / `minioadmin`)

### 8. Start dev servers

```bash
# Terminal 1 — Public website
cd frontend
npm run dev          # → http://localhost:5173

# Terminal 2 — Admin panel
cd admin
npm run dev          # → http://localhost:5174
```

### 9. Create admin account (first time only)

Visit in browser:
```
http://localhost/shunmugasteel/backend/setup?key=sst_setup_2024
```
This creates the default admin. **Delete or disable this route after use.**

---

## NPM Scripts

### Frontend & Admin (both apps)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimised production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on source files |

### Backend

| Command | Description |
|---------|-------------|
| `composer install` | Install all PHP dependencies |
| `composer require <pkg>` | Add a new PHP package |
| `composer dump-autoload` | Rebuild class autoloader |

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shunmugasteel.com` | `Admin@2024` |

> Change these immediately in production.

### Razorpay Test Cards

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| `4111 1111 1111 1111` | Any future | Any | Success |
| `5267 3181 8797 5449` | Any future | Any | Success |

Test UPI: `success@razorpay`

---

## Key Features

### Public Website
- Product catalog with category and brand filtering
- Two pricing models: fixed variant prices + custom dimension quote requests
- Quote basket — add multiple products before submitting
- GST-inclusive quote calculation with PDF download
- Razorpay payment gateway integration
- User auth: register, email verification, login, password reset
- Deal banner on home page with countdown timer (admin-controlled)

### Admin Panel
- Dashboard: KPI cards (revenue, quotes, customers, products) + monthly revenue chart
- Product management: create/edit products with Info, Variants, Pricing, and Images tabs
- Image upload: upload/delete/set-primary product images via MinIO
- Quote management: review quotes, update status (7 stages), trigger automated emails
- Customer management: full quote history and spend per customer
- Settings: Company info, SMTP, Razorpay keys, Deal Banner config, GST rates
- Deal Banner: enable/disable, set product (dropdown), title, subtitle, end date

### Backend
- JWT authentication (7-day tokens) for customers and admins separately
- Quote PDF generation with DOMPDF (logo, line items, GST, bank details)
- Email notifications via PHPMailer at key quote stages (reviewed, confirmed)
- Razorpay webhook verification with signature check
- MinIO S3-compatible image storage with auto bucket creation

---

## Ports Summary

| Service | URL |
|---------|-----|
| Public website (dev) | http://localhost:5173 |
| Admin panel (dev) | http://localhost:5174 |
| PHP API | http://localhost/shunmugasteel/backend |
| phpMyAdmin | http://localhost/phpmyadmin |
| MinIO API | http://localhost:9000 |
| MinIO Console | http://localhost:9001 |
