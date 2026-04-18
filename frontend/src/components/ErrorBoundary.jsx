import { Component } from 'react'
import { LOGO_PATH } from '../utils/cdn'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#F8F9FA' }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <img
              src={LOGO_PATH}
              alt="Shunmuga Steel"
              style={{ height: 36, margin: '0 auto 24px', display: 'block', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
              An unexpected error occurred. Please refresh the page or go back to home.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', background: '#E67E22', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Reload Page
              </button>
              <a
                href="/"
                style={{ padding: '10px 20px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
