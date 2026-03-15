import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuoteStore } from '../../store/quoteStore'
import { LOGO_PATH } from '../../utils/cdn'
import { productService } from '../../services/productService'

// ─── Static fallback (shown instantly, replaced when API responds) ───────────
const STATIC_FLAT = [
  { name: 'Hot Rolled Steel',  slug: 'hr-coils-sheets' },
  { name: 'Cold Rolled Steel', slug: 'cr-coils-sheets' },
  { name: 'Galvanized Steel',  slug: 'gp-sheets-coils' },
  { name: 'GP Slitted Coil',   slug: 'gp-slitted-coil' },
  { name: 'CR Slitted Coil',   slug: 'cr-slitted-coil' },
]
const STATIC_ROOFING = [
  { name: 'Galvanized Corrugated Sheets', slug: 'gc-sheets' },
  { name: 'Pre-painted Colour Coated',    slug: 'ppgl-colour-coils' },
  { name: 'Decking Sheets',               slug: 'decking-sheets' },
  { name: 'Purlin',                       slug: 'purlin' },
  { name: 'PUF Panels',                   slug: 'puf-panels' },
  { name: 'UPVC Sheets',                  slug: 'upvc-sheets' },
]
const STATIC_ACCESSORIES = [
  { name: 'Turbo Fans', slug: null },
  { name: 'Screws',     slug: null },
]

// Module-level cache — fetched once per browser session
let _menuCache = null

