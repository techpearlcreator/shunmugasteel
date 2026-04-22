import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { LOGO_PATH } from '../utils/cdn'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true); setError('')
    try {
      await authService.resetPassword({ token, password: form.password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link. Please request a new one.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA', paddingTop: '110px', paddingBottom: '48px' }}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Invalid reset link.</p>
          <Link to="/forgot-password" className="text-sm font-medium" style={{ color: '#E67E22' }}>Request a new one</Link>
        </div>
      </div>
    )
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
            <h1 className="mt-3 text-xl font-bold text-gray-800">Set new password</h1>
            <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account</p>
          </div>

          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Password updated!</h2>
              <p className="text-sm text-gray-500 mb-4">Redirecting you to sign in...</p>
              <Link to="/login" className="text-sm font-medium" style={{ color: '#E67E22' }}>Sign in now</Link>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="Repeat password"
                    autoComplete="new-password"
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
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
