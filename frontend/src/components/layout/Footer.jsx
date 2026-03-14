import { useState } from 'react'
import { Link } from 'react-router-dom'

const SERVICES = [
  { icon: 'icon-ArrowUDownLeft', title: '48+ Years Experience', text: 'Serving industries across Tamil Nadu since 1976.' },
  { icon: 'icon-Package', title: 'Pan-India Supply', text: 'Bulk steel delivery across all major cities.' },
  { icon: 'icon-Headset', title: '24/7 Support', text: 'Dedicated support team for all your steel needs.' },
  { icon: 'icon-SealPercent', title: 'Best Pricing', text: 'Competitive bulk rates for all steel products.' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <footer className="tf-footer footer-s5 bg-dark">
      {/* Services strip */}
      <div className="flat-spacing-4">
        <div className="container">
          <div className="row g-4">
            {SERVICES.map((s) => (
              <div className="col-12 col-sm-6 col-lg-3" key={s.title}>
                <div className="box-icon_V01 style-3">
                  <span className="icon text-white">
                    <i className={`icon ${s.icon}`}></i>
                  </span>
                  <div className="content">
                    <div className="h6 title text-white">{s.title}</div>
                    <p className="text cl-text-3">{s.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="position-relative">
        <div className="br-line fake-class top-0 bg-white_10"></div>
        <div className="container-full">
          <div className="footer-inner flat-spacing">

            <div className="col-left">
              <div className="footer-col-block type-white footer-wrap-start">
                <p className="footer-heading footer-heading-mobile text-white">SHUNMUGA STEEL TRADERS</p>
                <div className="tf-collapse-content">
                  <p className="cl-text-3 mb-4">24/7 Support Center:</p>
                  <a href="tel:+917200240007" className="text-white link h5 fw-medium mb-12" style={{ display: 'block', marginBottom: '12px' }}>
                    +91-7200240007
                  </a>
                  <p className="cl-text-3 mb-4">Chennai &amp; Erode, Tamil Nadu</p>
                  <a href="mailto:info@shunmugasteel.com" className="cl-text-3 link">
                    info@shunmugasteel.com
                  </a>
                </div>
              </div>
            </div>

            <div className="br-line type-vertical"></div>

            <div className="col-center">
              <div className="footer-link-list">
                <div className="footer-col-block type-white footer-wrap-2">
                  <p className="footer-heading footer-heading-mobile text-white">QUICK LINKS</p>
                  <div className="tf-collapse-content">
                    <ul className="footer-menu-list">
                      <li><Link to="/about" className="cl-text-3 link">About Us</Link></li>
                      <li><Link to="/brands" className="cl-text-3 link">Our Brands</Link></li>
                      <li><Link to="/contact" className="cl-text-3 link">Contact Us</Link></li>
                      <li><Link to="/my-quotes" className="cl-text-3 link">My Quotes</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="footer-col-block type-white footer-wrap-3">
                  <p className="footer-heading footer-heading-mobile text-white">STEEL PRODUCTS</p>
                  <div className="tf-collapse-content">
                    <ul className="footer-menu-list">
                      <li><Link to="/products/flat-products" className="cl-text-3 link">Flat Products</Link></li>
                      <li><Link to="/products/roofing-products" className="cl-text-3 link">Roofing Solutions</Link></li>
                      <li><Link to="/products/accessories" className="cl-text-3 link">Accessories</Link></li>
                      <li><Link to="/quote-basket" className="cl-text-3 link">Request Quote</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="footer-col-block type-white footer-wrap-4">
                  <p className="footer-heading footer-heading-mobile text-white">ACCOUNT</p>
                  <div className="tf-collapse-content">
                    <ul className="footer-menu-list">
                      <li><Link to="/login" className="cl-text-3 link">Login</Link></li>
                      <li><Link to="/register" className="cl-text-3 link">Register</Link></li>
                      <li><Link to="/my-quotes" className="cl-text-3 link">My Quotes</Link></li>
                      <li><Link to="/dashboard/profile" className="cl-text-3 link">My Profile</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="br-line type-vertical"></div>

            <div className="col-right">
              <div className="footer-col-block type-white footer-wrap-end">
                <p className="footer-heading footer-heading-mobile text-white">STAY UPDATED</p>
                <div className="tf-collapse-content">
                  <p className="footer-desc cl-text-3 mb-16">
                    Get updates on steel prices, new products, and bulk order offers.
                  </p>
                  {subscribed ? (
                    <p className="text-white">Thank you for subscribing!</p>
                  ) : (
                    <form className="form-sub mb-16" onSubmit={handleSubscribe}>
                      <fieldset>
                        <input
                          type="email"
                          placeholder="Enter your e-mail"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </fieldset>
                      <button type="submit" className="btn-action">
                        <i className="icon icon-ArrowUpRight"></i>
                      </button>
                    </form>
                  )}
                  <p className="text-remember cl-text-3">
                    Authorized dealer of SAIL · AMNS · JSW · Evonith
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <div className="container-full">
          <div className="inner-bottom">
            <p className="cl-text-3" style={{ fontSize: '13px' }}>
              Mon–Sat: 9AM–6PM &nbsp;|&nbsp; Chennai &amp; Erode
            </p>
            <p className="text-nocopy cl-text-3">
              &copy;{new Date().getFullYear()} Shunmuga Steel Traders. All Rights Reserved.
            </p>
            <ul className="tf-list" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <li>
                <span className="cl-text-3" style={{ fontSize: '12px' }}>BIS Certified</span>
              </li>
              <li>
                <span className="cl-text-3" style={{ fontSize: '12px' }}>·</span>
              </li>
              <li>
                <span className="cl-text-3" style={{ fontSize: '12px' }}>ISO Standards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
