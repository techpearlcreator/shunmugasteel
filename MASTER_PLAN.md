# SHUNMUGA STEEL TRADERS — MASTER PROJECT PLAN
> Version 1.0 | Created: 2026-03-13 | Status: Active

---

## TABLE OF CONTENTS
1. Project Overview
2. Tech Stack & Architecture
3. Logo Redesign Strategy
4. Menu Bar Improvements (Demo 1 → Production)
5. Request to Quote — Feature Analysis & Design
6. Database Schema
7. Folder Structure
8. Phase-by-Phase Development Plan
9. Admin Panel Feature List
10. Unique Differentiators & Innovation
11. Project Tracker

---

## 1. PROJECT OVERVIEW

| Field | Details |
|---|---|
| **Client** | Shunmuga Steel Traders |
| **Established** | 1976 |
| **Location** | Tamil Nadu, India |
| **Business Type** | B2B Steel Trading — Authorized Dealer |
| **Brands Sold** | SAIL, AMNS India, JSW Steel, Evonith |
| **Products** | HR Coils, CR Coils, GP Sheets, GC Sheets, PPGL Coils, Decking Sheets, PUF Panels, Purlin, UPVC, Polycarbonate, Accessories |
| **Site Type** | B2B Product Catalog + Request to Quote + Online Payment |
| **UI Reference** | Demo 1 — Amerce Construction Template |
| **Language** | English |
| **Dev Environment** | WAMP Server (Local) |

---

## 2. TECH STACK & ARCHITECTURE

### Frontend
| Tool | Purpose |
|---|---|
| **React 18 + Vite** | Fast SPA build tool |
| **Tailwind CSS** | Utility-first styling (replaces template CSS gradually) |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests to PHP API |
| **Zustand** | Lightweight state management (cart/quote basket, auth) |
| **React Hook Form** | Form handling + validation |
| **React PDF / jsPDF** | Client-side PDF preview |
| **Framer Motion** | Animations (matching Amerce template feel) |

### Backend
| Tool | Purpose |
|---|---|
| **PHP 8.2** | REST API (MVC pattern, no heavy framework) |
| **WAMP Server** | Apache + MySQL + PHP local environment |
| **DOMPDF** | Server-side PDF generation with brand logo |
| **PHPMailer + SMTP** | Email notifications (quote sent, status updates) |
| **JWT (Firebase JWT)** | Token-based authentication |
| **Razorpay PHP SDK** | Payment gateway integration |

### Database
| Tool | Purpose |
|---|---|
| **MySQL 8.0** | Relational database |
| **phpMyAdmin** | Local DB management via WAMP |

### Architecture Pattern
```
Browser (React SPA)
       ↕ REST API (JSON)
PHP API Router → Controllers → Models
                                  ↕
                            MySQL Database
                                  ↑
                         DOMPDF (PDF gen)
                         PHPMailer (Email)
                         Razorpay (Payment)
```

---

## 3. LOGO REDESIGN STRATEGY

### Current Logo Assets
- Word: "Shunmuga"
- Symbol: Arrow
- Word: "Steel"

### Proposed Color Palette
| Color | Hex | Usage |
|---|---|---|
| **Steel Gray** | `#2C3E50` | Primary — wordmark, backgrounds |
| **Deep Charcoal** | `#1A252F` | Dark variant |
| **Vibrant Orange** | `#E67E22` | Arrow, accent, highlights |
| **Bright Orange** | `#FF6B00` | Hover states, CTA buttons |
| **White** | `#FFFFFF` | Logo on dark backgrounds |

### Arrow Direction
- **Diagonal Upward-Right (45°)** — communicates both *growth* (upward) and *forward momentum* (right)

### Three Logo Concept Options

**Concept A — "Steel S-Arrow" (RECOMMENDED)**
- Bold "S" letterform where the bottom stroke curves into an upward-right arrow
- "SHUNMUGA" in Barlow Condensed Bold (industrial slab-serif) — Steel Gray
- "STEEL TRADERS" in lighter weight below — smaller, spaced out
- Orange arrow tip on the "S" tail
- Clean, minimal, memorable — works at all sizes

