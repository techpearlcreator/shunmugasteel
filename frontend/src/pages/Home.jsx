import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules'
import { useQuoteStore } from '../store/quoteStore'

/* ─── CDN image helper ─── */
const CDN = (f) => `/@fs/C:/My%20Web%20Sites/SHUNMUGAMSTEEL/cdn2.zohoecommerce.com/${f}`

/* ─── Countdown hook ─── */
function useCountdown(targetDate) {
  const calc = () => {
    const diff = Math.max(0, targetDate - Date.now())
    return {
      days:  Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      mins:  Math.floor((diff % 3600000) / 60000),
      secs:  Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ─── Lookbook Pin (click-toggle product card) ─── */
function LookbookPin({ product, dropstart, top, left }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div className="lookbook-item" style={{ position: 'absolute', top, left }} ref={ref}>
      <div className={`dropdown dropup-center dropdown-custom ${dropstart ? 'dropstart' : 'dropend'}${open ? ' show' : ''}`}>
        <div role="button" className="tf-pin-btn bundle-pin-item" onClick={() => setOpen((v) => !v)}>
          <span></span>
        </div>
        {open && (
          <div className="dropdown-menu pst-2 show">
            <div className="lookbook-product">
              <Link to={`/products/${product.slug}`} className="image" onClick={() => setOpen(false)}>
                <img width="88" height="88" src={product.img} alt={product.name} />
              </Link>
              <div className="content">
                <Link to={`/products/${product.slug}`} className="name-prd link fw-medium lh-24 text-line-clamp-2" onClick={() => setOpen(false)}>
                  {product.name}
                </Link>
                <div className="price-wrap">
                  <span className="price-new text-primary fw-semibold">{product.price}</span>
                  <span className="price-old text-caption-01 cl-text-3">{product.note}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Static data ─── */
const HERO_SLIDES = [
  {
    image: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg'),
    subtitle: 'MOST TRUSTED SINCE 1976',
    title: 'Premium Steel for Every Project',
    desc: 'Durable materials with reliable performance, helping every build stand stronger, safer, and confidently on schedule.',
    cta: 'Request Quotation',
    link: '/products/flat-products',
  },
  {
    image: CDN('hot-rolled-coils-sheets-bannerc5c5.jpg'),
    subtitle: 'AUTHORIZED STEEL DEALER',
    title: 'Roofing Sheets, PUF Panels & Decking Solutions',
    desc: 'Complete roofing and insulation solutions for industrial and commercial construction projects.',
    cta: 'Explore Products',
    link: '/products/roofing-products',
  },
  {
    image: CDN('cold-rolled-steel072e.jpg'),
    subtitle: 'BULK SUPPLY SPECIALIST',
    title: 'Build With Confidence',
    desc: "Every product meets IS standards. Factory-tested, certified steel from India's most trusted manufacturers.",
    cta: 'Get a Quote',
    link: '/quote-basket',
  },
]

const CATEGORIES = [
  { name: 'CR Coils', slug: 'flat-products', image: CDN('images/SST-CR-Coils-2ec0d.png'), count: '20 Products' },
  { name: 'GP Sheets', slug: 'flat-products', image: CDN('gpsheetcoilc6bd.jpg'), count: '31 Products' },
  { name: 'GC Sheets', slug: 'roofing-products', image: CDN('galvanized-corrugated-sheets7d36.jpg'), count: '18 Products' },
  { name: 'PPGL Coils', slug: 'flat-products', image: CDN('Color-Coated-Coilsb58b.jpg'), count: '32 Products' },
  { name: 'Decking Sheets', slug: 'roofing-products', image: CDN('decking-sheets-17e37.jpg'), count: '32 Products' },
  { name: 'PUF Panels', slug: 'roofing-products', image: CDN('purlin-108a6.jpg'), count: '20 Products' },
  { name: 'Slitted Coils', slug: 'flat-products', image: CDN('gp-slit-coil-952cf2f.jpg'), count: '18 Products' },
  { name: 'Roofing Systems', slug: 'accessories', image: CDN('roofing-accessories-types0572.jpg'), count: '18 Products' },
  { name: 'HR Coils', slug: 'flat-products', image: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg'), count: '26 Products' },
]

const FLAT_PRODUCTS = [
  { id: 1, slug: 'hr-coils-sheets', name: 'HR Coil IS 2062 – Hot Rolled Pickled', image: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 2, slug: 'cr-coils-sheets', name: 'CR Coil IS 513 – Cold Rolled Steel Coil', image: CDN('images/SST-CR-Coils-2ec0d.png'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 3, slug: 'gp-sheets-coils', name: 'GP Sheet IS 277 – Galvanized Plain', image: CDN('gpsheetcoilc6bd.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 4, slug: 'gc-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('galvanized-corrugated-sheets7d36.jpg'), badge: null, priceNote: null },
  { id: 5, slug: 'ppgl-colour-coils', name: 'PPGL Colour Coil – Pre-Painted Steel', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 6, slug: 'cr-slitted-coil', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('0-25mm-cold-rolled-coil-1000x1000cf88.jpg'), badge: 'NEW', priceNote: null },
  { id: 7, slug: 'decking-sheets', name: 'Galvalume Decking Sheet', image: CDN('galvanized-steel-sheets47fe.jpg'), badge: null, priceNote: 'Custom Sizes' },
  { id: 8, slug: 'puf-panels', name: 'PUF Panel – 40mm Insulated', image: CDN('puf-panel-500x5003e3a.jpg'), badge: null, priceNote: 'Custom Cut' },
]

const ROOFING_PRODUCTS = [
  { id: 4, slug: 'gc-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('galvanized-corrugated-sheets7d36.jpg'), badge: null, priceNote: null },
  { id: 3, slug: 'gp-sheets-coils', name: 'GP Sheet IS 277 – Galvanized Plain', image: CDN('gpsheetcoilc6bd.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 1, slug: 'hr-coils-sheets', name: 'HR Coil IS 2062 – Hot Rolled Pickled', image: CDN('images/SST-CR-Coils-2ec0d.png'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 9, slug: 'polycarbonate-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('0-25mm-cold-rolled-coil-1000x1000cf88.jpg'), badge: 'NEW', priceNote: null },
  { id: 5, slug: 'ppgl-colour-coils', name: 'PPGL Colour Coil – Pre-Painted Steel', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 10, slug: 'colour-coated-coils', name: 'Colour Coated Coil – PPGL', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Min. Order: 1 MT' },
  { id: 7, slug: 'decking-sheets', name: 'Galvalume Decking Sheet', image: CDN('galvanized-steel-sheets47fe.jpg'), badge: null, priceNote: 'Custom Sizes' },
  { id: 8, slug: 'puf-panels', name: 'PUF Panel – 40mm Insulated', image: CDN('puf-panel-500x5003e3a.jpg'), badge: null, priceNote: 'Custom Cut' },
]

const ACCESSORIES_PRODUCTS = [
  { id: 7, slug: 'decking-sheets', name: 'Galvalume Decking Sheet', image: CDN('galvanized-steel-sheets47fe.jpg'), badge: null, priceNote: 'Custom Sizes' },
  { id: 4, slug: 'gc-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('galvanized-corrugated-sheets7d36.jpg'), badge: null, priceNote: null },
  { id: 1, slug: 'hr-coils-sheets', name: 'HR Coil IS 2062 – Hot Rolled Pickled', image: CDN('images/SST-CR-Coils-2ec0d.png'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 9, slug: 'polycarbonate-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('0-25mm-cold-rolled-coil-1000x1000cf88.jpg'), badge: 'NEW', priceNote: null },
  { id: 5, slug: 'ppgl-colour-coils', name: 'PPGL Colour Coil – Pre-Painted Steel', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 10, slug: 'colour-coated-coils', name: 'Colour Coated Coil – PPGL', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Min. Order: 1 MT' },
  { id: 11, slug: 'purlin', name: 'Purlin', image: CDN('purlinc517.jpg'), badge: null, priceNote: 'Custom Cut' },
  { id: 12, slug: 'roofing-screws', name: 'Roofing Screws & Fasteners', image: CDN('screws1580.jpg'), badge: null, priceNote: null },
]

const SECOND_SWIPER_PRODUCTS = [
  { id: 1, slug: 'polycarbonate-sheets', name: 'CR Coil IS513 Grade – Cold Rolled Steel Coil', image: CDN('polycarbonate-sheets-1b014.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 2, slug: 'gp-slitted-coil', name: 'GP Sheet IS277 – Galvanized Plain Sheet 0.5mm', image: CDN('gp-slit-coil-952cf2f.jpg'), badge: 'sale', priceNote: 'Min. Order: 500 kg' },
  { id: 3, slug: 'cr-coils-sheets', name: 'GC Sheet – Galv. Corrugated 0.45mm', image: CDN('0-25mm-cold-rolled-coil-1000x1000cf88.jpg'), badge: 'NEW', priceNote: null },
  { id: 4, slug: 'hr-coils-sheets', name: 'HR Coil IS 2062 – Hot Rolled Pickled', image: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 5, slug: 'ppgl-colour-coils', name: 'PPGL Colour Coil – Pre-Painted Steel', image: CDN('Color-Coated-Coilsb58b.jpg'), badge: null, priceNote: 'Bulk Rate Available' },
  { id: 6, slug: 'decking-sheets', name: 'Galvalume Decking Sheet', image: CDN('decking-sheets-17e37.jpg'), badge: null, priceNote: 'Custom Sizes' },
  { id: 7, slug: 'purlin', name: 'Purlin & Structural Steel', image: CDN('purlin-108a6.jpg'), badge: null, priceNote: 'Custom Cut' },
]

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', company: 'KR Constructions', text: '"Consistently excellent steel quality. Shunmuga Steel has been our partner for 10 years. On-time delivery every time — total reliability."', product: 'HR Coils', productImg: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg') },
  { name: 'Suresh Babu', company: 'SB Infrastructure', text: '"Best pricing for bulk orders in Tamil Nadu. The team is knowledgeable and helped us choose exactly the right grade for our project."', product: 'GP Sheets', productImg: CDN('gpsheetcoilc6bd.jpg') },
  { name: 'Anand Rajan', company: 'Anand Roofing Works', text: '"Polycarbonate and GC sheets delivered on schedule. Packaging was perfect, quality as certified. Will definitely order again for our next project."', product: 'Polycarbonate Sheets', productImg: CDN('polycarbonate-sheets-1b014.jpg') },
  { name: 'Murugan S', company: 'Sri Murugan Traders', text: '"Authorized dealer for SAIL and AMNS. The BIS-certified products give us confidence. Factory-direct pricing makes all the difference."', product: 'CR Coils', productImg: CDN('galvanized-corrugated-sheets7d36.jpg') },
]

const BRANDS = [
  { name: 'SAIL', file: 'SAIL_LOGO_NEW3c71.png' },
  { name: 'AMNS', file: 'amnse3b1.png' },
  { name: 'Evonith', file: 'evonith310e.png' },
  { name: 'JSW', file: 'jsw59f5.png' },
]

const MARQUEE_ITEMS = [
  'BULK STEEL SUPPLY ACROSS INDIA',
  'AUTHORIZED DEALER: SAIL · AMNS · JINDAL',
  'QUALITY CERTIFIED STEEL PRODUCTS',
  'SINCE 1976 · CHENNAI · ERODE',
]

const TAB_PRODUCTS = { flat: FLAT_PRODUCTS, roofing: ROOFING_PRODUCTS, accessories: ACCESSORIES_PRODUCTS, specials: FLAT_PRODUCTS }
const TAB_BANNERS = {
  flat: { img: CDN('galvanized-corrugated-sheets-48b47.png'), title: 'Top Quality Flat Products', link: '/products/flat-products' },
  roofing: { img: CDN('galvanized-corrugated-sheets-48b47.png'), title: 'Discover Roofing Solutions', link: '/products/roofing-products' },
  accessories: { img: CDN('galvanized-corrugated-sheets-48b47.png'), title: 'Top Quality Accessories', link: '/products/accessories' },
  specials: { img: CDN('galvanized-corrugated-sheets-48b47.png'), title: 'Special Offers', link: '/products/flat-products' },
}

/* ─── Product Card (exact Amerce structure with star-wrap + 3 action icons) ─── */
function ProductCard({ product }) {
  const addItem = useQuoteStore((s) => s.addItem)
  const navigate = useNavigate()

  function handleQuote(e) {
    e.preventDefault()
    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: null,
      quantity: 1,
      unit: 'MT',
      unit_price: 0,
      total_price: 0,
      specs: '',
      is_custom: true,
      image: product.image,
    })
    navigate('/quote-basket')
  }

  return (
    <div className="card-product product-style_stroke">
      <div className="card-product_wrapper square">
        <Link to={`/products/${product.slug}`} className="product-img">
          <img className="img-product" loading="lazy" width="330" height="330" src={product.image} alt={product.name} />
          <img className="img-hover" loading="lazy" width="330" height="330" src={product.image} alt={product.name} />
        </Link>
        <ul className="product-action_list">
          <li className="wishlist">
            <a href="#" className="hover-tooltip tooltip-left box-icon" onClick={(e) => e.preventDefault()}>
              <span className="icon icon-heart"></span>
              <span className="tooltip">Add to Wishlist</span>
            </a>
          </li>
          <li className="compare">
            <Link to={`/products/${product.slug}`} className="hover-tooltip tooltip-left box-icon">
              <span className="icon icon-ArrowsLeftRight"></span>
              <span className="tooltip">Compare</span>
            </Link>
          </li>
          <li>
            <Link to={`/products/${product.slug}`} className="hover-tooltip tooltip-left box-icon">
              <span className="icon icon-Eye"></span>
              <span className="tooltip">Quick view</span>
            </Link>
          </li>
        </ul>
        {product.badge && (
          <ul className="product-badge_list">
            <li className={`product-badge_item text-caption-01 ${product.badge === 'NEW' ? 'new' : 'sale'}`}>
              {product.badge === 'sale' ? '-25%' : product.badge}
            </li>
          </ul>
        )}
        <div className="product-action_bot">
          <button onClick={handleQuote} className="tf-btn btn-white small w-100">
            Request Quote
          </button>
        </div>
      </div>
      <div className="card-product_info">
        <Link to={`/products/${product.slug}`} className="name-product lh-24 fw-medium link-underline-text">
          {product.name}
        </Link>
        <div className="star-wrap d-flex align-items-center">
          <i className="icon icon-Star"></i>
          <i className="icon icon-Star"></i>
          <i className="icon icon-Star"></i>
          <i className="icon icon-Star"></i>
          <i className="icon icon-Star"></i>
        </div>
        <div className="price-wrap">
          <span className="price-new text-primary fw-semibold">Price on Request</span>
          {product.priceNote && (
            <span className="price-old text-caption-01 cl-text-3">{product.priceNote}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const API = import.meta.env.VITE_API_URL || 'http://localhost/shunmugasteel/backend'

/* ─── Main Page ─── */
export default function Home() {
  const [activeTab, setActiveTab] = useState('flat')
  const [lbSlide, setLbSlide] = useState(1)
  const lookbookRef = useRef(null)
  const [deal, setDeal] = useState(null)

  useEffect(() => {
    fetch(`${API}/hurry-deal`)
      .then((r) => r.json())
      .then((d) => {
        if (d.enabled === '1' && d.end_at && new Date(d.end_at) > new Date()) {
          setDeal(d)
        }
      })
      .catch(() => {})
  }, [])

  const dealTarget = deal ? new Date(deal.end_at).getTime() : Date.now()
  const countdown  = useCountdown(dealTarget)

  const tabProducts = TAB_PRODUCTS[activeTab] || FLAT_PRODUCTS
  const tabBanner = TAB_BANNERS[activeTab] || TAB_BANNERS.flat

  return (
    <main id="wrapper">

      {/* ═══ Hero Slideshow ═══ */}
      <div className="tf-slideshow tf-btn-swiper-main">

        {/* Marquee strip */}
        <div className="infiniteSlide-text-v03 mb-40" style={{ overflow: 'hidden', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', animation: 'infiniteSlide 30s linear infinite' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '40px', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                {text} <i className="icon-Star2" style={{ fontSize: '8px', color: '#E67E22' }}></i>
              </span>
            ))}
          </div>
        </div>

        <div className="container-full">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="tf-swiper sw-slide-show slider_effect_fade"
          >
            {HERO_SLIDES.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div className="slider-wrap slideshow-wrap rounded-20 overflow-hidden">
                  <div className="sld_image">
                    <img
                      width="1770" height="680"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      src={slide.image}
                      alt={slide.title}
                      className="lazyload scale-item scale-item-1"
                      style={{ width: '100%', height: '560px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="sld_content type-4">
                    <div className="content-sld_wrap">
                      <h6 className="mb-12 fade-item fade-item-1" style={{ color: '#fff' }}>{slide.subtitle}</h6>
                      <div className="h1 mb-20 fade-item fade-item-2" style={{ color: '#fff' }}>{slide.title}</div>
                      <p className="text-body-1 fade-item fade-item-3 mb-32" style={{ color: 'rgba(255,255,255,0.88)' }}>{slide.desc}</p>
                      <div className="fade-item fade-item-4">
                        <Link to={slide.link} className="tf-btn btn-white animate-btn animate-dark">
                          {slide.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-line-default tf-sw-pagination" style={{ textAlign: 'center', marginTop: '12px' }}></div>
        </div>
      </div>
      {/* ═══ /Hero ═══ */}

      {/* ═══ Categories ═══ */}
      <section className="themesFlat flat-spacing">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Steel Product Categories</h3>
            <p className="s-desc text-body-1 cl-text-2">Premium quality steel materials for construction, manufacturing &amp; infrastructure projects.</p>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              0:    { slidesPerView: 2, spaceBetween: 10 },
              576:  { slidesPerView: 3, spaceBetween: 15 },
              768:  { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 40 },
            }}
            className="tf-swiper swiper-cate"
            style={{ paddingBottom: '40px' }}
          >
            {CATEGORIES.map((cat) => (
              <SwiperSlide key={cat.name}>
                <Link to={`/products/${cat.slug}`} className="category-v04 hover-img wow fadeInUp">
                  <div className="cate-image img-style">
                    <img loading="lazy" width="240" height="180" src={cat.image} alt={cat.name} />
                  </div>
                  <div className="cate-content text-center">
                    <div className="h5 cate_name link-underline-text">{cat.name}</div>
                    <p className="cate_quantity text-caption-01 cl-text-2">{cat.count}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* ═══ /Categories ═══ */}

      {/* ═══ Featured Products (tab layout) ═══ */}
      <section className="section-top-pick-v02 flat-animate-tab flat-spacing">
        <div className="container">
          <div className="sect-heading type-2 has-col-right">
            <div className="wow fadeInUp">
              <h3 className="s-title">Featured Steel Products</h3>
              <p className="s-desc text-body-1 cl-text-2">Weekly Favorites Selected With Care To Support Your Wellbeing.</p>
            </div>
            <div className="col-right overflow-auto wow fadeInUp" data-wow-delay="0.1s">
              <ul className="tab-btn-wrap-v2" role="tablist" style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, flexWrap: 'wrap' }}>
                {[
                  { key: 'flat', label: 'Flat Products' },
                  { key: 'roofing', label: 'Roofing' },
                  { key: 'accessories', label: 'Accessories' },
                  { key: 'specials', label: 'Specials' },
                ].map((tab) => (
                  <li key={tab.key} className="nav-tab-item" role="presentation">
                    <button
                      className={`tf-btn-tab${activeTab === tab.key ? ' active' : ''}`}
                      onClick={() => setActiveTab(tab.key)}
                      style={{ background: 'none', cursor: 'pointer' }}
                    >
                      <span className="fw-semibold">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tab-content">
            <div className="tab-pane active show">
              <div className="wrap-prd">
                {/* Left: banner + 2 small cards */}
                <div className="col-prd-1">
                  <div className="banner-image-text type-abs style-18 v2 mb-20">
                    <Link to={tabBanner.link} className="bn-image img-style">
                      <img loading="lazy" width="450" height="608" src={tabBanner.img} alt="Steel Products" />
                    </Link>
                    <div className="bn-content wow fadeInUp">
                      <Link to={tabBanner.link} className="title text-white h3 fw-medium link mb-8">
                        {tabBanner.title}
                      </Link>
                      <p className="desc text-body-1 text-white mb-28">Certified quality for every construction project.</p>
                      <Link to={tabBanner.link} className="tf-btn btn-white hv-primary">View Products</Link>
                    </div>
                  </div>
                  <div className="tf-grid-layout tf-col-2 gap-20">
                    {tabProducts.slice(0, 2).map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
                {/* Right: product grid */}
                <div className="col-prd-2">
                  <div className="tf-grid-layout tf-col-2 lg-col-3 gap-20">
                    {tabProducts.slice(2, 8).map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ /Featured Products ═══ */}

      {/* ═══ Section Arrival — "The Future Of Construction" ═══ */}
      <section className="section-thumbs-arrival style-2 flat-spacing">
        <div className="container-full">
          <div className="tf-grid-layout xl-col-3 md-col-2 gap-15">
            {/* Left: text + product thumb */}
            <div className="content order-1 order-md-0">
              <div className="heading">
                <p className="h6">BEST SELL OF THE WEEK</p>
                <h1>The Future Of Construction</h1>
                <p className="text-body-1 cl-text-2">Premium steel products for modern construction — certified, reliable, and delivered on time across Tamil Nadu and beyond.</p>
              </div>
              <div className="thumbs-prd">
                <div className="prd-image">
                  <img loading="lazy" width="100" height="100" src={CDN('hot-rolled-coils-sheets-bannerb1f5.jpg')} alt="HR Coil" />
                </div>
                <div className="prd-info">
                  <Link to="/products/hr-coils-sheets" className="info_name text-body-1 link">HR Coil IS 2062 – Hot Rolled</Link>
                  <div className="info_price">
                    <div className="price-wrap">
                      <span className="price-new font-outfit">Price on Request</span>
                      <span className="price-old text-caption-01 cl-text-2 font-outfit">Bulk Rate Available</span>
                    </div>
                  </div>
                </div>
                <div className="prd-action">
                  <Link to="/quote-basket" className="hover-tooltip tooltip-left btn-action">
                    <i className="icon icon-Handbag"></i>
                    <span className="tooltip">Request Quote</span>
                  </Link>
                </div>
              </div>
            </div>
            {/* Center: main image */}
            <div className="hover-img4">
              <div className="img-style4 w-100 h-100">
                <img className="img-cove" width="580" height="580" loading="lazy" src={CDN('decking-sheetsa142.jpg')} alt="Decking Sheets" />
              </div>
            </div>
            {/* Right: second image */}
            <div className="hover-img4 d-none d-xl-block">
              <div className="img-style4 w-100 h-100">
                <img className="img-cove" width="580" height="580" loading="lazy" src={CDN('Color-Coated-Coilsb58b.jpg')} alt="Colour Coated Coils" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ /Section Arrival ═══ */}

      {/* ═══ Second Product Swiper ═══ */}
      <section className="flat-spacing">
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">Featured Steel Products</h3>
            <p className="s-desc text-body-1 cl-text-2">Weekly Favorites Selected With Care To Support Your Wellbeing.</p>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              0:    { slidesPerView: 1, spaceBetween: 10 },
              576:  { slidesPerView: 2, spaceBetween: 15 },
              768:  { slidesPerView: 3, spaceBetween: 20 },
              1200: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="tf-swiper wrap-sw-over"
            style={{ paddingBottom: '40px' }}
          >
            {SECOND_SWIPER_PRODUCTS.map((p) => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* ═══ /Second Product Swiper ═══ */}

      {/* ═══ Banner Countdown (admin-controlled) ═══ */}
      {deal && (
        <div className="container flat-spacing">
          <div className="banner-countdown-v01 style-4">
            <div className="banner-img">
              <img className="img-cover" width="1410" height="180" loading="lazy" src="/offer-banner-warehouse.png" alt="banner" />
            </div>
            <div className="content">
              <div className="col-left">
                <h2 className="text-white mb-8">{deal.title || 'Hurry! Deals On'}</h2>
                <p className="text-white text-body-1">{deal.subtitle || 'Special pricing for limited time only.'}</p>
                {deal.product_slug && (
                  <Link to={`/product/${deal.product_slug}`} className="tf-btn btn-white animate-btn animate-dark" style={{ marginTop: '12px', display: 'inline-block' }}>
                    View Deal &rarr;
                  </Link>
                )}
              </div>
              <div className="countdown-v01 text-white" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[['Days', countdown.days], ['Hours', countdown.hours], ['Mins', countdown.mins], ['Secs', countdown.secs]].map(([label, val], i, arr) => (
                  <>
                    <div key={label} className="cd-item text-center">
                      <div className="number h2 text-white" style={{ lineHeight: 1, minWidth: '2ch' }}>{String(val).padStart(2, '0')}</div>
                      <div className="text-caption-01 cl-text-3 text-uppercase">{label}</div>
                    </div>
                    {i < arr.length - 1 && <div className="h2 text-white" style={{ lineHeight: 1, paddingBottom: '12px' }}>:</div>}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══ /Banner Countdown ═══ */}

      {/* ═══ Lookbook ═══ */}
      <div>
        <div className="container-full">
          {/* Swiper wrapper with relative so box-nav-pag can overlap bottom-right */}
          <div style={{ position: 'relative' }}>
            <Swiper
              modules={[Navigation]}
              loop={false}
              onSwiper={(swiper) => { lookbookRef.current = swiper }}
              onSlideChange={(swiper) => setLbSlide(swiper.realIndex + 1)}
              className="tf-swiper swiper-type-number rounded-top-20"
            >
              {/* Slide 1 — Construction site */}
              <SwiperSlide>
                <div className="banner-lookbook wrap-lookbook_hover style-2">
                  <img className="img-banner" loading="lazy" width="1920" height="640" src="/lookbook-steel-site.png" alt="Steel Construction Site" />
                  {/* HR Coils — left side near the steel coils on pallets */}
                  <LookbookPin top="45%" left="10%" dropstart={false} product={{
                    slug: 'hr-coils-sheets', name: 'HR Coil IS 2062 – Hot Rolled Steel', img: CDN('hot-rolled-coils-sheets-bannerb1f5.jpg'),
                    price: 'Price on Request', note: 'Bulk Rate Available',
                  }} />
                  {/* Decking Sheets — top center where workers install roof decking */}
                  <LookbookPin top="18%" left="55%" dropstart={false} product={{
                    slug: 'decking-sheets', name: 'Galvalume Decking Sheet', img: CDN('decking-sheets-17e37.jpg'),
                    price: 'Price on Request', note: 'Custom Sizes Available',
                  }} />
                  {/* GP Sheets — right side near stacked sheet piles */}
                  <LookbookPin top="48%" left="78%" dropstart={true} product={{
                    slug: 'gp-sheets-coils', name: 'GP Sheet IS 277 – Galvanized Plain', img: CDN('gpsheetcoilc6bd.jpg'),
                    price: 'Price on Request', note: 'Min. Order: 500 kg',
                  }} />
                </div>
              </SwiperSlide>
              {/* Slide 2 — Warehouse interior */}
              <SwiperSlide>
                <div className="banner-lookbook wrap-lookbook_hover style-2">
                  <img className="img-banner" loading="lazy" width="1920" height="640" src="/lookbook-steel-warehouse.png" alt="Steel Warehouse" />
                  {/* Galvanized sheets — left rack area */}
                  <LookbookPin top="40%" left="12%" dropstart={false} product={{
                    slug: 'gc-sheets', name: 'GC Sheet – Galvanized Corrugated', img: CDN('galvanized-corrugated-sheets7d36.jpg'),
                    price: 'Price on Request', note: 'Min. Order: 500 kg',
                  }} />
                  {/* Colour coils — center floor where colorful coils are */}
                  <LookbookPin top="62%" left="52%" dropstart={false} product={{
                    slug: 'ppgl-colour-coils', name: 'PPGL Colour Coated Coil', img: CDN('Color-Coated-Coilsb58b.jpg'),
                    price: 'Price on Request', note: 'Bulk Rate Available',
                  }} />
                  {/* PUF Panels — right side near the white insulated panels */}
                  <LookbookPin top="38%" left="85%" dropstart={true} product={{
                    slug: 'puf-panels', name: 'PUF Panel – 40mm Insulated', img: CDN('puf-panel-500x5003e3a.jpg'),
                    price: 'Price on Request', note: 'Custom Cut Available',
                  }} />
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Shop The Look box — absolutely overlaps bottom-right of image (exact Amerce style) */}
            <div className="box-nav-pag" style={{
              position: 'absolute', bottom: '24px', right: '24px', zIndex: 10,
              background: '#fff', borderRadius: '12px', padding: '16px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: '220px',
            }}>
              <p className="title lh-24" style={{ fontWeight: 600, marginBottom: '12px', fontSize: '15px' }}>Shop The Look</p>
              <div className="nav-pag_wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="nav-prev-swiper"
                  style={{ cursor: 'pointer', border: '1px solid #e0e0e0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}
                  onClick={() => lookbookRef.current?.slidePrev()}
                >
                  <i className="icon icon-ArrowLeft"></i>
                </button>
                <span className="text-body-1" style={{ fontWeight: 500, minWidth: '40px', textAlign: 'center', whiteSpace: 'nowrap' }}>{lbSlide} / 2</span>
                <button
                  className="nav-next-swiper"
                  style={{ cursor: 'pointer', border: '1px solid #e0e0e0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}
                  onClick={() => lookbookRef.current?.slideNext()}
                >
                  <i className="icon icon-ArrowRight"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Brand Scroll inside lookbook container */}
          <div className="infiniteSlide-brand style-2 wow fadeInUp" style={{ overflow: 'hidden', padding: '20px 0', borderTop: '1px solid #e9e9e9', borderBottom: '1px solid #e9e9e9' }}>
            <div style={{ display: 'flex', gap: '60px', whiteSpace: 'nowrap', animation: 'infiniteSlide 15s linear infinite', alignItems: 'center' }}>
              {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
                <div key={i} className="infiniteSlide-item" style={{ display: 'inline-block', flexShrink: 0 }}>
                  <div className="img-brand">
                    <img
                      width="120" height="40"
                      src={CDN(brand.file)}
                      alt={brand.name}
                      style={{ objectFit: 'contain', maxHeight: '40px', filter: 'grayscale(100%)', transition: 'filter 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0%)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(100%)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ═══ /Lookbook ═══ */}

      {/* ═══ Testimonials ═══ */}
      <section className="flat-spacing" style={{ background: '#f7f7f7' }}>
        <div className="container">
          <div className="sect-heading type-2 text-center wow fadeInUp">
            <h3 className="s-title">What Our Customers Say</h3>
            <p className="s-desc text-body-1 cl-text-2">Trusted by hundreds of builders, contractors and steel distributors across Tamil Nadu.</p>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              0:    { slidesPerView: 1, spaceBetween: 16 },
              768:  { slidesPerView: 2, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="tf-swiper"
            style={{ paddingBottom: '40px', marginTop: '32px' }}
          >
            {TESTIMONIALS.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="testimonial-v01 style-2 type-3">
                  <div className="tes-content">
                    <div className="star-wrap d-flex align-items-center">
                      <i className="icon icon-Star fs-24"></i>
                      <i className="icon icon-Star fs-24"></i>
                      <i className="icon icon-Star fs-24"></i>
                      <i className="icon icon-Star fs-24"></i>
                      <i className="icon icon-Star fs-24"></i>
                    </div>
                    <div className="tes_author" style={{ margin: '12px 0 8px' }}>
                      <div className="h6 author-name">{t.name}</div>
                      <div className="author-verified">
                        <i className="icon icon-CheckCircle1"></i>
                        <span className="text cl-text-2">{t.company}</span>
                      </div>
                    </div>
                    <p className="tes_text h6 fw-medium text-capitalize">{t.text}</p>
                    <div className="tes_product" style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="product-image">
                        <img loading="lazy" width="60" height="60" src={t.productImg} alt={t.product} style={{ borderRadius: '8px', objectFit: 'cover' }} />
                      </div>
                      <div className="product-infor">
                        <Link to="/products/flat-products" className="prd_name link fw-medium lh-24 text-line-clamp-1">{t.product}</Link>
                        <p className="prd_price fw-semibold text-primary">Price on Request</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* ═══ /Testimonials ═══ */}

      {/* ═══ CTA Banner ═══ */}
      <section style={{ background: '#1A252F', padding: '64px 0' }}>
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h3 className="text-white" style={{ marginBottom: '16px' }}>Ready to Order Steel in Bulk?</h3>
            <p className="cl-text-3 text-body-1" style={{ marginBottom: '32px', maxWidth: '520px', margin: '0 auto 32px' }}>
              Get the best prices for bulk steel orders. Our team will send you a customized quotation within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quote-basket" className="tf-btn btn-fill animate-btn">Request Quotation</Link>
              <a href="tel:+917200240007" className="tf-btn btn-white animate-btn animate-dark">Call +91-7200240007</a>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ /CTA ═══ */}

    </main>
  )
}
