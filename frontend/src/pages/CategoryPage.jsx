import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useQuoteStore } from '../store/quoteStore'
import { cdnImg } from '../utils/cdn'

const FALLBACK = {
  'flat-products': {
    name: 'Flat Products', description: 'Hot Rolled, Cold Rolled, Galvanized and Colour Coated steel coils and sheets.', image: 'hot-rolled-coils-sheets-bannerb1f5.jpg',
    subCategories: ['All', 'HR Coils & Sheets', 'CR Coils & Sheets', 'GP/GC Sheets', 'Colour Coated', 'Slitted Coils'],
    products: [
      { id: 1, name: 'HR Coils & Sheets', slug: 'hr-coils-sheets', product_type: 'standard', brand: 'SAIL', image_url: 'hot-rolled-coils-sheets-bannerb1f5.jpg', base_price: 58500, stock_status: 'in_stock', sub_category: 'HR Coils & Sheets', description: 'Hot Rolled Coils and Sheets for structural applications.' },
      { id: 2, name: 'CR Coils & Sheets', slug: 'cr-coils-sheets', product_type: 'standard', brand: 'AMNS', image_url: '0-25mm-cold-rolled-coil-1000x1000cf88.jpg', base_price: 72000, stock_status: 'in_stock', sub_category: 'CR Coils & Sheets', description: 'Cold Rolled steel for automotive and precision fabrication.' },
      { id: 3, name: 'GP Sheets & Coils', slug: 'gp-sheets-coils', product_type: 'standard', brand: 'JSW', image_url: 'galvanized-steel-sheets47fe.jpg', base_price: 85000, stock_status: 'in_stock', sub_category: 'GP/GC Sheets', description: 'Galvanized Plain sheets with zinc coating.' },
      { id: 4, name: 'GC Sheets', slug: 'gc-sheets', product_type: 'standard', brand: 'SAIL', image_url: 'galvanized-corrugated-sheets7d36.jpg', base_price: 80000, stock_status: 'in_stock', sub_category: 'GP/GC Sheets', description: 'Galvanized Corrugated Sheets for roofing.' },
      { id: 5, name: 'PPGL Colour Coils', slug: 'ppgl-colour-coils', product_type: 'standard', brand: 'AMNS', image_url: 'Color-Coated-Coilsb58b.jpg', base_price: 95000, stock_status: 'in_stock', sub_category: 'Colour Coated', description: 'Pre-Painted Galvalume colour coated coils.' },
      { id: 6, name: 'GP Slitted Coil', slug: 'gp-slitted-coil', product_type: 'standard', brand: 'JSW', image_url: 'gp-slit-coil-952cf2f.jpg', base_price: 87000, stock_status: 'in_stock', sub_category: 'Slitted Coils', description: 'Galvanized Plain slit coils cut to specified widths.' },
      { id: 7, name: 'CR Slitted Coil', slug: 'cr-slitted-coil', product_type: 'standard', brand: 'Evonith', image_url: '0-25mm-cold-rolled-coil-1000x1000cf88.jpg', base_price: 74000, stock_status: 'in_stock', sub_category: 'Slitted Coils', description: 'Cold Rolled slit coils for precision applications.' },
    ],
  },
  'roofing-products': {
    name: 'Roofing Solutions', description: 'Complete roofing solutions from structural decking to insulated panels.', image: 'decking-sheets-17e37.jpg',
    subCategories: ['All', 'Decking Sheets', 'Insulated Panels', 'Transparent Sheets', 'Structural'],
    products: [
      { id: 8, name: 'Decking Sheets', slug: 'decking-sheets', product_type: 'custom', brand: 'Evonith', image_url: 'decking-sheets-17e37.jpg', base_price: null, stock_status: 'in_stock', sub_category: 'Decking Sheets', description: 'Steel deck sheets for composite flooring.' },
      { id: 9, name: 'PUF Panels', slug: 'puf-panels', product_type: 'custom', brand: 'JSW', image_url: 'PUF Panels8be3.png', base_price: null, stock_status: 'in_stock', sub_category: 'Insulated Panels', description: 'Polyurethane Foam insulated sandwich panels.' },
      { id: 10, name: 'UPVC Sheets', slug: 'upvc-sheets', product_type: 'custom', brand: 'JSW', image_url: 'UPVC Sheet46e3.png', base_price: null, stock_status: 'in_stock', sub_category: 'Transparent Sheets', description: 'Unplasticised PVC sheets for roofing and skylights.' },
      { id: 11, name: 'Polycarbonate Sheets', slug: 'polycarbonate-sheets', product_type: 'custom', brand: 'SAIL', image_url: 'polycarbonate-sheets-1b014.jpg', base_price: null, stock_status: 'in_stock', sub_category: 'Transparent Sheets', description: 'High-impact polycarbonate sheets for skylights.' },
      { id: 12, name: 'Purlin', slug: 'purlin', product_type: 'custom', brand: 'AMNS', image_url: 'purlinc517.jpg', base_price: null, stock_status: 'in_stock', sub_category: 'Structural', description: 'Z and C Purlins for roof and wall cladding systems.' },
    ],
  },
  'accessories': {
    name: 'Accessories', description: 'Roofing fasteners, ventilation and finishing accessories.', image: 'roofing-accessories-types0572.jpg',
    subCategories: ['All', 'Fasteners', 'Ventilation', 'Fittings'],
    products: [
      { id: 13, name: 'Roofing Screws', slug: 'roofing-screws', product_type: 'standard', brand: 'SAIL', image_url: 'screws1580.jpg', base_price: 3200, stock_status: 'in_stock', sub_category: 'Fasteners', description: 'Self-drilling screws with EPDM washers for roofing.' },
      { id: 14, name: 'Turbo Ventilator', slug: 'turbo-ventilator', product_type: 'standard', brand: 'JSW', image_url: 'Turbo-Fan12e6.jpg', base_price: 3200, stock_status: 'in_stock', sub_category: 'Ventilation', description: 'Wind-driven rotary ventilators for industrial roofs.' },
      { id: 15, name: 'Roofing Accessories', slug: 'roofing-accessories', product_type: 'standard', brand: 'AMNS', image_url: 'roofing-accessories-types0572.jpg', base_price: 1500, stock_status: 'in_stock', sub_category: 'Fittings', description: 'Ridge caps, flashings, gutters and components.' },
    ],
  },
}

