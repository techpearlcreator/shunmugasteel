import { Link } from 'react-router-dom'
import { LOGO_PATH } from '../utils/cdn'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA', paddingTop: '110px', paddingBottom: '48px' }}>
      <div className="text-center max-w-md">
        <img
          src={LOGO_PATH}
          alt="Shunmuga Steel"
          className="h-10 mx-auto object-contain mb-8"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="text-8xl font-black mb-4" style={{ color: '#E67E22', opacity: 0.15, lineHeight: 1 }}>404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-block py-3 px-6 rounded-xl font-semibold text-white text-sm"
            style={{ background: '#E67E22' }}
          >
            Back to Home
          </Link>
          <Link
            to="/products/flat-products"
            className="inline-block py-3 px-6 rounded-xl font-semibold text-sm border border-gray-300 text-gray-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}
