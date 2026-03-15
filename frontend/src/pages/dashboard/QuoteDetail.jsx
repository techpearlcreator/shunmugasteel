import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { quoteService } from '../../services/quoteService'

const STATUS_STEPS = [
  { key: 'submitted',  label: 'Submitted',    desc: 'Your quote request has been received' },
  { key: 'reviewed',   label: 'Under Review', desc: 'Our team is reviewing your requirements' },
  { key: 'confirmed',  label: 'Confirmed',    desc: 'Pricing confirmed — our team will contact you' },
  { key: 'dispatched', label: 'Dispatched',   desc: 'Material dispatched to delivery address' },
]

const STATUS_ORDER = ['submitted', 'reviewed', 'confirmed', 'dispatched']

const FALLBACK_QUOTE = {
  id: 1,
  quote_number: 'SST-2024-002',
  status: 'confirmed',
  created_at: '2024-11-15T14:30:00Z',
  updated_at: '2024-11-16T10:00:00Z',
  subtotal: 75610,
  gst_amount: 13610,
  total: 89220,
  gst_rate: 18,
  notes: 'Prefer morning delivery. Site address is through narrow lane.',
  delivery_address: { name: 'Rajan K', phone: '+91-9876543210', address: '14/5 Anna Nagar East', city: 'Chennai', state: 'Tamil Nadu', pincode: '600102' },
  items: [
    { id: 1, product_name: 'HR Coils & Sheets', variant_name: '5mm × 1500mm', quantity: 1, unit: 'MT', unit_price: 59000, total_price: 59000, specs: '5mm × 1500mm', is_custom: false },
    { id: 2, product_name: 'CR Coils & Sheets', variant_name: '1.0mm × 1250mm', quantity: 0.25, unit: 'MT', unit_price: 72000, total_price: 18000, specs: '1.0mm × 1250mm', is_custom: false },
  ],
  timeline: [
    { status: 'submitted', timestamp: '2024-11-15T14:30:00Z', note: 'Quote request submitted via website.' },
    { status: 'reviewed',  timestamp: '2024-11-15T15:00:00Z', note: 'Assigned to sales team for review.' },
    { status: 'confirmed', timestamp: '2024-11-16T10:00:00Z', note: 'Pricing confirmed. Proceed to payment.' },
  ],
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusTimeline({ currentStatus, timeline }) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus)
  return (
    <div className="relative">
      {/* Horizontal steps */}
      <div className="flex items-start overflow-x-auto pb-4 gap-0">
        {STATUS_STEPS.map((step, i) => {
          const stepIdx = STATUS_ORDER.indexOf(step.key)
          const done = stepIdx <= currentIdx
          const active = step.key === currentStatus
          const timelineEntry = timeline?.find((t) => t.status === step.key)
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 min-w-[90px]">
              <div className="flex items-center w-full">
                {i > 0 && <div className={`flex-1 h-0.5 ${done ? '' : 'bg-gray-200'}`} style={done ? { background: '#E67E22' } : {}} />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 text-sm ${done ? 'text-white' : 'bg-white text-gray-400 border-gray-300'} ${active ? 'ring-2 ring-orange-300' : ''}`} style={done ? { background: '#E67E22', borderColor: '#E67E22' } : {}}>
                  {done ? '✓' : i + 1}
                </div>
                {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 ${done && stepIdx < currentIdx ? '' : 'bg-gray-200'}`} style={done && stepIdx < currentIdx ? { background: '#E67E22' } : {}} />}
              </div>
              <div className="mt-2 text-center px-1">
                <p className={`text-xs font-semibold ${done ? '' : 'text-gray-400'}`} style={done ? { color: '#E67E22' } : {}}>{step.label}</p>
                {timelineEntry && <p className="text-xs text-gray-400 mt-0.5">{new Date(timelineEntry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function QuoteDetail() {
  const { id } = useParams()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    quoteService.getQuoteById(id)
      .then((res) => {
        const d = res.data?.data || res.data
        if (d && d.id) setQuote(d)
        else setQuote(FALLBACK_QUOTE)
      })
      .catch(() => setQuote(FALLBACK_QUOTE))
      .finally(() => setLoading(false))
  }, [id])

  const handleDownloadPDF = async () => {
    try {
      const res = await quoteService.downloadPDF(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = 'quote-' + id + '.pdf'; a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      alert('PDF download failed. Please try again.')
    }
  }

  if (loading) return <div className="min-h-96 flex items-center justify-center text-gray-400 text-sm">Loading quote...</div>
  if (!quote) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-gray-700">Quote not found</h2>
      <Link to="/my-quotes" style={{ color: '#E67E22' }} className="mt-4 inline-block">Back to My Quotes</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <nav className="text-xs text-gray-400 mb-2">
            <Link to="/my-quotes" className="hover:text-orange-400">My Quotes</Link>
            <span className="mx-2">&#8250;</span>
            <span className="text-gray-600">{quote.quote_number || 'Quote #' + quote.id}</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">{quote.quote_number || 'Quote #' + quote.id}</h1>
          <p className="text-sm text-gray-500 mt-1">Submitted on {formatDate(quote.created_at)}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {['confirmed', 'dispatched'].includes(quote.status) && (
            <button onClick={handleDownloadPDF} className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400">
              &#8615; Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-5">Quote Status</h3>
        <StatusTimeline currentStatus={quote.status} timeline={quote.timeline} />
      </div>

      {/* Timeline log */}
      {quote.timeline?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Activity Log</h3>
          <div className="space-y-3">
            {[...quote.timeline].reverse().map((entry, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#E67E22' }} />
                <div>
                  <p className="text-sm text-gray-700">{entry.note}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Order Items</h3>
            <div className="space-y-4">
              {(quote.items || []).map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs text-gray-500 mt-0.5">Size: {item.variant_name}</p>}
                    {item.specs && (() => {
                      const specsStr = typeof item.specs === 'object'
                        ? Object.entries(item.specs).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')
                        : String(item.specs)
                      return specsStr && specsStr !== item.variant_name
                        ? <p className="text-xs text-gray-500">Specs: {specsStr}</p>
                        : null
                    })()}
                    <p className="text-xs text-gray-400 mt-1">Qty: {item.quantity} {item.unit}</p>
                    {item.is_custom && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Custom</span>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {item.is_custom ? (
                      <span className="text-xs text-blue-600">Pricing TBD</span>
                    ) : (
                      <div>
                        <p className="text-xs text-gray-400">{'\u20b9'}{Number(item.unit_price).toLocaleString('en-IN')}/MT</p>
                        <p className="font-semibold text-gray-800">{'\u20b9'}{Number(item.total_price).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {quote.delivery_address && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-700 mb-3">Delivery Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{quote.delivery_address.name}</p>
                <p>{quote.delivery_address.phone}</p>
                <p>{quote.delivery_address.address}</p>
                <p>{quote.delivery_address.city}, {quote.delivery_address.state} — {quote.delivery_address.pincode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h3 className="font-semibold text-gray-700 mb-4">Price Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{'\u20b9'}{Number(quote.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({quote.gst_rate || 18}%)</span>
                <span>+ {'\u20b9'}{Number(quote.gst_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-3 mt-2 flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(quote.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {quote.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Your Notes</p>
                <p className="text-sm text-gray-600 italic">{quote.notes}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
              <p>Need help? Call +91-7200240007</p>
              <p>Mon–Sat: 9AM–6PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
