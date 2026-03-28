import { Link } from 'react-router-dom'
import { cdnImg, BRAND_LOGOS } from '../utils/cdn'

const MILESTONES = [
  { year: '1976', title: 'Founded', desc: 'Shunmuga Steel Traders established in Tamil Nadu as a small steel trading firm.' },
  { year: '1985', title: 'SAIL Partnership', desc: 'Became an authorized dealer for SAIL, giving access to premium government steel products.' },
  { year: '1998', title: 'Expanded to Roofing', desc: 'Expanded product portfolio to include roofing and building material solutions.' },
  { year: '2005', title: 'Multi-Brand Dealership', desc: 'Added JSW Steel and Evonith to our brand portfolio, offering wider choice to customers.' },
  { year: '2015', title: 'AMNS India Partnership', desc: 'Became authorized dealer for ArcelorMittal Nippon Steel India (then Essar Steel).' },
  { year: '2024', title: 'Digital Transformation', desc: 'Launched online ordering portal with real-time pricing and quote management system.' },
]

const VALUES = [
  { icon: '🏆', title: 'Quality First', desc: 'We stock only BIS certified products from manufacturer authorized sources. No seconds, no substitutes.' },
  { icon: '🤝', title: 'Customer Trust', desc: '1000+ customers rely on us for critical steel requirements. We treat every order with the same care.' },
  { icon: '💡', title: 'Expert Guidance', desc: 'Our team of steel experts helps you select the right grade, thickness and coating for your application.' },
  { icon: '⚡', title: 'Fast Response', desc: 'Quote within 2 hours. Delivery within 3–7 business days anywhere in Tamil Nadu.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative py-12 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E67E22 0, #E67E22 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-block bg-orange-500 bg-opacity-20 border border-orange-500 border-opacity-30 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white text-sm font-medium">Est. 1976 — Tamil Nadu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            48 Years of Steel Excellence
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            From a small trading firm in Tamil Nadu to the state&apos;s most trusted steel supplier.
            We&apos;ve built our reputation one delivery at a time.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-5">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Shunmuga Steel Traders was founded in 1976 with a simple mission: to provide Tamil Nadu&apos;s
                  construction and manufacturing industries with reliable, quality-assured steel products at
                  fair prices.
                </p>
                <p>
                  Starting as a small steel trading firm, we grew steadily by focusing on customer relationships
                  and product quality. Our authorized dealerships with India&apos;s leading steel manufacturers —
                  SAIL, AMNS India, JSW Steel and Evonith — ensure that every product we supply is genuine,
                  certified and backed by manufacturer support.
                </p>
                <p>
                  Today, we serve over 1000 customers across Tamil Nadu, from individual builders and contractors
                  to large industrial manufacturers. Our product range covers flat products, roofing solutions
                  and construction accessories — everything you need to build with confidence.
                </p>
              </div>
              <div className="mt-8 flex gap-4 flex-wrap">
                <Link to="/products/flat-products" className="inline-block px-6 py-3 rounded-lg font-semibold text-white text-sm" style={{ background: '#E67E22' }}>Browse Products</Link>
                <Link to="/contact" className="inline-block px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:border-gray-400 text-sm">Get in Touch</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden h-40 bg-gray-100">
                <img src={cdnImg('hot-rolled-coils-sheets-bannerb1f5.jpg')} alt="Steel products" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div className="rounded-xl overflow-hidden h-40 bg-gray-100 mt-6">
                <img src={cdnImg('galvanized-steel-sheets47fe.jpg')} alt="GP sheets" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div className="rounded-xl overflow-hidden h-40 bg-gray-100">
                <img src={cdnImg('Color-Coated-Coilsb58b.jpg')} alt="Colour coils" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
              <div className="rounded-xl overflow-hidden h-40 bg-gray-100 mt-6">
                <img src={cdnImg('decking-sheets-17e37.jpg')} alt="Decking" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">What We Stand For</h2>
            <p className="mt-2 text-gray-500">The principles that guide every transaction</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Journey</h2>
            <p className="mt-2 text-gray-500">Key milestones in 48 years of steel trading</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`relative flex flex-col md:flex-row gap-6 items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-1/2 flex flex-col items-start md:items-end">
                    {i % 2 === 0 ? (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm md:mr-8 w-full">
                        <div className="text-lg font-bold mb-1 md:hidden" style={{ color: '#E67E22' }}>{m.year}</div>
                        <h3 className="font-bold text-gray-800">{m.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                      </div>
                    ) : (
                      <div className="hidden md:flex justify-end w-full pr-8">
                        <div className="text-2xl font-bold" style={{ color: '#E67E22' }}>{m.year}</div>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-1/2 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow hidden md:block" style={{ background: '#E67E22' }} />
                  <div className="md:w-1/2">
                    {i % 2 === 0 ? (
                      <div className="hidden md:flex pl-8">
                        <div className="text-2xl font-bold" style={{ color: '#E67E22' }}>{m.year}</div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm md:ml-8 w-full">
                        <div className="text-lg font-bold mb-1 md:hidden" style={{ color: '#E67E22' }}>{m.year}</div>
                        <h3 className="font-bold text-gray-800">{m.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners */}
      <section className="py-16" style={{ background: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Our Authorized Brand Partners</h2>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-12 items-center">
            {Object.entries(BRAND_LOGOS).map(([key, file]) => (
              <img key={key} src={cdnImg(file)} alt={key} className="h-12 object-contain grayscale hover:grayscale-0 transition-all" onError={(e) => { e.target.style.display = 'none' }} />
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            All products are sourced directly from manufacturers — 100% genuine and BIS certified.
          </p>
        </div>
      </section>
    </div>
  )
}
