import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuoteStore } from '../../store/quoteStore'
import { LOGO_PATH } from '../../utils/cdn'
import { productService } from '../../services/productService'
import './Header.css'

// ── Static fallback data ──────────────────────────────────────────────────────
const STATIC_FLAT = [
  { name: 'Hot Rolled Steel',   slug: 'hr-coils-sheets' },
  { name: 'Cold Rolled Steel',  slug: 'cr-coils-sheets' },
  { name: 'Galvanized Steel',   slug: 'gp-sheets-coils' },
  { name: 'GP Slitted Coil',    slug: 'gp-slitted-coil' },
  { name: 'CR Slitted Coil',    slug: 'cr-slitted-coil' },
]
const STATIC_ROOFING = [
  { name: 'Galvanized Corrugated Sheets', slug: 'gc-sheets' },
  { name: 'Pre-painted Colour Coated',    slug: 'ppgl-colour-coils' },
  { name: 'Decking Sheets',               slug: 'decking-sheets' },
  { name: 'Purlin',                        slug: 'purlin' },
  { name: 'PUF Panels',                   slug: 'puf-panels' },
  { name: 'UPVC Sheets',                  slug: 'upvc-sheets' },
]
const STATIC_ACCESSORIES = [
  { name: 'Turbo Ventilators', slug: null },
  { name: 'Roofing Screws',    slug: null },
]