**Concept B — "Industrial Badge"**
- Hexagonal badge outline (reference: steel hex bolt head)
- "SST" monogram with upward arrow inside hexagon
- "SHUNMUGA STEEL TRADERS" around the edge
- Orange hex border on steel-gray fill

**Concept C — "Beam & Arrow"**
- Stylized I-beam / H-beam cross-section as the "S" backbone
- Arrow piercing upward through it
- More technical / engineering feel

### Final Logo Deliverables (to design)
1. Full color (Steel gray + Orange) — for white backgrounds
2. White version — for dark/colored backgrounds
3. Icon-only (S+arrow) — for favicon, app icon, social media avatar
4. Est. 1976 tagline variant

> **Designer Note**: Use Figma or Adobe Illustrator. Export as SVG + PNG (2x, 3x). Font recommendation: Barlow Condensed Bold for "SHUNMUGA", Barlow Regular for "STEEL TRADERS".

---

## 4. MENU BAR IMPROVEMENTS (Demo 1 → Production)

### Current Demo 1 Menu (Template — Remove These)
- Home (multi-template preview dropdown) ❌
- Shop (layout demos) ❌
- Blog, Pages, Elements ❌

### Production Menu Design

#### Desktop Navigation (sticky header)
```
[LOGO]    Home | Products▼ | Brands▼ | About | Contact    [🔍 Search] [👤 Login] [📋 Get Quote]
```

#### Products Mega Menu (3 columns)
```
┌─────────────────────────────────────────────────────────┐
│  FLAT PRODUCTS          ROOFING PRODUCTS    ACCESSORIES  │
│  ─────────────────      ─────────────────   ──────────── │
│  HR Coils               Decking Sheets      Purlin        │
│  CR Coils               PUF Panels          Roofing Screws│
│  GP Sheets              UPVC Sheets         Turbo Fan     │
│  GC Sheets              Polycarbonate       Ridge Cap     │
│  PPGL Colour Coils      Colour Coated       Fasteners     │
│  GP Slitted Coil        Trapezoidal Sheet               │
│  CR Slitted Coil                                        │
│                                                          │
│  [View All Products →]                                   │
└─────────────────────────────────────────────────────────┘
```

#### Brands Mega Menu
```
┌──────────────────────────────────────────────────────┐
│  [SAIL Logo]    [AMNS Logo]    [JSW Logo]    [Evonith]│
│  View Range     View Range     View Range    View Range│
└──────────────────────────────────────────────────────┘
```

#### Header Right Side
- 🔍 **Search bar** — autocomplete product names
- 👤 **Login / My Account** — dropdown: Profile, My Quotes, Order History, Logout
- 📋 **Get Quote** — orange CTA button (always visible, sticky)

#### Top Bar (above header)
```
📞 +91 XXXXX XXXXX  |  ✉ info@shunmugasteel.com  |  📍 Tamil Nadu, India  |  Mon–Sat: 9AM–6PM
```

#### Mobile Navigation
- Hamburger → Slide-in sidebar
- Accordion categories
- Sticky "Get Quote" floating button (bottom-right)

### Why These Improvements?
1. Remove all irrelevant template links (home-mental, home-pet-care, etc.)
2. Mega menu with category images makes product discovery visual and fast
3. Brands section builds trust and authority
4. Persistent "Get Quote" CTA drives conversions
5. Search with autocomplete (B2B buyers search by product code)
6. Mobile-first floating quote button for field sales

---

## 5. REQUEST TO QUOTE — FEATURE ANALYSIS & DESIGN

### Analysis of Steel Industry RFQ Leaders

| Site | Key RFQ Feature |
|---|---|
| **L&T SuFin** | Multi-supplier RFQ, compare quotes, bulk tender creation |
| **AMNS India** | Product spec sheet + inquiry form per product, grade selector |
| **SAIL** | Dealer inquiry with grade/size/quantity form |
| **Evonith Steel** | Technical product PDF + contact for quote |
| **SaroSteel** | Product catalog with "Enquire Now" per item, WhatsApp chat |
| **SriAmman Steels** | Basic contact form per product |
| **Steel Link** | Grade + size selector → quote request |

### Our Unique RFQ System Design

