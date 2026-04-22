import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { LOGO_PATH } from '../utils/cdn'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA', paddingTop: '110px', paddingBottom: '48px' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <img
              src={LOGO_PATH}
              alt="Shunmuga Steel"
              className="h-10 mx-auto object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <h1 className="mt-3 text-xl font-bold text-gray-800">Forgot your password?</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send a reset link</p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3E7' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#E67E22" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500 mb-6">
                If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
              </p>
              <Link
                to="/login"
                className="text-sm font-medium"
                style={{ color: '#E67E22' }}
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
                  style={{ background: '#E67E22' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="font-medium" style={{ color: '#E67E22' }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
