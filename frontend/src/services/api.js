import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/shunmugasteel/backend'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sst_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('sst_token')
      localStorage.removeItem('sst_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
