import api from './api'

export const productService = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  getFeaturedProducts: () => api.get('/products?featured=1'),
  searchProducts: (q) => api.get(`/products?search=${q}`),
  calculatePrice: (data) => api.post('/quotes/calculate', data),
}