#### A. Standard Product Quote (Ready-made / Fixed Size)
- Customer selects product → sees price (visible for standard items)
- Adds to **Quote Basket** (like a cart but for quotes)
- Enters quantity → price auto-calculated with GST
- Submits quote → gets PDF quote on screen + email

#### B. Custom Product Quote (Dimension-based)
- Customer selects product → enters custom dimensions (length × width × thickness)
- Admin has set **price per unit** (per meter / per kg / per sq.ft) for each product
- System auto-calculates: `Base Unit Price × Quantity × Dimensions = Subtotal`
- GST applied on subtotal (rate set by admin)
- Customer sees live price preview before submitting
- Submits → PDF generated with all breakdown

#### C. Quote PDF Contents
```
┌─────────────────────────────────────────┐
│  [Shunmuga Steel Logo]           [Date] │
│  QUOTATION                   #SST-2026- │
│  Valid Until: [Date + 7 days]           │
│─────────────────────────────────────────│
│  Bill To:                               │
│  Customer Name, Phone, Email            │
│─────────────────────────────────────────│
│  # | Product | Specs | Qty | Unit | Amt │
│  1   HR Coils  3mm×1.2m  10T  ₹XX  ₹XX │
│─────────────────────────────────────────│
│  Subtotal:              ₹XX,XXX         │
│  GST (18%):             ₹X,XXX          │
│  Total:                 ₹XX,XXX         │
│─────────────────────────────────────────│
│  Terms: Valid 7 days. Subject to avail. │
│  Authorized by: Shunmuga Steel Traders  │
└─────────────────────────────────────────┘
```

#### D. Quote Basket (Multi-item RFQ)
- Customer can add multiple products (different specs) to one quote
- Like a shopping cart but labeled "Quote Basket"
- Shows running total with GST
- "Submit All as One Quote" button

#### E. Quote Tracking (Customer Dashboard)
```
My Quotes
─────────────────────────────────────────────
#SST-2026-001  |  HR Coils + GP Sheets  |  ₹1,20,000  |  [PENDING]      [View PDF]
#SST-2026-002  |  Decking Sheets        |  ₹45,000    |  [REVIEWED]     [View PDF]
#SST-2026-003  |  CR Coils Custom       |  ₹2,10,000  |  [CONFIRMED]    [Pay Now]
#SST-2026-004  |  PUF Panels            |  ₹88,000    |  [PAID]         [Receipt]
```

Quote Status Flow:
```
SUBMITTED → REVIEWED → PRICE CONFIRMED → PAYMENT PENDING → PAID → DISPATCHED
```

#### F. Admin Quote Management
- See all incoming quotes
- Filter by status, product, date, customer
- Edit price before confirming (if negotiated)
- One-click confirm → triggers email + enables payment for customer
- Download all quotes as CSV for accounting

---

## 6. DATABASE SCHEMA

### Tables

