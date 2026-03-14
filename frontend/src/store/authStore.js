import { create } from 'zustand'

const stored = localStorage.getItem('sst_user')

export const useAuthStore = create((set) => ({
  user: stored ? JSON.parse(stored) : null,
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
