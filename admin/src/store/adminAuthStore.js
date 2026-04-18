import { create } from 'zustand'

let storedAdmin = null
try {
  const raw = localStorage.getItem('sst_admin')
  if (raw && raw !== 'undefined') storedAdmin = JSON.parse(raw)
} catch {
  localStorage.removeItem('sst_admin')
}

export const useAdminAuthStore = create((set) => ({
  admin: storedAdmin,
  token: localStorage.getItem('sst_admin_token') || null,
  isAuthenticated: !!localStorage.getItem('sst_admin_token'),

  login: (admin, token) => {
    localStorage.setItem('sst_admin_token', token)
    localStorage.setItem('sst_admin', JSON.stringify(admin))
    set({ admin, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('sst_admin_token')
    localStorage.removeItem('sst_admin')
    set({ admin: null, token: null, isAuthenticated: false })
  },
}))
