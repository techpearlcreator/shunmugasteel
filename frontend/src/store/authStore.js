import { create } from 'zustand'

const parseStoredUser = () => {
  try {
    const stored = localStorage.getItem('sst_user')
    if (!stored || stored === 'undefined' || stored === 'null') return null
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem('sst_user')
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: parseStoredUser(),
  token: localStorage.getItem('sst_token') || null,
  isAuthenticated: !!localStorage.getItem('sst_token'),

  login: (user, token) => {
    localStorage.setItem('sst_token', token)
    localStorage.setItem('sst_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('sst_token')
    localStorage.removeItem('sst_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (user) => {
    localStorage.setItem('sst_user', JSON.stringify(user))
    set({ user })
  },
}))