```sql
-- Users (customers)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(15),
  company_name VARCHAR(150),
  gst_number VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50),
  pincode VARCHAR(10),
  password VARCHAR(255),
  email_verified TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('super_admin', 'manager') DEFAULT 'manager',
  last_login TIMESTAMP
);

-- Product Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  slug VARCHAR(100) UNIQUE,
  image VARCHAR(255),
  description TEXT,
  parent_id INT DEFAULT NULL,  -- for sub-categories
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active'
);

-- Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(150),
  slug VARCHAR(150) UNIQUE,
  description TEXT,
  short_description VARCHAR(300),
  product_type ENUM('standard','custom') DEFAULT 'standard',
  brand VARCHAR(50),  -- SAIL, AMNS, JSW, Evonith
  stock_status ENUM('in_stock','limited','on_order','out_of_stock') DEFAULT 'in_stock',
  is_featured TINYINT DEFAULT 0,
  sort_order INT DEFAULT 0,
  status ENUM('active','inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product Images
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  image_path VARCHAR(255),
  is_primary TINYINT DEFAULT 0,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Standard Product Variants (fixed size/price — visible to public)
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  variant_name VARCHAR(100),   -- e.g. "3mm × 1250mm × 2500mm"
  thickness VARCHAR(20),
  width VARCHAR(20),
  length VARCHAR(20),
  grade VARCHAR(50),           -- IS 2062, IS 513 etc.
  price_per_unit DECIMAL(10,2),
  unit VARCHAR(20),            -- per kg / per ton / per sheet / per meter
  min_order_qty DECIMAL(10,2),
  status ENUM('active','inactive') DEFAULT 'active',
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Custom Product Pricing Rules (dimension-based — price hidden until quote)
CREATE TABLE product_pricing_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  price_per_meter DECIMAL(10,2) DEFAULT 0,
  price_per_kg DECIMAL(10,2) DEFAULT 0,
  price_per_sqft DECIMAL(10,2) DEFAULT 0,
  price_per_ton DECIMAL(10,2) DEFAULT 0,
  pricing_unit ENUM('meter','kg','sqft','ton','sheet') DEFAULT 'kg',
  min_order_qty DECIMAL(10,2) DEFAULT 1,
  notes VARCHAR(200),  -- admin notes like "price includes cutting"
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- GST & Tax Settings (admin editable)
CREATE TABLE tax_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_name VARCHAR(50),    -- e.g. 'default_gst', 'steel_gst', 'roofing_gst'
  tax_percentage DECIMAL(5,2),
  description VARCHAR(100),
  updated_by INT,              -- admin id
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Quotes (header)
CREATE TABLE quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(20) UNIQUE,  -- SST-2026-001
  user_id INT,
  status ENUM('submitted','reviewed','confirmed','payment_pending','paid','dispatched','cancelled') DEFAULT 'submitted',
  subtotal DECIMAL(12,2),
  gst_amount DECIMAL(10,2),
  total_amount DECIMAL(12,2),
  gst_percentage DECIMAL(5,2),
  valid_until DATE,
  admin_notes TEXT,
  customer_notes TEXT,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Quote Items (line items)
CREATE TABLE quote_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT,
  product_id INT,
  variant_id INT DEFAULT NULL,     -- for standard items
  product_name VARCHAR(150),       -- snapshot at time of quote
  specifications TEXT,             -- JSON: {thickness, width, length, grade, custom_dims}
  quantity DECIMAL(10,2),
  unit VARCHAR(20),
  unit_price DECIMAL(10,2),
  total_price DECIMAL(12,2),
  is_custom TINYINT DEFAULT 0,
  FOREIGN KEY (quote_id) REFERENCES quotes(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Quote Status History (tracking log)
CREATE TABLE quote_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT,
  old_status VARCHAR(30),
  new_status VARCHAR(30),
  changed_by_type ENUM('admin','user','system'),
  changed_by_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Payments
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quote_id INT,
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  razorpay_signature VARCHAR(255),
  amount DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50),      -- card, upi, netbanking
  status ENUM('created','pending','captured','failed','refunded') DEFAULT 'created',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Product Specifications (for detail page)
CREATE TABLE product_specs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  spec_name VARCHAR(100),    -- e.g. "Grade", "Thickness Range", "Width Range"
  spec_value TEXT,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 7. FOLDER STRUCTURE

```
c:\shunmugasteel\
├── demo1\                    ← Approved client demo (reference)
├── demo2\                    ← Demo 2 (archived)
│
├── frontend\                 ← React App (Vite)
│   ├── public\
│   │   ├── assets\           ← Static: logo, favicon, brand logos
│   │   └── index.html
│   ├── src\
│   │   ├── components\
│   │   │   ├── layout\
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MegaMenu.jsx
│   │   │   │   └── MobileNav.jsx
│   │   │   ├── home\
│   │   │   │   ├── HeroSlider.jsx
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── BrandStrip.jsx
│   │   │   │   └── StatsCounter.jsx
│   │   │   ├── products\
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── ProductFilter.jsx
│   │   │   │   └── CustomDimensionForm.jsx
│   │   │   ├── quote\
│   │   │   │   ├── QuoteBasket.jsx
│   │   │   │   ├── QuoteCalculator.jsx
│   │   │   │   ├── QuotePDFPreview.jsx
│   │   │   │   └── QuoteTracker.jsx
│   │   │   ├── auth\
│   │   │   │   ├── LoginModal.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   └── ui\
│   │   │       ├── Button.jsx
│   │   │       ├── Badge.jsx
│   │   │       └── Modal.jsx
│   │   ├── pages\
│   │   │   ├── Home.jsx
│   │   │   ├── Category.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Brands.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── dashboard\
│   │   │       ├── MyQuotes.jsx
│   │   │       ├── QuoteDetail.jsx
│   │   │       └── Profile.jsx
│   │   ├── store\            ← Zustand stores
│   │   │   ├── authStore.js
│   │   │   └── quoteStore.js
│   │   ├── hooks\
│   │   ├── services\         ← Axios API calls
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── quoteService.js
│   │   │   └── paymentService.js
│   │   ├── utils\
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend\                  ← PHP API
│   ├── config\
│   │   ├── database.php
│   │   ├── config.php        ← DB creds, JWT secret, Razorpay keys
│   │   └── cors.php
│   ├── controllers\
│   │   ├── AuthController.php
│   │   ├── CategoryController.php
│   │   ├── ProductController.php
│   │   ├── QuoteController.php
│   │   ├── PaymentController.php
│   │   └── AdminController.php
│   ├── models\
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Quote.php
│   │   └── Payment.php
│   ├── middleware\
│   │   ├── AuthMiddleware.php
│   │   └── AdminMiddleware.php
│   ├── services\
│   │   ├── PDFService.php    ← DOMPDF quote generation
│   │   ├── EmailService.php  ← PHPMailer
│   │   └── RazorpayService.php
│   ├── routes\
│   │   └── api.php           ← Route definitions
│   ├── uploads\              ← Product images
│   ├── quotes_pdf\           ← Generated quote PDFs
│   ├── vendor\               ← Composer packages
│   ├── composer.json
│   └── index.php             ← Entry point / router
│
├── admin\                    ← React Admin Panel (separate app)
│   ├── src\
│   │   ├── pages\
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Quotes.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Payments.jsx
│   │   │   └── Settings.jsx   ← GST, Tax, Pricing
│   │   └── App.jsx
│   └── package.json
│
└── database\
    ├── schema.sql
    ├── seeders\
    │   ├── categories.sql
    │   └── products.sql
    └── migrations\
