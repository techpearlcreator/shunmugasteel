import api from './api'

export const paymentService = {
  createOrder: (quoteId) => api.post('/payment/create-order', { quote_id: quoteId }),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getPaymentByQuote: (quoteId) => api.get(`/payment/quote/${quoteId}`),
}