// ─── Section label component ──────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: '10px', fontWeight: '700', letterSpacing: '1px',
      textTransform: 'uppercase', color: '#2C3E50',
      borderBottom: '2px solid #E67E22', paddingBottom: '8px', marginBottom: '10px',
    }}>
      {children}
    </p>
  )
}

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const items = useQuoteStore((s) => s.items)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [menuItems, setMenuItems] = useState({
    flat: STATIC_FLAT,
    roofing: STATIC_ROOFING,
    accessories: STATIC_ACCESSORIES,
  })

  // Fetch live products from API (once per session via cache)
  useEffect(() => {
    if (_menuCache) { setMenuItems(_menuCache); return }

    const extract = (res) =>
      (res.data?.data?.products || res.data?.products || [])
        .map((p) => ({ name: p.name, slug: p.slug }))

    Promise.all([
      productService.getCategoryBySlug('flat-products'),
      productService.getCategoryBySlug('roofing-products'),
      productService.getCategoryBySlug('accessories'),
    ]).then(([flatRes, roofingRes, accRes]) => {
      const flat        = extract(flatRes).length        ? extract(flatRes)        : STATIC_FLAT
      const roofing     = extract(roofingRes).length     ? extract(roofingRes)     : STATIC_ROOFING
      // Accessories always link to category page — keep static names, mark slug null
      const accProducts = extract(accRes)
      const accessories = accProducts.length
        ? accProducts.map((p) => ({ name: p.name, slug: null }))
        : STATIC_ACCESSORIES

      _menuCache = { flat, roofing, accessories }
      setMenuItems(_menuCache)
    }).catch(() => {}) // silently keep static fallback on API error
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  // Desktop product link: accessories → category page, others → product page
  function productLink(item, isAccessory = false) {
    return isAccessory ? '/products/accessories' : `/product/${item.slug}`
  }

  return (
    <>
      {/* Topbar */}
      <div className="tf-topbar bg-dark">
        <div className="container">
          <div className="text-center">
            <p className="text-white mb-0" style={{ fontSize: '13px', padding: '8px 0' }}>
              Most Trusted Steel Supplier Since 1976 &nbsp;|&nbsp; Chennai &middot; Erode &nbsp;|&nbsp;
              <a href="tel:+917200240007" className="text-white" style={{ textDecoration: 'none' }}>
                +91-7200240007
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="tf-header">
        <div className="br-line fake-class bottom-0"></div>
        <div className="container-full">
          <div className="header-inner">

            {/* Mobile menu toggle */}
            <div className="box-open-menu-mobile d-xl-none">
              <button
                className="btn-open-menu"
                onClick={() => setMobileOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <i className="icon icon-List"></i>
              </button>
            </div>

            {/* Logo */}
            <div className="header-left">
              <Link to="/" className="logo-site">
                <img
                  loading="lazy"
                  width="150"
                  height="30"
                  src={LOGO_PATH}
                  alt="Shunmuga Steel Traders"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <span className="steel-tag">TRADERS &middot; EST. 1976</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="header-center d-none d-xl-block">
              <nav className="box-navigation">
                <ul className="box-nav-menu">
                  <li className="menu-item">
                    <Link to="/" className="item-link">
                      <span className="text cus-text">Home</span>
                    </Link>
                  </li>

                  {/* Products mega-menu */}
                  <li className="menu-item position-relative">
                    <Link to="/products/flat-products" className="item-link">
                      <span className="text cus-text">Products</span>
                      <i className="icon icon-CaretDown"></i>
                    </Link>
                    <div className="sub-menu mega-menu-item" style={{ minWidth: '720px', left: '50%', transform: 'translateX(-50%)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '20px 8px' }}>

                        {/* Flat Products */}
                        <div style={{ padding: '0 16px' }}>
                          <SectionLabel>Flat Products <span style={{ color: '#888', fontWeight: 400 }}>(B2B)</span></SectionLabel>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {menuItems.flat.map((p) => (
                              <li key={p.slug || p.name}>
                                <Link to={productLink(p)} className="sub-menu_link has-text">
                                  <span className="cus-text">{p.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Roofing */}
                        <div style={{ padding: '0 16px', borderLeft: '1px solid #f0f0f0' }}>
                          <SectionLabel>Roofing <span style={{ color: '#888', fontWeight: 400 }}>(B2C + B2B)</span></SectionLabel>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {menuItems.roofing.map((p) => (
                              <li key={p.slug || p.name}>
                                <Link to={productLink(p)} className="sub-menu_link has-text">
                                  <span className="cus-text">{p.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Accessories */}
                        <div style={{ padding: '0 16px', borderLeft: '1px solid #f0f0f0' }}>
                          <SectionLabel>Accessories</SectionLabel>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {menuItems.accessories.map((p) => (
                              <li key={p.name}>
                                <Link to="/products/accessories" className="sub-menu_link has-text">
                                  <span className="cus-text">{p.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>
                  </li>

                  <li className="menu-item">
                    <Link to="/brands" className="item-link">
                      <span className="text cus-text">Brands</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/about" className="item-link">
                      <span className="text cus-text">About</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/contact" className="item-link">
                      <span className="text cus-text">Contact</span>
                    </Link>
                  </li>
                  {isAuthenticated && (
                    <li className="menu-item">
                      <Link to="/my-quotes" className="item-link">
                        <span className="text cus-text">My Quotes</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* Right Icons */}
            <div className="header-right">
              <ul className="nav-icon-list">
                {isAuthenticated ? (
                  <>
                    <li className="d-none d-sm-block">
                      <Link to="/my-quotes" className="nav-icon-item link" title="My Quotes">
                        <i className="icon icon-ClipboardText"></i>
                      </Link>
                    </li>
                    <li className="d-none d-sm-block">
                      <Link to="/profile" className="nav-icon-item link" title={user?.name || 'Profile'}>
                        <i className="icon icon-User"></i>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="nav-icon-item link"
                        title="Logout"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <i className="icon icon-SignOut"></i>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login" className="nav-icon-item link" title="Login">
                      <i className="icon icon-User"></i>
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/quote-basket" className="nav-icon-item link shop-cart" title="Quote Basket">
                    <i className="icon icon-Handbag"></i>
                    {items.length > 0 && <span className="count">{items.length}</span>}
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Link to="/" className="logo-site" onClick={() => setMobileOpen(false)}>
                <img src={LOGO_PATH} width="120" height="26" alt="Shunmuga Steel" onError={(e) => { e.target.style.display = 'none' }} />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#101010' }}
              >
                <i className="icon icon-Close"></i>
              </button>
            </div>

            <Link to="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>

            {/* Flat Products */}
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#E67E22', marginTop: '12px', marginBottom: '4px', padding: '0' }}>
              Flat Products (B2B)
            </p>
            {menuItems.flat.map((p) => (
              <Link key={p.slug || p.name} to={productLink(p)} className="mobile-nav-link" style={{ paddingLeft: '12px' }} onClick={() => setMobileOpen(false)}>
                {p.name}
              </Link>
            ))}

            {/* Roofing */}
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#E67E22', marginTop: '12px', marginBottom: '4px', padding: '0' }}>
              Roofing (B2C + B2B)
            </p>
            {menuItems.roofing.map((p) => (
              <Link key={p.slug || p.name} to={productLink(p)} className="mobile-nav-link" style={{ paddingLeft: '12px' }} onClick={() => setMobileOpen(false)}>
                {p.name}
              </Link>
            ))}

            {/* Accessories */}
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#E67E22', marginTop: '12px', marginBottom: '4px', padding: '0' }}>
              Accessories
            </p>
            {menuItems.accessories.map((p) => (
              <Link key={p.name} to="/products/accessories" className="mobile-nav-link" style={{ paddingLeft: '12px' }} onClick={() => setMobileOpen(false)}>
                {p.name}
              </Link>
            ))}

            <Link to="/brands" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Brands</Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>About Us</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>

            <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
              {isAuthenticated ? (
                <>
                  <Link to="/my-quotes" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>My Quotes</Link>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false) }}
                    style={{ background: 'none', border: 'none', padding: '12px 0', fontSize: '15px', cursor: 'pointer', color: '#E67E22', display: 'block' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link to="/quote-basket" className="tf-btn btn-fill w-100 text-center" onClick={() => setMobileOpen(false)}>
                Quote Basket {items.length > 0 && `(${items.length})`}
              </Link>
            </div>
          </div>
          <div className="mobile-menu-backdrop" onClick={() => setMobileOpen(false)}></div>
        </div>
      )}
    </>
  )
}
