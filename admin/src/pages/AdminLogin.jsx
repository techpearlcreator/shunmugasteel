import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuthStore } from '../store/adminAuthStore'
import adminApi from '../services/adminApi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const login    = useAdminAuthStore((s) => s.login)
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await adminApi.post('/admin/auth/login', form)
      login(res.data.admin, res.data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
          {/* Top accent bar */}
          <div style={{ height: '5px', background: 'linear-gradient(90deg, #E67E22, #d35400)' }} />

          <div style={{ padding: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '14px', background: '#E67E22', marginBottom: '16px' }}>
                <span style={{ color: '#fff', fontSize: '24px', fontWeight: 900 }}>S</span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937', margin: 0 }}>Shunmuga Steel</h1>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 600 }}>Admin Portal</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Admin Email
                </label>
                <input
                  type="email" placeholder="admin@shunmugasteel.com" required autoComplete="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111' }}
                  onFocus={(e) => { e.target.style.borderColor = '#E67E22' }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} placeholder="••••••••" required autoComplete="current-password"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: '10px', padding: '12px 48px 12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#111' }}
                    onFocus={(e) => { e.target.style.borderColor = '#E67E22' }}
                    onBlur={(e) => { e.target.style.borderColor = '#d1d5db' }}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280', lineHeight: 1 }}
                    title={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? (
                      /* Eye-off icon */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      /* Eye icon */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#DC2626' }}>
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: 700, color: '#fff', fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, background: '#E67E22', transition: 'background 0.2s' }}
                onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = '#d35400' }}
                onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = '#E67E22' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '16px', color: 'rgba(255,255,255,0.3)' }}>
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
