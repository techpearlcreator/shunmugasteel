import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { LOGO_PATH } from '../utils/cdn'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found.')
      return
    }
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Invalid or expired verification link.')
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F8F9FA', paddingTop: '110px', paddingBottom: '48px' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <img
            src={LOGO_PATH}
            alt="Shunmuga Steel"
            className="h-10 mx-auto object-contain mb-6"
            onError={(e) => { e.target.style.display = 'none' }}
          />

          {status === 'loading' && (
            <>
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F0FDF4' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Email verified!</h2>
              <p className="text-sm text-gray-500 mb-6">Your account is now active. You can sign in.</p>
              <Link
                to="/login"
                className="inline-block py-3 px-8 rounded-xl font-semibold text-white text-sm"
                style={{ background: '#E67E22' }}
              >
                Sign In
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF2F2' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Verification failed</h2>
              <p className="text-sm text-gray-500 mb-6">{message}</p>
              <Link to="/login" className="text-sm font-medium" style={{ color: '#E67E22' }}>Back to Sign In</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