```

---

## 8. PHASE-BY-PHASE DEVELOPMENT PLAN

---

### PHASE 1 — Foundation & Setup
**Goal**: Dev environment ready, project scaffolded, DB created
**Duration**: ~3–4 days

| Task | Tool | Status |
|---|---|---|
| Install WAMP Server | WAMP | ⬜ |
| Create MySQL database `shunmugasteel_db` | phpMyAdmin | ⬜ |
| Run schema.sql — create all tables | MySQL | ⬜ |
| Seed categories (15) and sample products | SQL | ⬜ |
| Init React frontend: `npm create vite@latest frontend` | Node | ⬜ |
| Install: React Router, Axios, Zustand, Tailwind, Framer Motion | npm | ⬜ |
| Init React admin panel: `npm create vite@latest admin` | Node | ⬜ |
| Setup PHP backend folder in `www\shunmugasteel\backend` | PHP | ⬜ |
| Install PHP packages via Composer: DOMPDF, PHPMailer, Firebase JWT, Razorpay | Composer | ⬜ |
| Configure WAMP virtual hosts for frontend, backend, admin | Apache | ⬜ |
| Setup CORS headers in PHP backend | PHP | ⬜ |
| Configure `.env` files for DB creds, JWT secret, Razorpay keys | Config | ⬜ |
| Import product images from SHUNMUGAMSTEEL CDN to uploads folder | Files | ⬜ |

**Deliverable**: All three apps running locally on WAMP

---

### PHASE 2 — Backend API Core
**Goal**: All REST API endpoints working and tested
**Duration**: ~5–6 days

| Endpoint Group | Endpoints | Status |
|---|---|---|
| **Auth** | POST /register, POST /login, POST /logout, GET /me | ⬜ |
| **Categories** | GET /categories, GET /categories/:id, GET /categories/:slug/products | ⬜ |
| **Products** | GET /products, GET /products/:slug, GET /products?category=&brand=&search= | ⬜ |
| **Product Variants** | GET /products/:id/variants | ⬜ |
| **Quote** | POST /quotes (create), GET /quotes (user's quotes), GET /quotes/:id, PATCH /quotes/:id/status | ⬜ |
| **Quote Calculator** | POST /quotes/calculate (returns subtotal + GST) | ⬜ |
| **PDF** | GET /quotes/:id/pdf (generate + download) | ⬜ |
| **Payment** | POST /payment/create-order, POST /payment/verify | ⬜ |
| **Admin - Categories** | GET/POST/PUT/DELETE /admin/categories | ⬜ |
| **Admin - Products** | GET/POST/PUT/DELETE /admin/products | ⬜ |
| **Admin - Quotes** | GET /admin/quotes, PATCH /admin/quotes/:id | ⬜ |
| **Admin - Pricing** | GET/PUT /admin/products/:id/pricing | ⬜ |
| **Admin - Tax** | GET/PUT /admin/settings/tax | ⬜ |
| **Admin - Dashboard** | GET /admin/dashboard (stats: quotes, revenue, products, customers) | ⬜ |

**Deliverable**: API tested in Postman/Thunder Client, all endpoints returning correct data

---

### PHASE 3 — Admin Panel
**Goal**: Complete admin panel for managing all content
**Duration**: ~5–6 days

#### Admin Dashboard
- Total Quotes Today / This Month
- Revenue This Month (paid quotes)
- New Customer Registrations
- Pending Quotes (needs review)
- Recent 5 Quotes table
- Quick stats: Total Products, Total Categories

#### Categories Manager
- List all categories with image, name, product count, status toggle
- Add / Edit category: name, slug (auto), image upload, description, parent category
- Drag-and-drop sort order
- Delete (soft delete if products exist)

#### Products Manager
- List: filter by category, brand, stock status, product type
- Add / Edit product:
  - Basic info: name, category, brand, description, type (standard/custom)
  - Multiple image upload (primary + gallery)
  - Specifications table (grade, thickness range, width range, standard sizes)
  - Stock status badge
- Standard variants: add size/price rows (thickness × width × price per unit)
- Custom pricing: set price per kg / meter / sqft, min order

#### Pricing & Tax Settings
- GST rate per product category (editable)
- Default GST rate
- Other charges: Loading charges, transport base rate
- Quote validity days (default: 7)

#### Quote Logs
- List all quotes: sortable by date, status, amount
- Click to view full quote detail
- Status change dropdown (Submitted → Reviewed → Confirmed → etc.)
- Admin notes field
- Option to edit line item prices before confirming
- Send email notification to customer on status change
- Download quote PDF
- Export all quotes as CSV

#### Customers List
- View all registered customers
- Name, email, phone, company, GST number
- Number of quotes submitted
- Total paid amount

**Deliverable**: Admin can fully manage all content from panel

---

### PHASE 4 — Public Frontend (Based on Demo 1 Amerce Design)
**Goal**: Full public-facing website in React, pixel-close to Demo 1
**Duration**: ~7–8 days

#### Pages to Build

**Homepage**
- Topbar with phone/email/hours
- Sticky header: Logo + Mega Menu + Search + Login + Get Quote CTA
- Hero Slider (3 slides with steel product images + CTAs)
- Category Grid (3 columns — Flat Products, Roofing, Accessories)
- Featured Products (HR Coils, CR Coils, GP Sheets, etc.)
- Why Choose Us strip (BIS Certified, Mill Direct, Est. 1976, Pan-India)
- Brand Partners (SAIL, AMNS, JSW, Evonith logos)
- Stats counter (Products: 50+, Customers: 5000+, Years: 48+, Cities: 100+)
- Testimonials
- Footer: Address, Quick Links, Products, Social, GST/CIN info

**Category Page**
- Breadcrumb
- Left sidebar filter: brand, thickness range, width range, stock status
- Product grid with cards: image, name, brand, price (if standard) / "Get Quote" (if custom)
- Sort: Price, Newest, Featured

**Product Detail Page**
- Image gallery (main + thumbnails)
- Product name, brand badge, stock status
- Specifications table
- Standard variants: size selector + quantity + live price + "Add to Quote Basket"
- Custom dimensions: form with length/width/thickness + live price calculator
- Related products

**Customer Auth**
- Login page / modal
- Register page: Name, Email, Phone, Company, GST, Password
- Email verification

**Customer Dashboard**
- My Quotes: table with status badges, view PDF, Pay Now button
- Profile: edit contact details
- Quote detail: full line items, status history timeline

**Brands Page**
- SAIL, AMNS, JSW, Evonith brand cards with logo, description, products link

**About Page**
- Company history since 1976
- Mission, team, location

**Contact Page**
- Contact form (Name, Phone, Email, Message)
- Google Maps embed
- Address, phone, email, working hours

**Deliverable**: Full responsive public website, connected to PHP API

---

### PHASE 5 — Quote System (Core Feature)
**Goal**: End-to-end quote flow working
**Duration**: ~4–5 days

#### Quote Basket (Zustand store + UI)
- Add standard product variant to basket
- Add custom dimension product to basket
- Edit quantity / dimensions in basket
- Remove items
- Live total + GST calculation (from API)
- Basket count badge on header icon

#### Quote Submission
- Review basket page
- Enter delivery address (or use profile address)
- Add customer notes / special requirements
- Submit button → POST /quotes
- Success page: quote number + PDF download link + "Check Email"

#### Quote PDF Generation (PHP DOMPDF)
- Template: Company logo, address, GST number
- Quote number, date, valid until
- Customer details
- Line items table with specs
- Subtotal, GST breakdown, Total
- Terms & conditions
- Signature/stamp area
- Save PDF to server + attach to email

#### Email Notifications (PHPMailer)
- Customer: "Quote Submitted" — with PDF attachment
- Admin: "New Quote Received" — with summary
- Customer: "Quote Reviewed" — status update email
- Customer: "Quote Confirmed — Payment Link" — with Pay Now button
- Customer: "Payment Received" — receipt + next steps

#### Quote Tracking
- Status timeline component (visual stepper)
- Customer sees: Submitted → Reviewed → Confirmed → Payment Done → Dispatched

**Deliverable**: Complete quote lifecycle from basket to PDF to email

---

### PHASE 6 — Payment Integration (Razorpay)
**Goal**: Customers can pay confirmed quotes online
**Duration**: ~3 days

#### Payment Flow
```
Quote CONFIRMED by admin
→ Customer sees "Pay Now" button in My Quotes
→ Click Pay Now → POST /payment/create-order → Razorpay Order ID
→ Razorpay checkout popup (Card / UPI / Net Banking)
→ Customer pays
→ Razorpay webhook → POST /payment/verify → verify signature
→ Quote status → PAID
→ Email: Receipt with payment reference
→ Admin dashboard: payment logged
```

#### Razorpay Setup
- Create Razorpay account (Test mode first)
- Install Razorpay PHP SDK via Composer
- Install Razorpay JS in React (`@razorpay/razorpay-js`)
- Test with Razorpay test cards/UPI

#### Payment Receipt
- Separate receipt PDF or added section to quote PDF
- Razorpay transaction ID, payment method, date, amount

**Deliverable**: Full payment flow tested in Razorpay test mode

---

### PHASE 7 — Testing & Quality
**Goal**: Bug-free, responsive, fast
**Duration**: ~3–4 days

| Test Area | Checklist |
|---|---|
| **Responsive** | Mobile (375px), Tablet (768px), Desktop (1280px, 1440px) |
| **Cross-browser** | Chrome, Firefox, Edge, Mobile Safari |
| **Auth flows** | Register → verify email → login → logout |
| **Quote flow** | Add to basket → submit → receive email → track status |
| **Payment flow** | Razorpay test mode — card/UPI/netbanking |
| **Admin panel** | Create/edit/delete category, product, manage quotes |
| **PDF generation** | Correct data, proper formatting, logo visible |
| **Email delivery** | All 5 email templates sending correctly |
| **API security** | JWT protected routes, admin routes restricted |
| **Performance** | Image lazy loading, API response < 500ms |
| **Forms** | All validations working, error messages clear |

---

### PHASE 8 — Launch Prep
**Goal**: Ready to present to client or deploy
**Duration**: ~2 days

- Final content: About page, Contact details, real product descriptions
- Upload all product images (from SHUNMUGAMSTEEL CDN)
- Logo finalized (replace CSS text override with real SVG)
- SEO: meta title, description, og:image per page
- Favicon (S+arrow icon)
- 404 page
- Loading states on all async operations
- Error boundary components
- Production build test (`npm run build`)
- Document: setup guide for WAMP, `.env` config instructions

---

## 9. ADMIN PANEL FEATURE LIST (Summary)

| Section | Features |
|---|---|
| **Dashboard** | KPIs, recent quotes, quick stats |
| **Categories** | CRUD + image upload + sort order |
| **Products** | CRUD + gallery upload + variants + specs |
| **Pricing Rules** | Per-product dimension pricing (kg/meter/sqft) |
| **Tax & GST Settings** | Edit GST % per category + default rate |
| **Quote Logs** | View all, filter, change status, edit price, download PDF |
| **Customers** | View all, quote history per customer |
| **Payments** | View all payments, filter by status/date |
| **Settings** | Company info, SMTP config, Razorpay keys, quote validity |

---

## 10. UNIQUE DIFFERENTIATORS & INNOVATION IDEAS

These features will make Shunmuga Steel stand out from every competitor:

### 1. Steel Project Estimator Tool ⭐ (KILLER FEATURE)
> "Planning a warehouse? Roofing a factory? Tell us your project."

Customer fills:
- Project type: Warehouse / Industrial Shed / Commercial Roofing / Residential
- Area: length × width (sq.ft or meters)
- Roof pitch, wall height

System auto-calculates recommended product list + estimated quantities + cost range.
One click → converts to RFQ.

*No competitor in Tamil Nadu has this. It positions SST as a consultant, not just a seller.*

### 2. Quote Validity Countdown Timer
Steel prices change daily. Each quote shows a live countdown:
`⏱ Valid for: 4 days, 22 hrs, 31 min`
Creates urgency, aligns with real business practice.

### 3. Multi-Brand Price Comparison (Same Product)
Customer on a product page can see:
| Brand | Grade | Price/Ton | Lead Time |
|---|---|---|---|
| SAIL | IS 2062 E250 | ₹X | 3–5 days |
| AMNS | IS 2062 E250 | ₹X | 2–3 days |
| JSW | IS 2062 E250 | ₹X | 5–7 days |

*Shows SST is a multi-brand dealer with transparent options.*

### 4. WhatsApp Quote Share (One Click)
Generated quote PDF → "Share on WhatsApp" button → pre-filled message with quote summary link. Works perfectly for Tamil Nadu B2B buyers who are WhatsApp-first.

### 5. Smart Quote Basket (Multi-item Single RFQ)
Customer browsing different categories → adds CR Coils + Decking Sheets + Purlin to one Quote Basket → submits all as single consolidated RFQ → one PDF, one quote number.

*B2B buyers buy full project material in one order. This serves them.*

### 6. Delivery Zone Estimator
Customer enters PIN code → shows:
- "Delivery available to [City]"
- Estimated delivery: 3–5 business days
- Estimated freight charge (admin-configured per region)
Added to quote total automatically.

### 7. Order Repeat (One-Click Requote)
Customer Dashboard → Previous Quotes → "Re-order" button
→ Basket pre-filled with same items/specs → update quantity if needed → submit.

*B2B customers often reorder exact same specs. This saves them time.*

### 8. Inventory Status Badges
Admin sets per product: `In Stock` / `Limited Stock` / `On Order (ETA: X days)` / `Out of Stock`
Visible as badges on product cards and detail pages.
Creates real-time urgency without fake scarcity.

---

## 11. PROJECT TRACKER

### Overall Progress
```
Phase 1 — Foundation & Setup          ⬜ NOT STARTED
Phase 2 — Backend API Core             ⬜ NOT STARTED
Phase 3 — Admin Panel                  ⬜ NOT STARTED
Phase 4 — Public Frontend              ⬜ NOT STARTED
Phase 5 — Quote System                 ⬜ NOT STARTED
Phase 6 — Payment Integration          ⬜ NOT STARTED
Phase 7 — Testing & Quality            ⬜ NOT STARTED
Phase 8 — Launch Prep                  ⬜ NOT STARTED
```

### Legend
| Symbol | Meaning |
|---|---|
| ⬜ | Not Started |
| 🔄 | In Progress |
| ✅ | Completed |
| ❌ | Blocked |

---

*Document maintained by: Claude Code*
*Last updated: 2026-03-13*
*Next review: Start of each new phase*
