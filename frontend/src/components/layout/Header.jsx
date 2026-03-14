import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuoteStore } from '../../store/quoteStore'
import { LOGO_PATH } from '../../utils/cdn'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const items = useQuoteStore((s) => s.items)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
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
                  <li className="menu-item position-relative">
                    <Link to="/products/flat-products" className="item-link">
                      <span className="text cus-text">Products</span>
                      <i className="icon icon-CaretDown"></i>
                    </Link>
                    <div className="sub-menu mega-menu-item">
                      <ul className="sub-menu_list">
                        <li>
                          <Link to="/products/flat-products" className="sub-menu_link has-text">
                            <span className="cus-text">Flat Products</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/roofing-products" className="sub-menu_link has-text">
                            <span className="cus-text">Roofing Solutions</span>
                          </Link>
                        </li>
                        <li>
                          <Link to="/products/accessories" className="sub-menu_link has-text">
                            <span className="cus-text">Accessories</span>
                          </Link>
                        </li>
                      </ul>
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
            <Link to="/products/flat-products" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Flat Products</Link>
            <Link to="/products/roofing-products" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Roofing Solutions</Link>
            <Link to="/products/accessories" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Accessories</Link>
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
