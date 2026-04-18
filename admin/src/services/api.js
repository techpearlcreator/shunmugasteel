import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/shunmugasteel/backend'

const adminApi = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('sst_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('sst_admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default adminApi
