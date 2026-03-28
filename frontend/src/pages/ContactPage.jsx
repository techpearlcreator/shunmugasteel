import { useState } from 'react'
import { Link } from 'react-router-dom'

const OFFICES = [
  {
    city: 'Chennai',
    address: 'Shunmuga Steel Traders, Perambur, Chennai — 600 011, Tamil Nadu',
    phone: '+91-7200240007',
    email: 'sales@shunmugasteel.com',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
    mapQuery: 'Perambur+Chennai+Tamil+Nadu',
  },
  {
    city: 'Erode',
    address: 'Shunmuga Steel Traders, Erode Main Road, Erode — 638 001, Tamil Nadu',
    phone: '+91-7200240008',
    email: 'erode@shunmugasteel.com',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
    mapQuery: 'Erode+Tamil+Nadu',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission — in production, wire to backend /contact endpoint
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div>
      {/* Header */}
      <div className="relative py-10 md:py-16" style={{ background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300">We respond within 2 hours on working days. Bulk enquiries always welcome.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Contact info */}
          <div className="space-y-8">
            {OFFICES.map((office) => (
              <div key={office.city} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 text-lg mb-4">{office.city} Office</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">&#128205;</span>
                    <span className="text-gray-600">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">&#128222;</span>
                    <a href={'tel:' + office.phone} className="font-medium" style={{ color: '#E67E22' }}>{office.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">&#9993;</span>
                    <a href={'mailto:' + office.email} className="font-medium" style={{ color: '#E67E22' }}>{office.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">&#128336;</span>
                    <span className="text-gray-600">{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick links */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/products/flat-products" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#E67E22' }}>
                  &#8594; Browse Flat Products
                </Link>
                <Link to="/products/roofing-products" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#E67E22' }}>
                  &#8594; Roofing Solutions
                </Link>
                <Link to="/register" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#E67E22' }}>
                  &#8594; Register for Quick Quotes
                </Link>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">&#10004;</div>
                  <h3 className="text-xl font-bold text-gray-800">Message Received!</h3>
                  <p className="text-gray-500 mt-2">Our team will get back to you within 2 hours on working days.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }} className="mt-6 text-sm font-medium" style={{ color: '#E67E22' }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                        placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                        placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                      placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                    <select name="subject" value={form.subject} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                      <option value="">Select a topic...</option>
                      <option value="quote">Request a Quote</option>
                      <option value="product">Product Enquiry</option>
                      <option value="order">Order Status</option>
                      <option value="payment">Payment / Invoice</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
                      placeholder="Tell us about your steel requirements, dimensions, quantity, and any other details..." />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
                    style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12">
          <h3 className="font-semibold text-gray-700 mb-4">Find Us</h3>
          <div className="rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">&#128205;</div>
              <p className="text-sm">Chennai &amp; Erode, Tamil Nadu, India</p>
              <a href="https://maps.google.com/?q=Perambur+Chennai+Tamil+Nadu" target="_blank" rel="noopener noreferrer" className="text-sm mt-2 inline-block font-medium" style={{ color: '#E67E22' }}>
                Open in Google Maps &#8599;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
