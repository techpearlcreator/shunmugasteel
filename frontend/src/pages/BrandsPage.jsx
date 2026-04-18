import { Link } from 'react-router-dom'
import { cdnImg, BRAND_LOGOS } from '../utils/cdn'

const BRANDS = [
  {
    key: 'SAIL',
    name: 'SAIL',
    full: 'Steel Authority of India Ltd.',
    founded: '1973',
    hq: 'New Delhi, India',
    description: 'SAIL is one of the largest state-owned steel making companies in India and one of the Maharatna companies of the Government of India. SAIL produces iron and steel at five integrated plants and three special steel plants located principally in the eastern and central regions of India. As a leading steel producer, SAIL manufactures a comprehensive range of steel products including hot rolled, cold rolled, galvanized and electrical grade steels.',
    paddingtop: '10px',
    paddingbottom: '10px',
    products: ['HR Coils & Sheets', 'CR Coils & Sheets', 'GP/GC Sheets', 'Electrical Steel'],
    color: '#1a56db',
    certifications: ['BIS Certified', 'ISO 9001:2015', 'ISO 14001'],
  },
  {
    key: 'AMNS',
    name: 'AMNS India',
    full: 'ArcelorMittal Nippon Steel India',
    founded: '2020',
    hq: 'Hazira, Gujarat, India',
    description: 'ArcelorMittal Nippon Steel India (AM/NS India) is a joint venture between ArcelorMittal and Nippon Steel. The company operates the Hazira integrated steel plant, one of the most modern facilities in India. AMNS India produces a wide range of flat steel products with world-class quality standards, serving automotive, construction, appliance and energy sectors across India.',
    products: ['CR Coils (Auto Grade)', 'PPGL Colour Coils', 'Hot-Dip Galvanized', 'Galvalume'],
    color: '#c00000',
    certifications: ['BIS Certified', 'IATF 16949', 'ISO 9001:2015'],
  },
  {
    key: 'JSW',
    name: 'JSW Steel',
    full: 'JSW Steel Ltd.',
    founded: '1982',
    hq: 'Mumbai, Maharashtra, India',
    description: "JSW Steel is India's leading integrated steel manufacturer with a capacity of 28 MTPA. It is part of the JSW Group, one of India's fastest growing conglomerates. JSW Steel produces a wide range of flat and long steel products from its state-of-the-art plants across India. Their Colour Coated and Galvalume products are market leaders in roofing and construction applications.",
    products: ['HR Coils', 'GP/Galvalume Sheets', 'PPGI Colour Coils', 'PUF Panels'],
    color: '#003087',
    certifications: ['BIS Certified', 'ISO 9001:2015', 'Green Pro Certified'],
  },
  {
    key: 'Evonith',
    name: 'Evonith',
    full: 'Evonith Steel',
    founded: '2012',
    hq: 'Kolkata, West Bengal, India',
    description: 'Evonith is a modern integrated steel plant focused on producing high-quality flat steel products including hot rolled coils and cold rolled sheets. The plant is equipped with state-of-the-art technology to produce steel that meets stringent quality standards. Evonith products are particularly popular for structural and construction applications in eastern and southern India.',
    products: ['HR Coils', 'CR Coils', 'Decking Sheets', 'Structural Steel'],
    color: '#059669',
    certifications: ['BIS Certified', 'ISO 9001:2015'],
  },
]

export default function BrandsPage() {
  return (
    <div>
      {/* Header banner */}
      <div className="relative py-10 md:py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E67E22 0, #E67E22 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Our Brand Partners</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Shunmuga Steel is an authorized dealer for India's leading steel manufacturers.
            Every product we supply is genuine, BIS certified and backed by manufacturer warranty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {BRANDS.map((brand, i) => (
          <div key={brand.key}>
            <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 lg:gap-12 items-start py-8 sm:py-12 md:py-16`}>
              {/* Logo card */}
              <div className="w-full lg:w-72 flex-shrink-0" style={{ margin: '20px' }}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm lg:sticky lg:top-4">
                  <img
                    src={cdnImg(BRAND_LOGOS[brand.key])}
                    alt={brand.name}
                    className="h-20 object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <h2 className="mt-4 text-xl font-bold text-gray-800">{brand.name}</h2>
                  <p className="text-sm text-gray-500">{brand.full}</p>
                  <div className="mt-4 space-y-1 text-xs text-gray-400">
                    <p>Founded: {brand.founded}</p>
                    <p>HQ: {brand.hq}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                    {brand.certifications.map((cert) => (
                      <span key={cert} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">{cert}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1" >
                <div className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3" style={{ background: brand.color + '15', color: brand.color, }}>
                  Authorized Dealer
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3" style={{ marginTop: '10px' }}>{brand.full}</h3>
                <p className="text-gray-600 leading-relaxed mb-5" style={{ paddingtop: '10px', paddingbottom: '10px', marginTop: '10px' }}>{brand.description}</p>

                <h4 className="font-semibold text-gray-700 mb-3" style={{ marginTop: '20px' }}>Products Available from {brand.name}</h4>
                <div className="flex flex-wrap gap-2 mb-5" style={{ marginLeft: '10px' }}>
                  {brand.products.map((p) => (
                    <span key={p} className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg" style={{ marginLeft: '20px', marginTop: '10px' }}>{p}</span>
                  ))}
                </div>

                <Link
                  to="/products/flat-products"
                  className="inline-block text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all"
                  style={{ background: '#E67E22', marginTop: '20px' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
                >
                  Browse {brand.name} Products &rarr;
                </Link>
              </div>
            </div>
            {i < BRANDS.length - 1 && <hr className="border-gray-100" />}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="py-10 md:py-16" style={{ background: '#F8F9FA' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Need a specific brand or grade?</h2>
          <p className="mt-3 text-gray-500">Our team can source any grade from SAIL, AMNS India, JSW Steel or Evonith. Contact us for custom requirements.</p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link to="/contact" className="inline-block px-6 py-3 rounded-lg font-semibold text-white" style={{ background: '#E67E22' }}>Contact Our Team</Link>
            <Link to="/quote-basket" className="inline-block px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:border-gray-400">Get a Quote</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
