// PDF content generator — run with: node generate-pdf.js
const fs = require('fs')
const path = require('path')

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Shunmuga Steel Traders — Full Website Content</title>
<style>
  /* ── Print Setup ── */
  @page { size: A4; margin: 18mm 15mm; }
  @media print {
    .no-print { display: none !important; }
    .page-break { page-break-before: always; }
    body { font-size: 11pt; }
  }

  /* ── Base ── */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; line-height: 1.6; }
  a { color: #E67E22; text-decoration: none; }

  /* ── Utility ── */
  .orange   { color: #E67E22; }
  .dark-bg  { background: #1A252F; }
  .gray-bg  { background: #F8F9FA; }
  .tag      { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
  .tag-orange { background: #fff3e0; color: #E67E22; border: 1px solid #f0c080; }
  .tag-green  { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
  .tag-blue   { background: #e3f2fd; color: #1565c0; border: 1px solid #90caf9; }
  .tag-gray   { background: #f5f5f5;  color: #555;    border: 1px solid #ddd; }
  .badge-cert { display: inline-block; font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; margin: 2px; }

  /* ── Cover Page ── */
  .cover {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #1A252F 0%, #2C3E50 60%, #E67E22 100%);
    color: #fff; text-align: center; padding: 40px;
  }
  .cover h1 { font-size: 36px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
  .cover .sub { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.75; margin-bottom: 30px; }
  .cover .divider { width: 60px; height: 4px; background: #E67E22; border-radius: 2px; margin: 0 auto 30px; }
  .cover p { font-size: 14px; opacity: 0.85; max-width: 500px; line-height: 1.8; }
  .cover .meta { margin-top: 40px; font-size: 11px; opacity: 0.55; }

  /* ── TOC ── */
  .toc { padding: 40px; }
  .toc h2 { font-size: 22px; font-weight: 700; color: #1A252F; border-bottom: 3px solid #E67E22; padding-bottom: 10px; margin-bottom: 24px; }
  .toc-item { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px dotted #ddd; font-size: 13px; }
  .toc-item .num { color: #E67E22; font-weight: 700; min-width: 32px; }
  .toc-item .title { flex: 1; font-weight: 500; }
  .toc-item .page { font-size: 11px; color: #999; }

  /* ── Section Header ── */
  .section-header {
    background: linear-gradient(135deg, #1A252F, #2C3E50);
    color: #fff; padding: 30px 40px;
    display: flex; align-items: center; gap: 16px;
  }
  .section-header .num-badge {
    width: 44px; height: 44px; background: #E67E22; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 800; flex-shrink: 0;
  }
  .section-header h2 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
  .section-header p  { font-size: 12px; opacity: 0.7; }

  /* ── Content Sections ── */
  .content-section { padding: 32px 40px; }
  h3 { font-size: 16px; font-weight: 700; color: #1A252F; margin-bottom: 12px; }
  h4 { font-size: 14px; font-weight: 600; color: #2C3E50; margin-bottom: 8px; }
  p  { font-size: 13px; color: #444; line-height: 1.7; margin-bottom: 10px; }

  /* ── Info Cards (offices, values) ── */
  .card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
  .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
  .card h4 { font-size: 14px; font-weight: 700; color: #1A252F; margin-bottom: 10px; }
  .card-row { display: flex; gap: 10px; align-items: flex-start; font-size: 12px; color: #555; margin-bottom: 6px; }
  .card-row .icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }

  /* ── Stat Boxes ── */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
  .stat-box { text-align: center; background: #fff3e0; border: 1px solid #f0c080; border-radius: 10px; padding: 18px 12px; }
  .stat-box .val { font-size: 28px; font-weight: 800; color: #E67E22; line-height: 1; }
  .stat-box .lbl { font-size: 10px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

  /* ── Product Table ── */
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
  th { background: #1A252F; color: #fff; padding: 10px 12px; text-align: left; font-weight: 600; font-size: 11px; letter-spacing: 0.3px; }
  td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #333; vertical-align: top; }
  tr:nth-child(even) td { background: #FAFAFA; }
  tr:hover td { background: #fff8f0; }

  /* ── Product Detail Card ── */
  .product-detail-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
  .product-detail-card .pdc-header { background: #1A252F; color: #fff; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
  .product-detail-card .pdc-header h4 { font-size: 15px; font-weight: 700; margin: 0; }
  .product-detail-card .pdc-body { padding: 16px 20px; }
  .spec-table { width: 100%; font-size: 12px; }
  .spec-table td { padding: 6px 10px; border-bottom: 1px solid #f0f0f0; }
  .spec-table td:first-child { font-weight: 600; color: #555; width: 38%; background: #fafafa; }
  .variants-table th { background: #2C3E50; }

  /* ── Brand Card ── */
  .brand-card { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
  .brand-card-header { padding: 16px 20px; color: #fff; display: flex; justify-content: space-between; align-items: center; }
  .brand-card-header h4 { font-size: 16px; font-weight: 700; margin: 0; }
  .brand-card-body { padding: 16px 20px; }
  .brand-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
  .brand-meta-item { font-size: 11px; color: #666; }
  .brand-meta-item strong { display: block; font-size: 12px; color: #1A252F; }
  .products-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .product-chip { font-size: 11px; background: #f5f5f5; color: #444; padding: 3px 10px; border-radius: 6px; border: 1px solid #e0e0e0; }

  /* ── Timeline ── */
  .timeline { position: relative; padding-left: 32px; }
  .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: #e5e7eb; }
  .timeline-item { position: relative; margin-bottom: 20px; }
  .timeline-item::before { content: ''; position: absolute; left: -28px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #E67E22; border: 2px solid #fff; box-shadow: 0 0 0 2px #E67E22; }
  .timeline-item .year { font-size: 11px; font-weight: 800; color: #E67E22; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
  .timeline-item .title { font-size: 13px; font-weight: 700; color: #1A252F; margin-bottom: 2px; }
  .timeline-item .desc { font-size: 12px; color: #666; }

  /* ── Values Grid ── */
  .values-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .value-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; }
  .value-card .icon { font-size: 24px; margin-bottom: 8px; }
  .value-card h4 { font-size: 13px; font-weight: 700; margin-bottom: 4px; color: #1A252F; }
  .value-card p { font-size: 12px; color: #666; margin: 0; }

  /* ── How It Works ── */
  .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .step { text-align: center; padding: 16px 10px; background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; }
  .step .num { width: 32px; height: 32px; background: #E67E22; color: #fff; border-radius: 50%; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }
  .step h4 { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
  .step p { font-size: 11px; color: #666; margin: 0; }

  /* ── Testimonials ── */
  .testimonial-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .testimonial { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
  .testimonial .stars { color: #E67E22; font-size: 14px; margin-bottom: 8px; }
  .testimonial .text { font-size: 12px; color: #444; font-style: italic; margin-bottom: 10px; }
  .testimonial .author { font-size: 12px; font-weight: 700; color: #1A252F; }
  .testimonial .company { font-size: 11px; color: #888; }

  /* ── Footer ── */
  .doc-footer { background: #1A252F; color: rgba(255,255,255,0.6); text-align: center; padding: 20px; font-size: 11px; margin-top: 40px; }

  /* ── Highlight Box ── */
  .highlight { background: #fff8f0; border-left: 4px solid #E67E22; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 16px; }
  .highlight p { margin: 0; font-size: 13px; color: #444; }

  /* ── Two Col ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  hr.section-divider { border: none; border-top: 2px solid #f0f0f0; margin: 24px 0; }
</style>
</head>
<body>

<!-- ═══════════════════════════ COVER PAGE ═══════════════════════════ -->
<div class="cover">
  <div class="sub">Official Website Content Document</div>
  <h1>Shunmuga Steel Traders</h1>
  <div class="divider"></div>
  <p>India's trusted steel supplier since 1976. Authorized dealer for SAIL, AMNS India, JSW Steel &amp; Evonith. Serving construction, manufacturing &amp; infrastructure industries across Tamil Nadu.</p>
  <div style="margin-top:28px;display:flex;gap:20px;justify-content:center;flex-wrap:wrap;">
    <span style="background:rgba(230,126,34,0.3);border:1px solid rgba(230,126,34,0.6);padding:6px 16px;border-radius:20px;font-size:12px;">Est. 1976</span>
    <span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:6px 16px;border-radius:20px;font-size:12px;">Chennai &amp; Erode</span>
    <span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:6px 16px;border-radius:20px;font-size:12px;">48+ Years Experience</span>
    <span style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.25);padding:6px 16px;border-radius:20px;font-size:12px;">BIS Certified Products</span>
  </div>
  <div class="meta">Generated on ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })} &nbsp;·&nbsp; shunmugasteel.com &nbsp;·&nbsp; Confidential</div>
</div>

<!-- ═══════════════════════════ TABLE OF CONTENTS ═══════════════════════════ -->
<div class="page-break"></div>
<div class="toc">
  <h2>Table of Contents</h2>
  <div class="toc-item"><span class="num">01</span><span class="title">Company Overview &amp; Stats</span></div>
  <div class="toc-item"><span class="num">02</span><span class="title">About Us — Story, Values &amp; Milestones</span></div>
  <div class="toc-item"><span class="num">03</span><span class="title">Product Catalogue — All Categories</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">3.1 Flat Products (7 products)</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">3.2 Roofing Solutions (5 products)</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">3.3 Accessories (3 products)</span></div>
  <div class="toc-item"><span class="num">04</span><span class="title">Detailed Product Specifications</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">HR Coils &amp; Sheets — with variants &amp; pricing</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">CR Coils &amp; Sheets — with variants &amp; pricing</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">GP Sheets &amp; Coils</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">GC / Corrugated Sheets</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">PPGL Colour Coils</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">GP &amp; CR Slitted Coils</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">Decking Sheets, PUF Panels, UPVC, Polycarbonate, Purlin</span></div>
  <div class="toc-item"><span class="num">  </span><span class="title" style="padding-left:20px;color:#888;">Roofing Screws, Turbo Ventilator, Accessories</span></div>
  <div class="toc-item"><span class="num">05</span><span class="title">Brand Partners — SAIL, AMNS India, JSW Steel, Evonith</span></div>
  <div class="toc-item"><span class="num">06</span><span class="title">How to Order / Quote Process</span></div>
  <div class="toc-item"><span class="num">07</span><span class="title">Customer Testimonials</span></div>
  <div class="toc-item"><span class="num">08</span><span class="title">Contact Information</span></div>
</div>

<!-- ═══════════════════════════ 01 — COMPANY OVERVIEW ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">01</div>
  <div>
    <h2>Company Overview</h2>
    <p>Key facts, statistics and service highlights</p>
  </div>
</div>
<div class="content-section">
  <div class="stats">
    <div class="stat-box"><div class="val">48+</div><div class="lbl">Years in Business</div></div>
    <div class="stat-box"><div class="val">1000+</div><div class="lbl">Active Customers</div></div>
    <div class="stat-box"><div class="val">4</div><div class="lbl">Brand Authorizations</div></div>
    <div class="stat-box"><div class="val">2</div><div class="lbl">Office Locations</div></div>
  </div>

  <div class="highlight">
    <p><strong>Most Trusted Steel Supplier Since 1976</strong> — Shunmuga Steel Traders has been serving Tamil Nadu's construction, manufacturing and infrastructure industries with genuine, BIS-certified steel products at competitive bulk prices.</p>
  </div>

  <div class="two-col">
    <div>
      <h3>Who We Are</h3>
      <p>Shunmuga Steel Traders is an authorized dealer for India's top steel manufacturers — SAIL, AMNS India, JSW Steel and Evonith. Every product we supply is genuine, BIS certified and backed by manufacturer support.</p>
      <p>We serve customers ranging from individual builders and contractors to large industrial manufacturers across Tamil Nadu.</p>
    </div>
    <div>
      <h3>Why Choose Us</h3>
      <table>
        <tr><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">✅ Authorized Dealer</td><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;">SAIL, AMNS, JSW, Evonith</td></tr>
        <tr><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">✅ BIS Certified</td><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;">All products IS standard</td></tr>
        <tr><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">✅ Bulk Pricing</td><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;">Competitive factory-direct rates</td></tr>
        <tr><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;">✅ Fast Delivery</td><td style="padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:12px;color:#555;">3–7 days Tamil Nadu-wide</td></tr>
        <tr><td style="padding:7px 10px;font-size:12px;">✅ Quote in 2 hrs</td><td style="padding:7px 10px;font-size:12px;color:#555;">Mon–Sat 9AM–6PM</td></tr>
      </table>
    </div>
  </div>

  <hr class="section-divider" />
  <h3>Service Highlights</h3>
  <div class="card-grid">
    <div class="card"><h4>🏆 48+ Years Experience</h4><p style="font-size:12px;color:#555;margin:0;">Serving industries across Tamil Nadu since 1976. Deep knowledge of local market requirements and steel grades.</p></div>
    <div class="card"><h4>📦 Pan-India Supply</h4><p style="font-size:12px;color:#555;margin:0;">Bulk steel delivery across all major cities. Special focus on Tamil Nadu with warehouses in Chennai and Erode.</p></div>
    <div class="card"><h4>🎧 24/7 Support</h4><p style="font-size:12px;color:#555;margin:0;">Dedicated support team for all your steel needs. Quick response on quotes, orders and technical enquiries.</p></div>
    <div class="card"><h4>💰 Best Pricing</h4><p style="font-size:12px;color:#555;margin:0;">Competitive bulk rates for all steel products. Direct from manufacturer — no middlemen, no hidden charges.</p></div>
  </div>
</div>

<!-- ═══════════════════════════ 02 — ABOUT US ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">02</div>
  <div>
    <h2>About Us</h2>
    <p>Our story, core values and company milestones</p>
  </div>
</div>
<div class="content-section">
  <h3>Our Story</h3>
  <p>Shunmuga Steel Traders was founded in 1976 with a simple mission: to provide Tamil Nadu's construction and manufacturing industries with reliable, quality-assured steel products at fair prices.</p>
  <p>Starting as a small steel trading firm, we grew steadily by focusing on customer relationships and product quality. Our authorized dealerships with India's leading steel manufacturers — SAIL, AMNS India, JSW Steel and Evonith — ensure that every product we supply is genuine, certified and backed by manufacturer support.</p>
  <p>Today, we serve over 1000 customers across Tamil Nadu, from individual builders and contractors to large industrial manufacturers. Our product range covers flat products, roofing solutions and construction accessories — everything you need to build with confidence.</p>

  <hr class="section-divider" />
  <h3>What We Stand For</h3>
  <div class="values-grid">
    <div class="value-card"><div class="icon">🏆</div><h4>Quality First</h4><p>We stock only BIS certified products from manufacturer authorized sources. No seconds, no substitutes.</p></div>
    <div class="value-card"><div class="icon">🤝</div><h4>Customer Trust</h4><p>1000+ customers rely on us for critical steel requirements. We treat every order with the same care.</p></div>
    <div class="value-card"><div class="icon">💡</div><h4>Expert Guidance</h4><p>Our team of steel experts helps you select the right grade, thickness and coating for your application.</p></div>
    <div class="value-card"><div class="icon">⚡</div><h4>Fast Response</h4><p>Quote within 2 hours. Delivery within 3–7 business days anywhere in Tamil Nadu.</p></div>
  </div>

  <hr class="section-divider" />
  <h3>Our Journey — Key Milestones</h3>
  <div class="timeline">
    <div class="timeline-item"><div class="year">1976</div><div class="title">Founded</div><div class="desc">Shunmuga Steel Traders established in Tamil Nadu as a small steel trading firm.</div></div>
    <div class="timeline-item"><div class="year">1985</div><div class="title">SAIL Partnership</div><div class="desc">Became an authorized dealer for SAIL, giving access to premium government steel products.</div></div>
    <div class="timeline-item"><div class="year">1998</div><div class="title">Expanded to Roofing</div><div class="desc">Expanded product portfolio to include roofing and building material solutions.</div></div>
    <div class="timeline-item"><div class="year">2005</div><div class="title">Multi-Brand Dealership</div><div class="desc">Added JSW Steel and Evonith to our brand portfolio, offering wider choice to customers.</div></div>
    <div class="timeline-item"><div class="year">2015</div><div class="title">AMNS India Partnership</div><div class="desc">Became authorized dealer for ArcelorMittal Nippon Steel India (then Essar Steel).</div></div>
    <div class="timeline-item"><div class="year">2024</div><div class="title">Digital Transformation</div><div class="desc">Launched online ordering portal with real-time pricing and quote management system.</div></div>
  </div>
</div>

<!-- ═══════════════════════════ 03 — PRODUCT CATALOGUE ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">03</div>
  <div>
    <h2>Product Catalogue</h2>
    <p>All 15 products across 3 categories — flat, roofing &amp; accessories</p>
  </div>
</div>
<div class="content-section">

  <h3>3.1 — Flat Products <span style="font-size:12px;color:#888;font-weight:400;">(B2B — Industrial &amp; Construction)</span></h3>
  <table>
    <thead>
      <tr><th>#</th><th>Product Name</th><th>Brand</th><th>IS Standard</th><th>Type</th><th>Base Price</th><th>Stock</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td><strong>HR Coils &amp; Sheets</strong></td><td>SAIL</td><td>IS:2062 / IS:10748</td><td><span class="tag tag-blue">Standard</span></td><td>₹58,500/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>2</td><td><strong>CR Coils &amp; Sheets</strong></td><td>AMNS India</td><td>IS:513 / IS:1079</td><td><span class="tag tag-blue">Standard</span></td><td>₹72,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>3</td><td><strong>GP Sheets &amp; Coils</strong></td><td>JSW Steel</td><td>IS:277</td><td><span class="tag tag-blue">Standard</span></td><td>₹85,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>4</td><td><strong>GC Sheets (Corrugated)</strong></td><td>SAIL</td><td>IS:277</td><td><span class="tag tag-blue">Standard</span></td><td>₹80,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>5</td><td><strong>PPGL Colour Coils</strong></td><td>AMNS India</td><td>IS:14246</td><td><span class="tag tag-blue">Standard</span></td><td>₹95,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>6</td><td><strong>GP Slitted Coil</strong></td><td>JSW Steel</td><td>IS:277</td><td><span class="tag tag-blue">Standard</span></td><td>₹87,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>7</td><td><strong>CR Slitted Coil</strong></td><td>Evonith</td><td>IS:513</td><td><span class="tag tag-blue">Standard</span></td><td>₹74,000/MT</td><td><span class="tag tag-green">In Stock</span></td></tr>
    </tbody>
  </table>

  <h3 style="margin-top:24px;">3.2 — Roofing Solutions <span style="font-size:12px;color:#888;font-weight:400;">(B2C + B2B)</span></h3>
  <table>
    <thead>
      <tr><th>#</th><th>Product Name</th><th>Brand</th><th>Sub-Category</th><th>Type</th><th>Price</th><th>Stock</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td><strong>Decking Sheets</strong></td><td>Evonith</td><td>Decking</td><td><span class="tag tag-orange">Custom</span></td><td>Price on Request</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>2</td><td><strong>PUF Panels</strong></td><td>JSW Steel</td><td>Insulated Panels</td><td><span class="tag tag-orange">Custom</span></td><td>Price on Request</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>3</td><td><strong>UPVC Sheets</strong></td><td>JSW Steel</td><td>Transparent Sheets</td><td><span class="tag tag-orange">Custom</span></td><td>Price on Request</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>4</td><td><strong>Polycarbonate Sheets</strong></td><td>SAIL</td><td>Transparent Sheets</td><td><span class="tag tag-orange">Custom</span></td><td>Price on Request</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>5</td><td><strong>Purlin (Z &amp; C)</strong></td><td>AMNS India</td><td>Structural</td><td><span class="tag tag-orange">Custom</span></td><td>Price on Request</td><td><span class="tag tag-green">In Stock</span></td></tr>
    </tbody>
  </table>

  <h3 style="margin-top:24px;">3.3 — Accessories</h3>
  <table>
    <thead>
      <tr><th>#</th><th>Product Name</th><th>Brand</th><th>Sub-Category</th><th>Type</th><th>Base Price</th><th>Stock</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td><strong>Roofing Screws</strong></td><td>SAIL</td><td>Fasteners</td><td><span class="tag tag-blue">Standard</span></td><td>₹3,200/box</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>2</td><td><strong>Turbo Ventilator</strong></td><td>JSW Steel</td><td>Ventilation</td><td><span class="tag tag-blue">Standard</span></td><td>₹3,200/unit</td><td><span class="tag tag-green">In Stock</span></td></tr>
      <tr><td>3</td><td><strong>Roofing Accessories</strong></td><td>AMNS India</td><td>Fittings</td><td><span class="tag tag-blue">Standard</span></td><td>₹1,500/set</td><td><span class="tag tag-green">In Stock</span></td></tr>
    </tbody>
  </table>
</div>

<!-- ═══════════════════════════ 04 — DETAILED PRODUCT SPECS ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">04</div>
  <div>
    <h2>Detailed Product Specifications</h2>
    <p>Full specs, variants, pricing and applications for each product</p>
  </div>
</div>
<div class="content-section">

  <!-- HR COILS -->
  <div class="product-detail-card">
    <div class="pdc-header">
      <div>
        <h4>HR Coils &amp; Sheets — Hot Rolled Steel</h4>
        <div style="margin-top:4px;display:flex;gap:8px;">
          <span class="tag tag-blue" style="font-size:9px;">Standard Product</span>
          <span class="tag tag-green" style="font-size:9px;">In Stock</span>
          <span style="font-size:11px;opacity:0.75;">Brand: SAIL &nbsp;|&nbsp; Category: Flat Products</span>
        </div>
      </div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#E67E22;">₹58,500</div><div style="font-size:10px;opacity:0.7;">per MT + GST 18%</div></div>
    </div>
    <div class="pdc-body">
      <p style="margin-bottom:14px;">Hot Rolled Coils and Sheets are primary steel products manufactured by hot rolling process. Ideal for structural applications, fabrication, automotive and general engineering.</p>
      <div class="two-col">
        <div>
          <h4>Specifications</h4>
          <table class="spec-table">
            <tr><td>Material Standard</td><td>IS:2062 / IS:10748</td></tr>
            <tr><td>Thickness Range</td><td>1.6mm – 25mm</td></tr>
            <tr><td>Width Range</td><td>900mm – 2000mm</td></tr>
            <tr><td>Grade</td><td>E250, E350, E410</td></tr>
            <tr><td>Surface Finish</td><td>Hot Rolled, Mill Scale</td></tr>
            <tr><td>Application</td><td>Structural, Fabrication, Automotive</td></tr>
            <tr><td>GST Rate</td><td>18%</td></tr>
          </table>
        </div>
        <div>
          <h4>Available Variants &amp; Pricing</h4>
          <table class="variants-table" style="font-size:11px;width:100%;border-collapse:collapse;">
            <thead><tr><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Size</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Thickness</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Width</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:right;">Price/MT</th></tr></thead>
            <tbody>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">2mm × 1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">2mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:right;">₹55,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">3mm × 1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">3mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;text-align:right;">₹57,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">5mm × 1500mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">5mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1500mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:right;">₹59,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">6mm × 1500mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">6mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1500mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;text-align:right;">₹60,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">8mm × 2000mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">8mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">2000mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:right;">₹62,000</td></tr>
              <tr><td style="padding:6px 10px;background:#fafafa;">10mm × 2000mm</td><td style="padding:6px 10px;background:#fafafa;">10mm</td><td style="padding:6px 10px;background:#fafafa;">2000mm</td><td style="padding:6px 10px;background:#fafafa;text-align:right;">₹64,000</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- CR COILS -->
  <div class="product-detail-card">
    <div class="pdc-header">
      <div>
        <h4>CR Coils &amp; Sheets — Cold Rolled Steel</h4>
        <div style="margin-top:4px;display:flex;gap:8px;">
          <span class="tag tag-blue" style="font-size:9px;">Standard Product</span>
          <span class="tag tag-green" style="font-size:9px;">In Stock</span>
          <span style="font-size:11px;opacity:0.75;">Brand: AMNS India &nbsp;|&nbsp; Category: Flat Products</span>
        </div>
      </div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#E67E22;">₹72,000</div><div style="font-size:10px;opacity:0.7;">per MT + GST 18%</div></div>
    </div>
    <div class="pdc-body">
      <p style="margin-bottom:14px;">Cold Rolled Coils and Sheets offer superior surface finish and tighter tolerances, ideal for automotive panels, appliances, furniture and precision fabrication.</p>
      <div class="two-col">
        <div>
          <h4>Specifications</h4>
          <table class="spec-table">
            <tr><td>Material Standard</td><td>IS:513 / IS:1079</td></tr>
            <tr><td>Thickness Range</td><td>0.3mm – 3.2mm</td></tr>
            <tr><td>Width Range</td><td>650mm – 1600mm</td></tr>
            <tr><td>Grade</td><td>D, DD, EDD, IF</td></tr>
            <tr><td>Surface Finish</td><td>Bright Annealed, Matte</td></tr>
            <tr><td>Application</td><td>Automotive, Appliances, Furniture</td></tr>
            <tr><td>GST Rate</td><td>18%</td></tr>
          </table>
        </div>
        <div>
          <h4>Available Variants &amp; Pricing</h4>
          <table class="variants-table" style="font-size:11px;width:100%;border-collapse:collapse;">
            <thead><tr><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Size</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Thickness</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:left;">Width</th><th style="background:#2C3E50;color:#fff;padding:7px 10px;text-align:right;">Price/MT</th></tr></thead>
            <tbody>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">0.5mm × 1000mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">0.5mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1000mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:right;">₹70,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">0.8mm × 1200mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">0.8mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1200mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;text-align:right;">₹71,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1.0mm × 1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1.0mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;">1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;text-align:right;">₹72,000</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1.2mm × 1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1.2mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;">1250mm</td><td style="padding:6px 10px;border-bottom:1px solid #f0f0f0;background:#fafafa;text-align:right;">₹73,000</td></tr>
              <tr><td style="padding:6px 10px;">1.5mm × 1500mm</td><td style="padding:6px 10px;">1.5mm</td><td style="padding:6px 10px;">1500mm</td><td style="padding:6px 10px;text-align:right;">₹74,000</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- GP SHEETS -->
  <div class="product-detail-card">
    <div class="pdc-header">
      <div><h4>GP Sheets &amp; Coils — Galvanized Plain</h4><div style="margin-top:4px;display:flex;gap:8px;"><span class="tag tag-blue" style="font-size:9px;">Standard</span><span class="tag tag-green" style="font-size:9px;">In Stock</span><span style="font-size:11px;opacity:0.75;">Brand: JSW Steel &nbsp;|&nbsp; Flat Products</span></div></div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#E67E22;">₹85,000</div><div style="font-size:10px;opacity:0.7;">per MT + GST 18%</div></div>
    </div>
    <div class="pdc-body">
      <p>Galvanized Plain sheets with zinc coating for superior corrosion resistance. Widely used in roofing, wall cladding, HVAC ducts and agricultural applications.</p>
      <h4 style="margin-top:12px;">Specifications</h4>
      <table class="spec-table">
        <tr><td>Standard</td><td>IS:277</td></tr>
        <tr><td>Zinc Coating</td><td>60–275 g/m² (Z60 to Z275)</td></tr>
        <tr><td>Thickness</td><td>0.15mm – 3.0mm</td></tr>
        <tr><td>Width</td><td>600mm – 1500mm</td></tr>
        <tr><td>Surface</td><td>Regular spangle, zero spangle, skin passed</td></tr>
        <tr><td>Application</td><td>Roofing, cladding, HVAC, agriculture</td></tr>
      </table>
    </div>
  </div>

  <!-- GC SHEETS -->
  <div class="product-detail-card">
    <div class="pdc-header">
      <div><h4>GC Sheets — Galvanized Corrugated</h4><div style="margin-top:4px;display:flex;gap:8px;"><span class="tag tag-blue" style="font-size:9px;">Standard</span><span class="tag tag-green" style="font-size:9px;">In Stock</span><span style="font-size:11px;opacity:0.75;">Brand: SAIL &nbsp;|&nbsp; Roofing Products</span></div></div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#E67E22;">₹80,000</div><div style="font-size:10px;opacity:0.7;">per MT + GST 18%</div></div>
    </div>
    <div class="pdc-body">
      <p>Galvanized Corrugated Sheets are the most widely used roofing material in India. Corrugated profile provides enhanced strength and effective water drainage.</p>
      <h4 style="margin-top:12px;">Specifications</h4>
      <table class="spec-table">
        <tr><td>Standard</td><td>IS:277 / IS:2629</td></tr>
        <tr><td>Thickness</td><td>0.25mm – 0.80mm</td></tr>
        <tr><td>Zinc Coating</td><td>120 – 275 g/m²</td></tr>
        <tr><td>Profile</td><td>10.5 corrugation standard</td></tr>
        <tr><td>Sheet Length</td><td>1.8m, 2.4m, 3.0m, custom</td></tr>
        <tr><td>Application</td><td>Industrial roofing, agricultural sheds, temporary structures</td></tr>
      </table>
    </div>
  </div>

  <!-- PPGL COLOUR COILS -->
  <div class="product-detail-card">
    <div class="pdc-header">
      <div><h4>PPGL Colour Coils — Pre-Painted Galvalume</h4><div style="margin-top:4px;display:flex;gap:8px;"><span class="tag tag-blue" style="font-size:9px;">Standard</span><span class="tag tag-green" style="font-size:9px;">In Stock</span><span style="font-size:11px;opacity:0.75;">Brand: AMNS India &nbsp;|&nbsp; Flat Products</span></div></div>
      <div style="text-align:right;"><div style="font-size:20px;font-weight:800;color:#E67E22;">₹95,000</div><div style="font-size:10px;opacity:0.7;">per MT + GST 18%</div></div>
    </div>
    <div class="pdc-body">
      <p>Pre-Painted Galvalume colour coated coils with polyester / PVDF paint coating. Excellent corrosion resistance, UV stability and aesthetic finish.</p>
      <h4 style="margin-top:12px;">Specifications</h4>
      <table class="spec-table">
        <tr><td>Standard</td><td>IS:14246 / ASTM A755</td></tr>
        <tr><td>Substrate</td><td>Galvalume (55% Al–Zn alloy)</td></tr>
        <tr><td>Thickness</td><td>0.30mm – 1.20mm</td></tr>
        <tr><td>Width</td><td>600mm – 1250mm</td></tr>
        <tr><td>Paint Type</td><td>Polyester, Silicon Polyester, PVDF</td></tr>
        <tr><td>Application</td><td>Colour roofing sheets, architectural cladding</td></tr>
      </table>
    </div>
  </div>

  <!-- SLITTED COILS -->
  <div class="two-col">
    <div class="product-detail-card">
      <div class="pdc-header"><div><h4>GP Slitted Coil</h4><div style="margin-top:4px;"><span class="tag tag-blue" style="font-size:9px;">Standard</span> <span style="font-size:10px;opacity:0.75;">JSW Steel — ₹87,000/MT</span></div></div></div>
      <div class="pdc-body">
        <p style="font-size:12px;">Galvanized Plain slit coils cut to specified widths for tube mills, roll forming and precision fabrication.</p>
        <table class="spec-table">
          <tr><td>Standard</td><td>IS:277</td></tr>
          <tr><td>Slit Width</td><td>20mm – 1250mm</td></tr>
          <tr><td>Thickness</td><td>0.20mm – 3.0mm</td></tr>
          <tr><td>Coating</td><td>Z60 – Z275</td></tr>
          <tr><td>Application</td><td>Tube mills, roll forming</td></tr>
        </table>
      </div>
    </div>
    <div class="product-detail-card">
      <div class="pdc-header"><div><h4>CR Slitted Coil</h4><div style="margin-top:4px;"><span class="tag tag-blue" style="font-size:9px;">Standard</span> <span style="font-size:10px;opacity:0.75;">Evonith — ₹74,000/MT</span></div></div></div>
      <div class="pdc-body">
        <p style="font-size:12px;">Cold Rolled slit coils for precision applications requiring tight tolerance and excellent surface quality.</p>
        <table class="spec-table">
          <tr><td>Standard</td><td>IS:513</td></tr>
          <tr><td>Slit Width</td><td>15mm – 1500mm</td></tr>
          <tr><td>Thickness</td><td>0.25mm – 3.0mm</td></tr>
          <tr><td>Grade</td><td>D, DD, EDD</td></tr>
          <tr><td>Application</td><td>Precision fabrication</td></tr>
        </table>
      </div>
    </div>
  </div>

  <!-- ROOFING CUSTOM PRODUCTS -->
  <hr class="section-divider" />
  <h3>Roofing Solutions — Custom / Made-to-Order Products</h3>

  <div class="product-detail-card">
    <div class="pdc-header">
      <div><h4>Decking Sheets — Steel Floor Deck</h4><div style="margin-top:4px;display:flex;gap:8px;"><span class="tag tag-orange" style="font-size:9px;">Custom / Made to Order</span><span class="tag tag-green" style="font-size:9px;">In Stock</span><span style="font-size:11px;opacity:0.75;">Brand: Evonith &nbsp;|&nbsp; Roofing</span></div></div>
      <div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#E67E22;">Price on Request</div><div style="font-size:10px;opacity:0.7;">Custom dimensions</div></div>
    </div>
    <div class="pdc-body">
      <p>Steel Deck Sheets for composite flooring in commercial and multi-storey buildings. Custom lengths and profiles available. Price calculated based on dimensions and quantity.</p>
      <table class="spec-table">
        <tr><td>Material</td><td>Galvanized Steel</td></tr>
        <tr><td>Profile</td><td>0.75mm standard deck</td></tr>
        <tr><td>Zinc Coating</td><td>120–275 g/m²</td></tr>
        <tr><td>Standard Width</td><td>600mm, 750mm, 900mm</td></tr>
        <tr><td>Length</td><td>Custom cut to size</td></tr>
        <tr><td>Application</td><td>Composite Slabs, Mezzanines</td></tr>
      </table>
    </div>
  </div>

  <div class="product-detail-card">
    <div class="pdc-header">
      <div><h4>PUF Panels — Polyurethane Foam Sandwich</h4><div style="margin-top:4px;display:flex;gap:8px;"><span class="tag tag-orange" style="font-size:9px;">Custom</span><span class="tag tag-green" style="font-size:9px;">In Stock</span><span style="font-size:11px;opacity:0.75;">Brand: JSW Steel &nbsp;|&nbsp; Roofing</span></div></div>
      <div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#E67E22;">Price on Request</div></div>
    </div>
    <div class="pdc-body">
      <p>Polyurethane Foam sandwich panels with steel facings for insulated roofing, cold storage, industrial sheds and clean rooms.</p>
      <table class="spec-table">
        <tr><td>Core Material</td><td>Rigid PU Foam</td></tr>
        <tr><td>Core Density</td><td>40–45 kg/m³</td></tr>
        <tr><td>Facing Thickness</td><td>0.5mm PPGI both sides</td></tr>
        <tr><td>Panel Thickness</td><td>40mm, 50mm, 75mm, 100mm</td></tr>
        <tr><td>Width</td><td>1000mm nominal</td></tr>
        <tr><td>Application</td><td>Cold Storage, Warehouses, Cleanrooms</td></tr>
      </table>
    </div>
  </div>

  <div class="two-col">
    <div class="product-detail-card">
      <div class="pdc-header"><div><h4>UPVC Sheets</h4><div style="margin-top:4px;"><span class="tag tag-orange" style="font-size:9px;">Custom</span> <span style="font-size:10px;opacity:0.75;">JSW Steel</span></div></div></div>
      <div class="pdc-body">
        <p style="font-size:12px;">Unplasticised PVC sheets for roofing and skylights. UV stabilized, lightweight and easy to install.</p>
        <table class="spec-table">
          <tr><td>Material</td><td>UPVC</td></tr>
          <tr><td>Thickness</td><td>1.0mm – 3.0mm</td></tr>
          <tr><td>Color</td><td>Clear, Smoke, Green</td></tr>
          <tr><td>Application</td><td>Skylights, patio roofing</td></tr>
        </table>
      </div>
    </div>
    <div class="product-detail-card">
      <div class="pdc-header"><div><h4>Polycarbonate Sheets</h4><div style="margin-top:4px;"><span class="tag tag-orange" style="font-size:9px;">Custom</span> <span style="font-size:10px;opacity:0.75;">SAIL</span></div></div></div>
      <div class="pdc-body">
        <p style="font-size:12px;">High-impact polycarbonate sheets for skylights and transparent roofing applications. 250× stronger than glass.</p>
        <table class="spec-table">
          <tr><td>Material</td><td>Polycarbonate</td></tr>
          <tr><td>Thickness</td><td>2mm – 16mm</td></tr>
          <tr><td>Type</td><td>Solid, Twin-wall, Triple-wall</td></tr>
          <tr><td>Application</td><td>Skylights, greenhouse</td></tr>
        </table>
      </div>
    </div>
  </div>

  <div class="product-detail-card">
    <div class="pdc-header"><div><h4>Purlin — Z &amp; C Purlins</h4><div style="margin-top:4px;"><span class="tag tag-orange" style="font-size:9px;">Custom</span> <span style="font-size:10px;opacity:0.75;">AMNS India &nbsp;|&nbsp; Structural</span></div></div><div style="text-align:right;"><div style="font-size:14px;font-weight:700;color:#E67E22;">Price on Request</div></div></div>
    <div class="pdc-body">
      <p>Z and C Purlins for roof and wall cladding systems. Cold-formed from high-tensile galvanized steel. Custom hole patterns available.</p>
      <table class="spec-table">
        <tr><td>Material</td><td>High tensile galvanized steel</td></tr>
        <tr><td>Profile</td><td>Z Purlin, C Purlin</td></tr>
        <tr><td>Thickness</td><td>1.6mm – 3.0mm</td></tr>
        <tr><td>Height</td><td>140mm – 300mm</td></tr>
        <tr><td>Length</td><td>Custom cut up to 12m</td></tr>
        <tr><td>Application</td><td>Roof &amp; wall cladding systems</td></tr>
      </table>
    </div>
  </div>

  <!-- ACCESSORIES -->
  <hr class="section-divider" />
  <h3>Accessories — Fasteners, Ventilation &amp; Fittings</h3>
  <div class="card-grid">
    <div class="card">
      <h4>🔩 Roofing Screws &amp; Fasteners</h4>
      <p style="font-size:12px;color:#555;margin-bottom:10px;">Self-drilling screws with EPDM washers for roofing. Complete sealing, anti-corrosion coated.</p>
      <table class="spec-table">
        <tr><td>Type</td><td>Self-drilling, hex head</td></tr>
        <tr><td>Coating</td><td>Zinc + EPDM washer</td></tr>
        <tr><td>Sizes</td><td>50mm, 75mm, 100mm</td></tr>
        <tr><td>Price</td><td>₹3,200/box</td></tr>
      </table>
    </div>
    <div class="card">
      <h4>🌀 Turbo Ventilator (Fan)</h4>
      <p style="font-size:12px;color:#555;margin-bottom:10px;">Wind-driven rotary ventilators for industrial roofs. No electricity required — works on wind power.</p>
      <table class="spec-table">
        <tr><td>Sizes</td><td>300mm, 450mm, 600mm dia</td></tr>
        <tr><td>Material</td><td>Aluminium / GI</td></tr>
        <tr><td>Drive</td><td>Wind powered, no motor</td></tr>
        <tr><td>Price</td><td>₹3,200/unit</td></tr>
      </table>
    </div>
    <div class="card" style="grid-column:span 2;">
      <h4>🏠 Roofing Accessories — Ridge Caps, Flashings &amp; Gutters</h4>
      <p style="font-size:12px;color:#555;margin-bottom:10px;">Complete range of roofing finishing components — ridge caps, flashings, barge boards and gutters. Colour matched to your roofing sheets.</p>
      <table class="spec-table">
        <tr><td>Components</td><td>Ridge caps, barge boards, flashings, gutters, downspouts</td></tr>
        <tr><td>Material</td><td>Galvanized steel / PPGI</td></tr>
        <tr><td>Finish</td><td>Colour matched to roofing sheets</td></tr>
        <tr><td>Price</td><td>₹1,500/set onwards</td></tr>
      </table>
    </div>
  </div>

</div>

<!-- ═══════════════════════════ 05 — BRAND PARTNERS ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">05</div>
  <div>
    <h2>Brand Partners</h2>
    <p>Authorized dealer for India's top 4 steel manufacturers</p>
  </div>
</div>
<div class="content-section">
  <div class="highlight">
    <p>Shunmuga Steel is an authorized dealer for India's leading steel manufacturers. Every product we supply is genuine, BIS certified and backed by manufacturer warranty.</p>
  </div>

  <!-- SAIL -->
  <div class="brand-card">
    <div class="brand-card-header" style="background:#1a56db;">
      <div><h4>SAIL — Steel Authority of India Ltd.</h4><p style="font-size:11px;opacity:0.8;margin-top:2px;">Government of India Maharatna Company</p></div>
      <span class="tag" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">Authorized Dealer</span>
    </div>
    <div class="brand-card-body">
      <div class="brand-meta">
        <div class="brand-meta-item"><strong>Founded</strong>1973</div>
        <div class="brand-meta-item"><strong>Headquarters</strong>New Delhi, India</div>
        <div class="brand-meta-item"><strong>Type</strong>Government PSU (Maharatna)</div>
      </div>
      <p style="font-size:12px;color:#555;margin-bottom:12px;">SAIL is one of the largest state-owned steel making companies in India. Produces iron and steel at five integrated plants and three special steel plants. Manufacturer of a comprehensive range including hot rolled, cold rolled, galvanized and electrical grade steels.</p>
      <div class="products-list">
        <span class="product-chip">HR Coils &amp; Sheets</span>
        <span class="product-chip">CR Coils &amp; Sheets</span>
        <span class="product-chip">GP/GC Sheets</span>
        <span class="product-chip">Electrical Steel</span>
      </div>
      <div><span class="badge-cert">BIS Certified</span><span class="badge-cert">ISO 9001:2015</span><span class="badge-cert">ISO 14001</span></div>
    </div>
  </div>

  <!-- AMNS -->
  <div class="brand-card">
    <div class="brand-card-header" style="background:#c00000;">
      <div><h4>AMNS India — ArcelorMittal Nippon Steel India</h4><p style="font-size:11px;opacity:0.8;margin-top:2px;">World-class flat steel products from Hazira plant</p></div>
      <span class="tag" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">Authorized Dealer</span>
    </div>
    <div class="brand-card-body">
      <div class="brand-meta">
        <div class="brand-meta-item"><strong>Founded</strong>2020 (JV)</div>
        <div class="brand-meta-item"><strong>Headquarters</strong>Hazira, Gujarat</div>
        <div class="brand-meta-item"><strong>Type</strong>JV — ArcelorMittal + Nippon Steel</div>
      </div>
      <p style="font-size:12px;color:#555;margin-bottom:12px;">AM/NS India is a joint venture between ArcelorMittal and Nippon Steel operating the Hazira integrated steel plant — one of the most modern facilities in India. Produces wide range of flat steel products serving automotive, construction, appliance and energy sectors.</p>
      <div class="products-list">
        <span class="product-chip">CR Coils (Auto Grade)</span>
        <span class="product-chip">PPGL Colour Coils</span>
        <span class="product-chip">Hot-Dip Galvanized</span>
        <span class="product-chip">Galvalume</span>
      </div>
      <div><span class="badge-cert">BIS Certified</span><span class="badge-cert">IATF 16949</span><span class="badge-cert">ISO 9001:2015</span></div>
    </div>
  </div>

  <!-- JSW -->
  <div class="brand-card">
    <div class="brand-card-header" style="background:#003087;">
      <div><h4>JSW Steel Ltd.</h4><p style="font-size:11px;opacity:0.8;margin-top:2px;">India's largest integrated steel manufacturer — 28 MTPA</p></div>
      <span class="tag" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">Authorized Dealer</span>
    </div>
    <div class="brand-card-body">
      <div class="brand-meta">
        <div class="brand-meta-item"><strong>Founded</strong>1982</div>
        <div class="brand-meta-item"><strong>Headquarters</strong>Mumbai, Maharashtra</div>
        <div class="brand-meta-item"><strong>Capacity</strong>28 MTPA</div>
      </div>
      <p style="font-size:12px;color:#555;margin-bottom:12px;">JSW Steel is India's leading integrated steel manufacturer. Part of JSW Group. Colour Coated and Galvalume products are market leaders in roofing and construction applications across India.</p>
      <div class="products-list">
        <span class="product-chip">HR Coils</span>
        <span class="product-chip">GP/Galvalume Sheets</span>
        <span class="product-chip">PPGI Colour Coils</span>
        <span class="product-chip">PUF Panels</span>
      </div>
      <div><span class="badge-cert">BIS Certified</span><span class="badge-cert">ISO 9001:2015</span><span class="badge-cert">Green Pro Certified</span></div>
    </div>
  </div>

  <!-- Evonith -->
  <div class="brand-card">
    <div class="brand-card-header" style="background:#059669;">
      <div><h4>Evonith Steel</h4><p style="font-size:11px;opacity:0.8;margin-top:2px;">Modern integrated steel plant — Eastern India</p></div>
      <span class="tag" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3);">Authorized Dealer</span>
    </div>
    <div class="brand-card-body">
      <div class="brand-meta">
        <div class="brand-meta-item"><strong>Founded</strong>2012</div>
        <div class="brand-meta-item"><strong>Headquarters</strong>Kolkata, West Bengal</div>
        <div class="brand-meta-item"><strong>Type</strong>Integrated Steel Plant</div>
      </div>
      <p style="font-size:12px;color:#555;margin-bottom:12px;">Evonith is a modern integrated steel plant focused on high-quality flat steel products. Equipped with state-of-the-art technology meeting stringent quality standards. Popular for structural and construction applications in eastern and southern India.</p>
      <div class="products-list">
        <span class="product-chip">HR Coils</span>
        <span class="product-chip">CR Coils</span>
        <span class="product-chip">Decking Sheets</span>
        <span class="product-chip">Structural Steel</span>
      </div>
      <div><span class="badge-cert">BIS Certified</span><span class="badge-cert">ISO 9001:2015</span></div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════ 06 — HOW TO ORDER ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">06</div>
  <div>
    <h2>How to Order / Quote Process</h2>
    <p>4-step process from enquiry to delivery</p>
  </div>
</div>
<div class="content-section">
  <div class="steps">
    <div class="step"><div class="num">1</div><h4>Browse &amp; Select</h4><p>Browse our product catalogue. Choose the product, grade and dimensions you need.</p></div>
    <div class="step"><div class="num">2</div><h4>Add to Quote Basket</h4><p>Add items to your quote basket. Specify quantity, unit and any custom dimensions.</p></div>
    <div class="step"><div class="num">3</div><h4>Submit Request</h4><p>Fill in delivery address and submit. Our team reviews within 2 hours on working days.</p></div>
    <div class="step"><div class="num">4</div><h4>Confirm &amp; Deliver</h4><p>We confirm pricing, you approve. Delivery within 3–7 business days across Tamil Nadu.</p></div>
  </div>

  <hr class="section-divider" />
  <div class="two-col">
    <div>
      <h3>Quote Request Options</h3>
      <table>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">📞 Call Us</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">+91-7200240007 (Chennai)<br/>+91-7200240008 (Erode)</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">📧 Email</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">sales@shunmugasteel.com</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">🌐 Online Portal</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">shunmugasteel.com — 24/7 quote basket</td></tr>
        <tr><td style="padding:8px 12px;font-size:12px;">🏢 Walk-in</td><td style="padding:8px 12px;font-size:12px;">Chennai &amp; Erode offices, Mon–Sat 9AM–6PM</td></tr>
      </table>
    </div>
    <div>
      <h3>Payment &amp; Delivery</h3>
      <table>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">Min. Order</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">500 kg (0.5 MT)</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">Payment</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">NEFT / RTGS / Cheque / Online</td></tr>
        <tr><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">GST</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;">18% on all products (GST invoice)</td></tr>
        <tr><td style="padding:8px 12px;font-size:12px;">Delivery</td><td style="padding:8px 12px;font-size:12px;">3–7 business days, pan Tamil Nadu</td></tr>
      </table>
    </div>
  </div>
</div>

<!-- ═══════════════════════════ 07 — TESTIMONIALS ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">07</div>
  <div>
    <h2>Customer Testimonials</h2>
    <p>What our customers say about Shunmuga Steel</p>
  </div>
</div>
<div class="content-section">
  <div class="testimonial-grid">
    <div class="testimonial">
      <div class="stars">★★★★★</div>
      <p class="text">"Consistently excellent steel quality. Shunmuga Steel has been our partner for 10 years. On-time delivery every time — total reliability."</p>
      <div class="author">Rajesh Kumar</div>
      <div class="company">KR Constructions &nbsp;·&nbsp; HR Coils customer</div>
    </div>
    <div class="testimonial">
      <div class="stars">★★★★★</div>
      <p class="text">"Best pricing for bulk orders in Tamil Nadu. The team is knowledgeable and helped us choose exactly the right grade for our project."</p>
      <div class="author">Suresh Babu</div>
      <div class="company">SB Infrastructure &nbsp;·&nbsp; GP Sheets customer</div>
    </div>
    <div class="testimonial">
      <div class="stars">★★★★★</div>
      <p class="text">"Polycarbonate and GC sheets delivered on schedule. Packaging was perfect, quality as certified. Will definitely order again for our next project."</p>
      <div class="author">Anand Rajan</div>
      <div class="company">Anand Roofing Works &nbsp;·&nbsp; Polycarbonate Sheets</div>
    </div>
    <div class="testimonial">
      <div class="stars">★★★★★</div>
      <p class="text">"Authorized dealer for SAIL and AMNS. The BIS-certified products give us confidence. Factory-direct pricing makes all the difference."</p>
      <div class="author">Murugan S</div>
      <div class="company">Sri Murugan Traders &nbsp;·&nbsp; CR Coils customer</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════ 08 — CONTACT INFORMATION ═══════════════════════════ -->
<div class="page-break"></div>
<div class="section-header">
  <div class="num-badge">08</div>
  <div>
    <h2>Contact Information</h2>
    <p>Offices, phone numbers, email and working hours</p>
  </div>
</div>
<div class="content-section">
  <div class="card-grid">
    <div class="card">
      <h4>📍 Chennai Office (Head Office)</h4>
      <div class="card-row"><span class="icon">🏢</span><span>Shunmuga Steel Traders, Perambur, Chennai — 600 011, Tamil Nadu</span></div>
      <div class="card-row"><span class="icon">📞</span><span style="color:#E67E22;font-weight:600;">+91-7200240007</span></div>
      <div class="card-row"><span class="icon">✉</span><span style="color:#E67E22;">sales@shunmugasteel.com</span></div>
      <div class="card-row"><span class="icon">🕐</span><span>Mon – Sat: 9:00 AM – 6:00 PM</span></div>
    </div>
    <div class="card">
      <h4>📍 Erode Office (Branch)</h4>
      <div class="card-row"><span class="icon">🏢</span><span>Shunmuga Steel Traders, Erode Main Road, Erode — 638 001, Tamil Nadu</span></div>
      <div class="card-row"><span class="icon">📞</span><span style="color:#E67E22;font-weight:600;">+91-7200240008</span></div>
      <div class="card-row"><span class="icon">✉</span><span style="color:#E67E22;">erode@shunmugasteel.com</span></div>
      <div class="card-row"><span class="icon">🕐</span><span>Mon – Sat: 9:00 AM – 6:00 PM</span></div>
    </div>
  </div>

  <hr class="section-divider" />
  <h3>Online &amp; Digital Channels</h3>
  <table>
    <tr><th>Channel</th><th>Details</th><th>Response Time</th></tr>
    <tr><td>Website</td><td>shunmugasteel.com — Quote basket, product catalogue, order tracking</td><td>24/7 available</td></tr>
    <tr><td>Email — Sales</td><td>sales@shunmugasteel.com</td><td>Within 2 hours (working days)</td></tr>
    <tr><td>Email — Erode</td><td>erode@shunmugasteel.com</td><td>Within 2 hours (working days)</td></tr>
    <tr><td>General</td><td>info@shunmugasteel.com</td><td>Same business day</td></tr>
    <tr><td>Phone — Chennai</td><td>+91-7200240007</td><td>Instant (9AM–6PM)</td></tr>
    <tr><td>Phone — Erode</td><td>+91-7200240008</td><td>Instant (9AM–6PM)</td></tr>
  </table>

  <hr class="section-divider" />
  <div class="highlight">
    <p><strong>Bulk Enquiries:</strong> For orders above 10 MT, call us directly for special pricing. We offer volume discounts, credit terms and priority delivery for regular customers.</p>
  </div>
</div>

<!-- ═══════════════════════════ DOC FOOTER ═══════════════════════════ -->
<div class="doc-footer">
  <p><strong style="color:rgba(255,255,255,0.85);">Shunmuga Steel Traders</strong> &nbsp;·&nbsp; Est. 1976 &nbsp;·&nbsp; Chennai &amp; Erode, Tamil Nadu</p>
  <p style="margin-top:4px;">Authorized Dealer — SAIL · AMNS India · JSW Steel · Evonith &nbsp;·&nbsp; BIS Certified Products &nbsp;·&nbsp; ISO Standards</p>
  <p style="margin-top:4px;">© ${new Date().getFullYear()} Shunmuga Steel Traders. All rights reserved. &nbsp;·&nbsp; Generated ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</p>
</div>

<!-- Print Button (hidden in print) -->
<div class="no-print" style="position:fixed;bottom:24px;right:24px;z-index:999;">
  <button onclick="window.print()" style="background:#E67E22;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 20px rgba(230,126,34,0.4);">
    🖨 Save as PDF
  </button>
</div>

</body>
</html>`

const outPath = path.join('C:/Users/skann/OneDrive/Desktop', 'Shunmuga_Steel_Full_Content.html')
fs.writeFileSync(outPath, html, 'utf8')
console.log('✅ HTML saved to:', outPath)
console.log('📄 Open in Chrome → Ctrl+P → Save as PDF → A4, Margins: Default')
console.log('   File size:', (fs.statSync(outPath).size / 1024).toFixed(1), 'KB')