let _menuCache = null

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)
const IconBag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const items     = useQuoteStore((s) => s.items)
  const navigate  = useNavigate()
  const location  = useLocation()
  const glowRef   = useRef(null)

  // Animation state
  const [islandClass, setIslandClass] = useState('intro-circle')
  // Hover expansion (separate from animation class)
  const [isExpanded,   setIsExpanded]   = useState(false)
  // Desktop dropdown: 'flat' | 'roofing' | 'acc' | null
  const [openDrop, setOpenDrop] = useState(null)
  // Mobile panel
  const [mobileOpen, setMobileOpen]   = useState(false)
  // Mobile accordion: 'flat' | 'roofing' | 'acc' | null
  const [mobileAcc,  setMobileAcc]    = useState(null)

  const [menuItems, setMenuItems] = useState({
    flat:        STATIC_FLAT,
    roofing:     STATIC_ROOFING,
    accessories: STATIC_ACCESSORIES,
  })

  // ── Entrance animation (matches navbar.html JS sequence exactly) ──────────
  useEffect(() => {
    // 100ms: start ball bounce
    const t1 = setTimeout(() => setIslandClass('intro-circle intro-bounce'), 100)
    // 1500ms: expand to full pill (bounce animation is done at 1400ms)
    const t2 = setTimeout(() => setIslandClass('intro-expand'), 1500)
    // 2100ms: stagger-reveal nav content
    const t3 = setTimeout(() => setIslandClass('intro-expand content-ready'), 2100)
    // 4100ms: fade rainbow ring
    const t4 = setTimeout(() => setIslandClass('intro-expand content-ready glow-fade'), 4100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // ── Cursor glow ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top  = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', handler)
    return () => document.removeEventListener('mousemove', handler)
  }, [])

  // ── API fetch (once per session via cache) ─────────────────────────────────
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
      const flat      = extract(flatRes).length    ? extract(flatRes)    : STATIC_FLAT
      const roofing   = extract(roofingRes).length ? extract(roofingRes) : STATIC_ROOFING
      const accRaw    = extract(accRes)
      const accessories = accRaw.length
        ? accRaw.map((p) => ({ name: p.name, slug: null }))
        : STATIC_ACCESSORIES
      _menuCache = { flat, roofing, accessories }
      setMenuItems(_menuCache)
    }).catch(() => {})
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────
  function handleLogout() { logout(); navigate('/') }

  function productLink(item) {
    return item.slug ? `/product/${item.slug}` : '/products/accessories'
  }

  // Magnetic ripple: update --mx / --my CSS vars on each nav link
  function handleMM(e) {
    const r  = e.currentTarget.getBoundingClientRect()
    const mx = ((e.clientX - r.left)  / r.width  * 100).toFixed(1) + '%'
    const my = ((e.clientY - r.top)   / r.height * 100).toFixed(1) + '%'
    e.currentTarget.style.setProperty('--mx', mx)
    e.currentTarget.style.setProperty('--my', my)
  }

  function isActive(path) { return location.pathname === path }

  // ── Desktop dropdown handlers ──────────────────────────────────────────────
  function onDropEnter(name) { setOpenDrop(name); setIsExpanded(true) }
  function onDropLeave()     { setOpenDrop(null); setIsExpanded(false) }

  // ── Island hover ──────────────────────────────────────────────────────────
  function onIslandEnter() { setIsExpanded(true) }
  function onIslandLeave() { if (!openDrop) setIsExpanded(false) }

  // ── Mobile handlers ────────────────────────────────────────────────────────
  function toggleMobile() { setMobileOpen((v) => !v) }
  function closeMobile()  { setMobileOpen(false); setMobileAcc(null) }
  function toggleMobileAcc(key) {
    setMobileAcc((prev) => (prev === key ? null : key))
  }

  // ── Compose island className ───────────────────────────────────────────────
  const isAnimating = islandClass.includes('intro-circle') || islandClass.includes('intro-bounce')
  const fullClass = [
    islandClass,
    !isAnimating && isExpanded ? 'expanded' : '',
    mobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ')

  // ── Dropdown renderers ─────────────────────────────────────────────────────
  function renderDropdown(key, icon, title, badge, items) {
    return (
      <li
        className={`di-nav-item${openDrop === key ? ' open' : ''}`}
        onMouseEnter={() => onDropEnter(key)}
        onMouseLeave={onDropLeave}
      >
        <button className={`di-nav-link${isActive('/products/' + key + '-products') ? ' active' : ''}`} onMouseMove={handleMM}>
          {title} <span className="di-chevron" aria-hidden="true" />
        </button>
        <div className="di-slim-dropdown" role="menu">
          <div className="di-dd-header">
            <span className="di-dd-icon">{icon}</span>
            <span className="di-dd-title">{title}</span>
            {badge && <span className="di-dd-badge">{badge}</span>}
          </div>
          {items.map((item) => (
            <Link
              key={item.slug || item.name}
              to={productLink(item)}
              className="di-mega-link"
              role="menuitem"
              onClick={() => setOpenDrop(null)}
            >
              <span className="di-mega-link-label">{item.name}</span>
            </Link>
          ))}
        </div>
      </li>
    )
  }

  return (
    <>
      {/* Cursor glow */}
      <div ref={glowRef} id="di-cursor-glow" aria-hidden="true" />

      {/* Dynamic Island */}
      <div id="island-wrapper" role="banner">
        <div
          id="island"
          className={fullClass}
          onMouseEnter={onIslandEnter}
          onMouseLeave={onIslandLeave}
        >
          {/* ── Navbar Row ── */}
          <nav id="di-navbar-row" aria-label="Primary navigation">

            {/* Logo */}
            <Link to="/" className="di-logo di-nav-item" aria-label="Shunmuga Steel Home" onClick={closeMobile}>
              <img
                src={LOGO_PATH}
                alt="Shunmuga Steel Traders"
                className="di-logo-img"
                loading="eager"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </Link>

            {/* Desktop nav */}
            <ul id="di-nav-links" role="menubar">
              <li className="di-nav-item">
                <Link
                  to="/"
                  className={`di-nav-link${isActive('/') ? ' active' : ''}`}
                  onMouseMove={handleMM}
                >
                  Home
                </Link>
              </li>

              {renderDropdown('flat',    '🔩', 'Flat Products', 'B2B',       menuItems.flat)}
              {renderDropdown('roofing', '🏠', 'Roofing',       'B2C + B2B', menuItems.roofing)}
              {renderDropdown('acc',     '🔧', 'Accessories',   null,        menuItems.accessories)}

              <li className="di-nav-item">
                <Link to="/about" className={`di-nav-link${isActive('/about') ? ' active' : ''}`} onMouseMove={handleMM}>About</Link>
              </li>
              <li className="di-nav-item">
                <Link to="/contact" className={`di-nav-link${isActive('/contact') ? ' active' : ''}`} onMouseMove={handleMM}>Contact</Link>
              </li>
              {isAuthenticated && (
                <li className="di-nav-item">
                  <Link to="/my-quotes" className={`di-nav-link${isActive('/my-quotes') ? ' active' : ''}`} onMouseMove={handleMM}>My Quotes</Link>
                </li>
              )}
            </ul>

            {/* Right icon buttons */}
            <div className="di-nav-icons">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="di-icon-btn" title={user?.name || 'Profile'}>
                    <IconUser />
                  </Link>
                  <button onClick={handleLogout} className="di-icon-btn" title="Logout">
                    <IconLogout />
                  </button>
                </>
              ) : (
                <Link to="/login" className="di-icon-btn" title="Login">
                  <IconUser />
                </Link>
              )}
              <Link to="/quote-basket" className="di-icon-btn" title="Quote Basket">
                <IconBag />
                {items.length > 0 && <span className="di-cart-badge">{items.length}</span>}
              </Link>
              <button
                className={`di-hamburger${mobileOpen ? ' open' : ''}`}
                onClick={toggleMobile}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                <span /><span /><span />
              </button>
            </div>
          </nav>

          {/* ── Mobile Panel ── */}
          <div id="di-mobile-panel" role="navigation" aria-label="Mobile navigation">
            <div className="di-mobile-inner">

              <Link to="/" className="di-mobile-link" onClick={closeMobile}>Home</Link>

              {/* Flat Products accordion */}
              <button
                className={`di-mobile-link${mobileAcc === 'flat' ? ' open' : ''}`}
                onClick={() => toggleMobileAcc('flat')}
                aria-expanded={mobileAcc === 'flat'}
              >
                🔩 Flat Products
                <span className="di-m-chev">▼</span>
              </button>
              <div className={`di-mobile-sub${mobileAcc === 'flat' ? ' open' : ''}`}>
                <span className="di-msub-title">B2B</span>
                {menuItems.flat.map((p) => (
                  <Link key={p.slug || p.name} to={productLink(p)} className="di-msub-link" onClick={closeMobile}>{p.name}</Link>
                ))}
              </div>

              {/* Roofing accordion */}
              <button
                className={`di-mobile-link${mobileAcc === 'roofing' ? ' open' : ''}`}
                onClick={() => toggleMobileAcc('roofing')}
                aria-expanded={mobileAcc === 'roofing'}
              >
                🏠 Roofing
                <span className="di-m-chev">▼</span>
              </button>
              <div className={`di-mobile-sub${mobileAcc === 'roofing' ? ' open' : ''}`}>
                <span className="di-msub-title">B2C + B2B</span>
                {menuItems.roofing.map((p) => (
                  <Link key={p.slug || p.name} to={productLink(p)} className="di-msub-link" onClick={closeMobile}>{p.name}</Link>
                ))}
              </div>

              {/* Accessories accordion */}
              <button
                className={`di-mobile-link${mobileAcc === 'acc' ? ' open' : ''}`}
                onClick={() => toggleMobileAcc('acc')}
                aria-expanded={mobileAcc === 'acc'}
              >
                🔧 Accessories
                <span className="di-m-chev">▼</span>
              </button>
              <div className={`di-mobile-sub${mobileAcc === 'acc' ? ' open' : ''}`}>
                {menuItems.accessories.map((p) => (
                  <Link key={p.name} to="/products/accessories" className="di-msub-link" onClick={closeMobile}>{p.name}</Link>
                ))}
              </div>

              <Link to="/about"   className="di-mobile-link" onClick={closeMobile}>About</Link>
              <Link to="/contact" className="di-mobile-link" onClick={closeMobile}>Contact</Link>

              {/* Auth + basket */}
              <div className="di-mobile-section">
                {isAuthenticated ? (
                  <>
                    <Link to="/my-quotes" className="di-mobile-link" onClick={closeMobile}>My Quotes</Link>
                    <Link to="/profile"   className="di-mobile-link" onClick={closeMobile}>Profile</Link>
                    <button
                      onClick={() => { handleLogout(); closeMobile() }}
                      className="di-mobile-link"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"    className="di-mobile-link" onClick={closeMobile}>Login</Link>
                    <Link to="/register" className="di-mobile-link" onClick={closeMobile}>Register</Link>
                  </>
                )}
                <Link
                  to="/quote-basket"
                  className="di-mobile-link"
                  onClick={closeMobile}
                  style={{ color: 'var(--di-accent)', fontWeight: 600 }}
                >
                  Quote Basket {items.length > 0 && `(${items.length})`}
                </Link>
              </div>

            </div>
          </div>
          {/* ── end mobile panel ── */}

        </div>
      </div>
    </>
  )
}