function ProductCard({ product }) {
  const addItem = useQuoteStore((s) => s.addItem)
  const navigate = useNavigate()
  const isCustom = product.product_type === 'custom'
  const basePrice = product.starting_price ?? product.base_price ?? null

  function handleQuote(e) {
    e.preventDefault()
    const price = isCustom ? 0 : (basePrice || 0)
    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: null,
      quantity: 1,
      unit: 'MT',
      unit_price: price,
      total_price: price,
      specs: '',
      is_custom: isCustom,
      image: product.primary_image || cdnImg(product.image_url || ''),
    })
    navigate('/quote-basket')
  }

  return (
    <div className="card-product product-style_stroke">
      <div className="card-product_wrapper square">
        <Link to={`/product/${product.slug}`} className="product-img">
          <img
            className="img-product"
            loading="lazy"
            width="330" height="330"
            src={product.primary_image || cdnImg(product.image_url || '')}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <img
            className="img-hover"
            loading="lazy"
            width="330" height="330"
            src={product.primary_image || cdnImg(product.image_url || '')}
            alt={product.name}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </Link>
        <ul className="product-action_list">
          <li>
            <Link to={`/product/${product.slug}`} className="hover-tooltip tooltip-left box-icon">
              <span className="icon icon-Eye"></span>
              <span className="tooltip">Quick View</span>
            </Link>
          </li>
        </ul>
        {product.brand && (
          <ul className="product-badge_list">
            <li className="product-badge_item text-caption-01 new">{product.brand}</li>
          </ul>
        )}
        <div className="product-action_bot">
          <button onClick={handleQuote} className="tf-btn btn-white small w-100">
            {isCustom ? 'Get Quote' : 'Add to Quote'}
          </button>
        </div>
      </div>
      <div className="card-product_info">
        <Link to={`/product/${product.slug}`} className="name-product lh-24 fw-medium link-underline-text">
          {product.name}
        </Link>
        <div className="price-wrap">
          {isCustom || !basePrice ? (
            <span className="price-new text-primary fw-semibold">Price on Request</span>
          ) : (
            <>
              <span className="price-new text-primary fw-semibold">
                &#x20b9;{Number(basePrice).toLocaleString('en-IN')}/MT
              </span>
              <span className="price-old text-caption-01 cl-text-3">+ GST</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  const { categorySlug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setActiveTab('All')
    productService.getCategoryBySlug(categorySlug)
      .then((res) => {
        const d = res.data?.data || res.data
        if (d && (d.name || d.products)) { setCategory(d); setProducts(d.products || []) }
        else loadFb()
      })
      .catch(loadFb)
      .finally(() => setLoading(false))
    function loadFb() {
      const fb = FALLBACK[categorySlug]
      if (fb) { setCategory(fb); setProducts(fb.products) }
    }
  }, [categorySlug])

  const subs = category?.subCategories || ['All']
  const filtered = activeTab === 'All' ? products : products.filter((p) => p.sub_category === activeTab)

  if (loading) {
    return (
      <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
        <h2 className="h3">Category not found</h2>
        <Link to="/" className="tf-btn btn-fill" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Home</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Category Banner */}
      <div style={{ position: 'relative', height: 'clamp(140px, 25vw, 220px)', overflow: 'hidden', background: '#1A252F' }}>
        <img
          src={cdnImg(category.image || '')}
          alt={category.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(26,37,47,0.95) 0%,rgba(44,62,80,0.6) 100%)' }} />
        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <nav style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
            <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: '#fff' }}>{category.name}</span>
          </nav>
          <h1 className="h2 text-white" style={{ marginBottom: '8px', fontSize: 'clamp(20px, 4.5vw, 36px)' }}>{category.name}</h1>
          <p style={{ color: '#ccc', maxWidth: '600px', fontSize: 'clamp(12px, 2vw, 14px)', margin: 0 }}>{category.description}</p>
        </div>
      </div>

      {/* Products Section */}
      <section className="flat-spacing">
        <div className="container">

          {/* Sub-category filter tabs */}
          {subs.length > 1 && (
            <div style={{ marginBottom: '32px' }}>
              <ul className="tab-btn-wrap-v2" role="tablist" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
                {subs.map((tab) => (
                  <li key={tab} className="nav-tab-item" role="presentation">
                    <button
                      className={`tf-btn-tab${activeTab === tab ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab)}
                      style={{ background: 'none', cursor: 'pointer' }}
                    >
                      <span className="fw-semibold">{tab}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Result count */}
          <p className="cl-text-2 text-caption-01" style={{ marginBottom: '24px' }}>
            Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
            {activeTab !== 'All' && ` in "${activeTab}"`}
          </p>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className="tf-grid-layout tf-col-2 md-col-3 lg-col-4 gap-30">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#999' }}>
              <p>No products found in this category.</p>
              <Link to="/" className="tf-btn btn-fill" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Home</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
