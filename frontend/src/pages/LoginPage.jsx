import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { LOGO_PATH } from '../utils/cdn'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const from = location.state?.from?.pathname || '/my-quotes'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await authService.login(form)
      const { user, token } = res.data?.data || res.data
      login(user, token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4" style={{ background: '#F8F9FA' }}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src={LOGO_PATH}
              alt="Shunmuga Steel"
              className="h-10 mx-auto object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <h1 className="mt-3 text-xl font-bold text-gray-800">Sign in to your account</h1>
            <p className="text-sm text-gray-500 mt-1">Access your quotes and order history</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                placeholder="you@example.com" required autoComplete="email"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5" >
                <label className="block text-sm font-medium text-gray-700" style={{ marginTop: '25px' }}>Password</label>
                <Link to="/forgot-password" className="text-xs" style={{ color: '#E67E22' }}>Forgot password?</Link>
              </div>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                placeholder="Your password" required autoComplete="current-password"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
              style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#E67E22' }}>Create one</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Protected by SSL. Your data is secure.
        </p>
      </div>
    </div>
  )
}
