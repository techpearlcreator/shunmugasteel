import api from './api'

export const quoteService = {
  createQuote: (data) => api.post('/quotes', data),
  getMyQuotes: () => api.get('/quotes'),
  getQuoteById: (id) => api.get(`/quotes/${id}`),
  downloadPDF: (id) => api.get(`/quotes/${id}/pdf`, { responseType: 'blob' }),
}
