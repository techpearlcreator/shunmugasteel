import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuoteStore } from '../store/quoteStore'
import { useAuthStore } from '../store/authStore'
import { quoteService } from '../services/quoteService'

const GST_RATE = 18

export default function QuoteBasketPage() {
  const navigate = useNavigate()
  const { items, subtotal, gstAmount, total, removeItem, updateItem, clearBasket } = useQuoteStore()
  const { user, isAuthenticated } = useAuthStore()

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  })
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleQtyChange = (index, newQty) => {
    const item = items[index]
    const qty = Math.max(1, parseInt(newQty) || 1)
    const total_price = item.unit_price * qty
    updateItem(index, { ...item, quantity: qty, total_price })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/quote-basket' } } })
      return
    }
    if (items.length === 0) { setError('Your quote basket is empty.'); return }
    if (!deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
      setError('Please fill in the required delivery address fields.')
      return
    }
    setSubmitting(true); setError('')
    try {
      const payload = {
        items: items.map((item) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id || null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          specs: item.specs,
          is_custom: item.is_custom,
        })),
        delivery_address: deliveryAddress,
        notes,
      }
      const res = await quoteService.createQuote(payload)
      const quoteId = res.data?.data?.quote_id || res.data?.quote_id
      clearBasket()
      navigate(quoteId ? '/my-quotes/' + quoteId : '/my-quotes')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quote. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">&#128203;</div>
        <h2 className="text-2xl font-bold text-gray-700">Your Quote Basket is Empty</h2>
        <p className="mt-3 text-gray-500">Browse our products and add items to get a quote from our team.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/products/flat-products" className="inline-block px-6 py-3 rounded-lg font-semibold text-white" style={{ background: '#E67E22' }}>Browse Flat Products</Link>
          <Link to="/products/roofing-products" className="inline-block px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:border-gray-400">Roofing Solutions</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Quote Basket</h1>
      <p className="text-sm text-gray-500 mb-8">{items.length} item{items.length !== 1 ? 's' : ''} ready for quote</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {item.image && (
                    <img src={item.image} alt={item.product?.name} onError={(e) => { e.target.style.display = 'none' }}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0" style={{ border: '1px solid #f0f0f0' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
                      {item.is_custom && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Custom</span>}
                    </div>
                    {item.variant?.name && <p className="text-xs text-gray-500 mt-1">Size: {item.variant.name}</p>}
                    {item.specs && <p className="text-xs text-gray-500 mt-0.5">Specs: {item.specs}</p>}
                  </div>
                </div>
                <button onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 text-sm">&#10005; Remove</button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Qty:</span>
                  {item.is_custom ? (
                    <span className="text-sm font-medium text-gray-700">{item.quantity} {item.unit}</span>
                  ) : (
                    <input
                      type="number" min="1" value={item.quantity}
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-orange-400"
                    />
                  )}
                  <span className="text-xs text-gray-400">{item.unit}</span>
                </div>
                <div className="text-right">
                  {item.is_custom ? (
                    <span className="text-sm text-blue-600 font-medium">Price to be confirmed</span>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-400">{'\u20b9'}{Number(item.unit_price).toLocaleString('en-IN')}/MT × {item.quantity}</p>
                      <p className="text-base font-bold" style={{ color: '#E67E22' }}>{'\u20b9'}{Number(item.total_price).toLocaleString('en-IN')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button onClick={clearBasket} className="text-sm text-red-500 hover:text-red-700 mt-2">Clear all items</button>

          {/* Delivery Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Delivery Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Full Name *</label>
                <input type="text" value={deliveryAddress.name} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="Your name" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phone Number *</label>
                <input type="tel" value={deliveryAddress.phone} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Email Address *</label>
                <input type="email" value={deliveryAddress.email} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="you@example.com" required />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Street Address *</label>
                <input type="text" value={deliveryAddress.address} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="Door no, Street, Area" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">City *</label>
                <input type="text" value={deliveryAddress.city} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="Chennai" required />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Pincode *</label>
                <input type="text" value={deliveryAddress.pincode} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" placeholder="600001" required maxLength={6} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">State</label>
                <input type="text" value={deliveryAddress.state} onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs text-gray-500 block mb-1">Additional Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" placeholder="Special requirements, site conditions, preferred delivery schedule..." />
            </div>
          </div>
        </div>

        {/* Price summary & submit */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Quote Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items ({items.length})</span>
                <span>{'\u20b9'}{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({GST_RATE}%)</span>
                <span>+ {'\u20b9'}{Number(gstAmount).toLocaleString('en-IN')}</span>
              </div>
              {items.some((i) => i.is_custom) && (
                <div className="text-xs text-blue-600 bg-blue-50 rounded p-2 mt-2">
                  Custom items: pricing will be confirmed by our team
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 mb-4">* Prices exclude transport charges. Delivery cost calculated separately.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
              onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
            >
              {submitting ? 'Submitting...' : isAuthenticated ? 'Submit Quote Request' : 'Login to Submit'}
            </button>
            {!isAuthenticated && (
              <p className="text-xs text-gray-400 mt-2 text-center">
                <Link to="/login" style={{ color: '#E67E22' }}>Sign in</Link> or <Link to="/register" style={{ color: '#E67E22' }}>create an account</Link> to submit
              </p>
            )}

            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>&#10004; Our team responds within 2 hours (working days)</p>
              <p>&#10004; GST invoice provided with every order</p>
              <p>&#10004; Price guaranteed for 48 hours after quote</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
