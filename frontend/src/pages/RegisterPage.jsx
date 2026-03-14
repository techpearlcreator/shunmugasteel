import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { LOGO_PATH } from '../utils/cdn'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true); setError('')
    try {
      await authService.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        company_name: form.company,
        password: form.password,
      })
      setRegistered(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4" style={{ background: '#F8F9FA' }}>
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={LOGO_PATH}
              alt="Shunmuga Steel"
              className="h-10 mx-auto object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <h1 className="mt-3 text-xl font-bold text-gray-800">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Get instant quotes and track your orders</p>
          </div>

          {registered ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF3E7' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#E67E22" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Account created!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Please check your email to verify your account before signing in.
              </p>
              <Link
                to="/login"
                className="inline-block py-3 px-8 rounded-xl font-semibold text-white text-sm"
                style={{ background: '#E67E22' }}
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                placeholder="you@company.com" autoComplete="email" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name (optional)</label>
              <input type="text" name="company" value={form.company} onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Your company or firm name" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Min. 8 characters" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password *</label>
                <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Repeat password" autoComplete="new-password" />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 mt-2"
              style={{ background: '#E67E22' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#E67E22' }}>Sign in</Link>
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
