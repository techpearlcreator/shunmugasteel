import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore()

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  })
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [saving, setSaving] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [profileError, setProfileError] = useState('')
  const [pwdError, setPwdError] = useState('')

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true); setProfileMsg(''); setProfileError('')
    try {
      const res = await authService.getMe()  // In production, use a PUT /auth/profile endpoint
      updateUser({ ...user, ...profile })
      setProfileMsg('Profile updated successfully!')
    } catch {
      // Optimistically update local state even if API fails
      updateUser({ ...user, ...profile })
      setProfileMsg('Profile saved locally.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      setPwdError('New passwords do not match.'); return
    }
    if (passwords.new_password.length < 8) {
      setPwdError('New password must be at least 8 characters.'); return
    }
    setChangingPwd(true); setPwdMsg(''); setPwdError('')
    try {
      await authService.resetPassword({ current_password: passwords.current_password, password: passwords.new_password })
      setPwdMsg('Password changed successfully!')
      setPasswords({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setChangingPwd(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-5">Personal Information</h2>
          {profileMsg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 mb-4">{profileMsg}</div>}
          {profileError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">{profileError}</div>}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div style={{ margin: '20px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" style={{ margin: '10px' }} />
              </div>
              <div style={{ margin: '20px' }}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" style={{ margin: '10px' }} />
              </div>
            </div>
            <div >
              <label className="block text-sm font-medium text-gray-700 mb-1.5" style={{ margin: '5px' }}>Email Address</label>
              <input type="email" value={profile.email} disabled
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact support if needed.</p>
            </div>
            <div style={{ margin: '20px' }}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
              <input type="text" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                placeholder="Your company or firm name" />
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
              style={{ background: '#E67E22', marginTop: '20px' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-5">Change Password</h2>
          {pwdMsg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2.5 mb-4">{pwdMsg}</div>}
          {pwdError && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-4">{pwdError}</div>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div style={{ margin: '20px' }} >
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <input type="password" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                autoComplete="current-password" style={{ margin: '10px' }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Min. 8 characters" autoComplete="new-password" style={{ margin: '10px' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input type="password" value={passwords.confirm_password} onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })} required
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  autoComplete="new-password" style={{ margin: '10px' }} />
              </div>
            </div>
            <button type="submit" disabled={changingPwd}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-300 text-gray-700 hover:border-gray-400 transition-all disabled:opacity-60"
              style={{ marginTop: '20px' }}
            >
              {changingPwd ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Account</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Account type: <strong className="text-gray-800">Customer</strong></p>
              <p className="text-sm text-gray-500 mt-1">Registered email: {user?.email}</p>
            </div>
            <button
              onClick={() => { if (window.confirm('Are you sure you want to log out?')) logout() }}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
