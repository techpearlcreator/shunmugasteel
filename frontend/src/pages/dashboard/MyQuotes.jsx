import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { quoteService } from '../../services/quoteService'
import { useAuthStore } from '../../store/authStore'

const STATUS_CONFIG = {
  submitted:       { label: 'Submitted',        color: 'bg-yellow-100 text-yellow-800' },
  reviewed:        { label: 'Under Review',      color: 'bg-blue-100 text-blue-800' },
  confirmed:       { label: 'Quote Confirmed',   color: 'bg-purple-100 text-purple-800' },
  payment_pending: { label: 'Payment Pending',   color: 'bg-orange-100 text-orange-800' },
  paid:            { label: 'Paid',              color: 'bg-green-100 text-green-800' },
  dispatched:      { label: 'Dispatched',        color: 'bg-teal-100 text-teal-800' },
  cancelled:       { label: 'Cancelled',         color: 'bg-red-100 text-red-800' },
}

const FALLBACK_QUOTES = [
  { id: 1, quote_number: 'SST-2024-001', status: 'delivered', created_at: '2024-11-01T10:00:00Z', total: 145600, gst_amount: 22152, items_count: 3, delivery_city: 'Chennai' },
  { id: 2, quote_number: 'SST-2024-002', status: 'quoted', created_at: '2024-11-15T14:30:00Z', total: 89200, gst_amount: 13574, items_count: 2, delivery_city: 'Erode' },
  { id: 3, quote_number: 'SST-2024-003', status: 'pending', created_at: '2024-12-01T09:00:00Z', total: 0, gst_amount: 0, items_count: 1, delivery_city: 'Chennai' },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyQuotes() {
  const { user } = useAuthStore()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quoteService.getMyQuotes()
      .then((res) => {
        const data = res.data?.data || res.data
        if (Array.isArray(data) && data.length >= 0) setQuotes(data)
        else setQuotes(FALLBACK_QUOTES)
      })
      .catch(() => setQuotes(FALLBACK_QUOTES))
      .finally(() => setLoading(false))
  }, [])

  const handleDownloadPDF = async (quoteId, e) => {
    e.preventDefault()
    try {
      const res = await quoteService.downloadPDF(quoteId)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = 'quote-' + quoteId + '.pdf'; a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('PDF download failed. Please try again.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Quotes</h1>
          <p className="text-sm text-gray-500 mt-1">Hello, {user?.name || 'Customer'} — here are all your quote requests</p>
        </div>
        <Link to="/products/flat-products" className="text-sm font-semibold px-4 py-2 rounded-lg text-white" style={{ background: '#E67E22' }}>
          + New Quote
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">Loading your quotes...</div>
      ) : quotes.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">&#128203;</div>
          <h3 className="text-lg font-semibold text-gray-700">No quotes yet</h3>
          <p className="text-gray-500 mt-2 text-sm">Browse our products and add items to your quote basket to get started.</p>
          <Link to="/products/flat-products" className="mt-6 inline-block px-6 py-3 rounded-lg font-semibold text-white text-sm" style={{ background: '#E67E22' }}>Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => {
            const st = STATUS_CONFIG[quote.status] || { label: quote.status, color: 'bg-gray-100 text-gray-600' }
            return (
              <div key={quote.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{quote.quote_number || 'Quote #' + quote.id}</h3>
                      <span className={'text-xs font-medium px-2.5 py-1 rounded-full ' + st.color}>{st.label}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>&#128197; {formatDate(quote.created_at)}</span>
                      <span>&#128230; {quote.items_count || 1} item{quote.items_count !== 1 ? 's' : ''}</span>
                      {quote.delivery_city && <span>&#128205; {quote.delivery_city}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    {quote.total > 0 ? (
                      <div>
                        <p className="text-xs text-gray-400">Total (incl. GST)</p>
                        <p className="text-lg font-bold" style={{ color: '#E67E22' }}>{'\u20b9'}{Number(quote.total).toLocaleString('en-IN')}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-blue-600 font-medium">Awaiting pricing</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 flex-wrap pt-4 border-t border-gray-100">
                  <Link to={'/my-quotes/' + quote.id} className="text-sm font-medium" style={{ color: '#E67E22' }}>View Details &rarr;</Link>
                  {quote.status === 'confirmed' && (
                    <Link to={'/my-quotes/' + quote.id} className="text-sm font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: '#E67E22' }}>Pay Now</Link>
                  )}
                  {['confirmed', 'paid', 'dispatched'].includes(quote.status) && (
                    <button onClick={(e) => handleDownloadPDF(quote.id, e)} className="text-sm text-gray-500 hover:text-gray-700">&#8615; Download PDF</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
