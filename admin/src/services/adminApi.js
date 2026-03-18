import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost/shunmugasteel/backend'

const adminApi = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

adminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('sst_admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if ([401, 403].includes(err.response?.status)) {
      localStorage.removeItem('sst_admin_token')
      localStorage.removeItem('sst_admin')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──────────────────────────────────
export const adminLogin = (data) => adminApi.post('/admin/auth/login', data)

// ── DASHBOARD ─────────────────────────────
export const getDashboard = () => adminApi.get('/admin/dashboard')

// ── CATEGORIES ────────────────────────────
export const getCategories   = () => adminApi.get('/admin/categories')
export const createCategory  = (data) => adminApi.post('/admin/categories', data)
export const updateCategory  = (id, data) => adminApi.put(`/admin/categories/${id}`, data)
export const deleteCategory  = (id) => adminApi.delete(`/admin/categories/${id}`)

// ── PRODUCTS ──────────────────────────────
export const getProducts     = () => adminApi.get('/admin/products')
export const getProduct      = (id) => adminApi.get(`/admin/products/${id}`)
export const createProduct   = (data) => adminApi.post('/admin/products', data)
export const updateProduct   = (id, data) => adminApi.put(`/admin/products/${id}`, data)
export const deleteProduct   = (id) => adminApi.delete(`/admin/products/${id}`)

// ── PRODUCT IMAGES ─────────────────────────
export const getProductImages   = (id) => adminApi.get(`/admin/products/${id}/images`)
export const uploadProductImage = (id, file) => {
  const fd = new FormData()
  fd.append('image', file)
  return adminApi.post(`/admin/products/${id}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const setPrimaryImage  = (productId, imageId) => adminApi.put(`/admin/products/${productId}/images/${imageId}`)
export const deleteProductImage = (productId, imageId) => adminApi.delete(`/admin/products/${productId}/images/${imageId}`)

// ── PRODUCT VIDEOS ─────────────────────────
export const getProductVideos   = (id) => adminApi.get(`/admin/products/${id}/videos`)
export const uploadProductVideo = (id, file, title = '') => {
  const fd = new FormData()
  fd.append('video', file)
  if (title) fd.append('title', title)
  return adminApi.post(`/admin/products/${id}/videos`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const deleteProductVideo = (productId, videoId) => adminApi.delete(`/admin/products/${productId}/videos/${videoId}`)

// ── CATEGORY IMAGE ────────────────────────
export const uploadCategoryImage = (id, file) => {
  const fd = new FormData()
  fd.append('image', file)
  return adminApi.post(`/admin/categories/${id}/image`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

// ── QUOTES ────────────────────────────────
export const getQuotes       = (status) => adminApi.get('/admin/quotes', { params: { status } })
export const getQuote        = (id) => adminApi.get(`/admin/quotes/${id}`)
export const updateQuoteStatus = (id, data) => adminApi.patch(`/admin/quotes/${id}`, data)

// ── CUSTOMERS ─────────────────────────────
export const getCustomers    = () => adminApi.get('/admin/customers')
export const getCustomer     = (id) => adminApi.get(`/admin/customers/${id}`)

// ── SETTINGS ──────────────────────────────
export const getSettings     = (group) => adminApi.get('/admin/settings', { params: { group } })
export const saveSettings    = (data) => adminApi.put('/admin/settings', data)

export default adminApi
