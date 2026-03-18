import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import { useQuoteStore } from '../store/quoteStore'
import { cdnImg, PRODUCT_IMAGES } from '../utils/cdn'

const FALLBACK_PRODUCTS = {
  'hr-coils-sheets': {
    id: 1, name: 'HR Coils & Sheets', slug: 'hr-coils-sheets', product_type: 'standard', brand: 'SAIL',
    image_url: 'hot-rolled-coils-sheets-bannerb1f5.jpg', base_price: 58500, stock_status: 'in_stock',
    category_name: 'Flat Products', category_slug: 'flat-products',
    description: 'Hot Rolled Coils and Sheets are primary steel products manufactured by hot rolling process. Ideal for structural applications, fabrication, automotive and general engineering.',
    gst_rate: 18,
    specs: [
      { label: 'Material', value: 'IS:2062 / IS:10748' },
      { label: 'Thickness Range', value: '1.6mm – 25mm' },
      { label: 'Width Range', value: '900mm – 2000mm' },
      { label: 'Grade', value: 'E250, E350, E410' },
      { label: 'Surface Finish', value: 'Hot Rolled, Mill Scale' },
      { label: 'Application', value: 'Structural, Fabrication, Automotive' },
    ],
    variants: [
      { id: 1, name: '2mm × 1250mm', thickness: 2, width: 1250, price: 55000 },
      { id: 2, name: '3mm × 1250mm', thickness: 3, width: 1250, price: 57000 },
      { id: 3, name: '5mm × 1500mm', thickness: 5, width: 1500, price: 59000 },
      { id: 4, name: '6mm × 1500mm', thickness: 6, width: 1500, price: 60000 },
      { id: 5, name: '8mm × 2000mm', thickness: 8, width: 2000, price: 62000 },
      { id: 6, name: '10mm × 2000mm', thickness: 10, width: 2000, price: 64000 },
    ],
  },
  'cr-coils-sheets': {
    id: 2, name: 'CR Coils & Sheets', slug: 'cr-coils-sheets', product_type: 'standard', brand: 'AMNS',
    image_url: 'cold-rolled-steel072e.jpg', base_price: 72000, stock_status: 'in_stock',
    category_name: 'Flat Products', category_slug: 'flat-products',
    description: 'Cold Rolled Coils and Sheets offer superior surface finish and tighter tolerances, ideal for automotive panels, appliances, furniture and precision fabrication.',
    gst_rate: 18,
    specs: [
      { label: 'Material', value: 'IS:513 / IS:1079' },
      { label: 'Thickness Range', value: '0.3mm – 3.2mm' },
      { label: 'Width Range', value: '650mm – 1600mm' },
      { label: 'Grade', value: 'D, DD, EDD, IF' },
      { label: 'Surface Finish', value: 'Bright Annealed, Matte' },
      { label: 'Application', value: 'Automotive, Appliances, Furniture' },
    ],
    variants: [
      { id: 1, name: '0.5mm × 1000mm', thickness: 0.5, width: 1000, price: 70000 },
      { id: 2, name: '0.8mm × 1200mm', thickness: 0.8, width: 1200, price: 71000 },
      { id: 3, name: '1.0mm × 1250mm', thickness: 1.0, width: 1250, price: 72000 },
      { id: 4, name: '1.2mm × 1250mm', thickness: 1.2, width: 1250, price: 73000 },
      { id: 5, name: '1.5mm × 1500mm', thickness: 1.5, width: 1500, price: 74000 },
    ],
  },
  'decking-sheets': {
    id: 8, name: 'Decking Sheets', slug: 'decking-sheets', product_type: 'custom', brand: 'Evonith',
    image_url: 'decking-sheets-17e37.jpg', base_price: null, stock_status: 'in_stock',
    category_name: 'Roofing Solutions', category_slug: 'roofing-products',
    description: 'Steel Deck Sheets for composite flooring in commercial and multi-storey buildings. Custom lengths and profiles available. Price calculated based on dimensions and quantity.',
    gst_rate: 18,
    specs: [
      { label: 'Material', value: 'Galvanized Steel' },
      { label: 'Profile', value: '0.75mm standard deck' },
      { label: 'Zinc Coating', value: '120–275 g/m²' },
      { label: 'Standard Width', value: '600mm, 750mm, 900mm' },
      { label: 'Length', value: 'Custom cut to size' },
      { label: 'Application', value: 'Composite Slabs, Mezzanines' },
    ],
  },
  'puf-panels': {
    id: 9, name: 'PUF Panels', slug: 'puf-panels', product_type: 'custom', brand: 'JSW',
    image_url: 'PUF Panels8be3.png', base_price: null, stock_status: 'in_stock',
    category_name: 'Roofing Solutions', category_slug: 'roofing-products',
    description: 'Polyurethane Foam sandwich panels with steel facings for insulated roofing, cold storage, industrial sheds and clean rooms.',
    gst_rate: 18,
    specs: [
      { label: 'Core Material', value: 'Rigid PU Foam' },
      { label: 'Density', value: '40–45 kg/m³' },
      { label: 'Facing Thickness', value: '0.5mm PPGI both sides' },
      { label: 'Panel Thickness', value: '40mm, 50mm, 75mm, 100mm' },
      { label: 'Width', value: '1000mm nominal' },
      { label: 'Application', value: 'Cold Storage, Warehouses, Cleanrooms' },
    ],
  },
}


export default function ProductDetail() {
  const { productSlug } = useParams()
  const navigate = useNavigate()
  const addItem = useQuoteStore((s) => s.addItem)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedMsg, setAddedMsg] = useState('')
  const [activeMedia, setActiveMedia] = useState(null) // { type: 'image'|'video', src, id }
  const videoRef = useRef(null)

  // Custom product dimensions
  const [customThick, setCustomThick] = useState('')
  const [customWidth, setCustomWidth] = useState('')
  const [customLength, setCustomLength] = useState('')
  const [customQty, setCustomQty] = useState(1)
  const [calcResult, setCalcResult] = useState(null)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSelectedVariant(null)
    setQuantity(1)
    setCalcResult(null)

    productService.getProductBySlug(productSlug)
      .then((res) => {
        const d = res.data?.data || res.data
        if (d && d.name) {
          setProduct(d)
          if (d.variants?.length) setSelectedVariant(d.variants[0])
          const firstImg = d.primary_image || d.images?.[0]?.image_url
          if (firstImg) setActiveMedia({ type: 'image', src: firstImg, id: 'primary' })
        } else loadFb()
      })
      .catch(loadFb)
      .finally(() => setLoading(false))

    function loadFb() {
      const fb = FALLBACK_PRODUCTS[productSlug]
      if (fb) {
        setProduct(fb)
        if (fb.variants?.length) setSelectedVariant(fb.variants[0])
        const src = cdnImg(fb.image_url || PRODUCT_IMAGES[productSlug] || '')
        if (src) setActiveMedia({ type: 'image', src, id: 'primary' })
      }
    }
  }, [productSlug])

  const handleCalculate = async () => {
    if (!customThick || !customWidth || !customLength || !customQty) return
    setCalculating(true)
    try {
      const res = await productService.calculatePrice({
        product_id: product.id,
        thickness: parseFloat(customThick),
        width: parseFloat(customWidth),
        length: parseFloat(customLength),
        quantity: parseInt(customQty),
      })
      setCalcResult(res.data?.data || res.data)
    } catch {
      // Fallback calculation: weight (MT) = thickness(m) × width(m) × length(m) × density(7.85 T/m³) × qty
      const weight_mt = (parseFloat(customThick) / 1000) * (parseFloat(customWidth) / 1000) * parseFloat(customLength) * 7.85 * parseFloat(customQty)
      setCalcResult({ weight_mt: weight_mt.toFixed(3), estimated: true })
    }
    setCalculating(false)
  }

  const handleAddStandard = () => {
    if (!selectedVariant) return
    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: { id: selectedVariant.id, name: selectedVariant.variant_name || selectedVariant.name },
      quantity,
      unit: selectedVariant.unit || 'MT',
      unit_price: selectedVariant.price_per_unit || selectedVariant.price || 0,
      total_price: (selectedVariant.price_per_unit || selectedVariant.price || 0) * quantity,
      specs: selectedVariant.variant_name || selectedVariant.name,
      is_custom: false,
    })
    setAddedMsg('Added to quote basket!')
    setTimeout(() => setAddedMsg(''), 2000)
  }

  const handleAddCustom = () => {
    if (!customThick || !customWidth || !customLength || !customQty) return
    const specs = `${customThick}mm × ${customWidth}mm × ${customLength}m × Qty ${customQty}`
    addItem({
      product: { id: product.id, name: product.name, slug: product.slug },
      variant: null,
      quantity: parseInt(customQty),
      unit: 'Sheets',
      unit_price: 0,
      total_price: 0,
      specs,
      is_custom: true,
    })
    setAddedMsg('Added to quote basket! Our team will confirm pricing.')
    setTimeout(() => setAddedMsg(''), 3000)
  }

  if (loading) return <div className="min-h-96 flex items-center justify-center text-gray-400 text-sm">Loading product...</div>
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
      <Link to="/" style={{ color: '#E67E22' }} className="mt-4 inline-block">Back to Home</Link>
    </div>
  )

  const isCustom = product.product_type === 'custom'
  const gst = product.gst_rate || 18

  const stdPrice = selectedVariant?.price_per_unit || selectedVariant?.price || product.base_price || product.starting_price
  const stdTotal = stdPrice * quantity
  const stdGst = (stdTotal * gst) / 100

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back button + Breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3 transition-colors"
          style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
        >
          &#8592; Back
        </button>
        <nav className="text-sm text-gray-400">
          <Link to="/" className="hover:text-orange-400">Home</Link>
          <span className="mx-2">&#8250;</span>
          <Link to={'/products/' + (product.category_slug || 'flat-products')} className="hover:text-orange-400">{product.category_name || 'Products'}</Link>
          <span className="mx-2">&#8250;</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          {(() => {
            const fallbackSrc = cdnImg(product.image_url || PRODUCT_IMAGES[productSlug] || '')
            const images = product.images?.length
              ? product.images
              : (product.primary_image || fallbackSrc)
                ? [{ id: 'primary', image_url: product.primary_image || fallbackSrc, is_primary: 1 }]
                : []
            const videos = product.videos || []
            const allMedia = [
              ...images.map((img) => ({ type: 'image', src: img.image_url || img.image_path, id: img.id })),
              ...videos.map((vid) => ({ type: 'video', src: vid.video_url || vid.video_path, id: vid.id, title: vid.title })),
            ]
            const current = activeMedia || allMedia[0]

            return (
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Thumbnail strip */}
                {allMedia.length > 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 72, flexShrink: 0 }}>
                    {allMedia.map((m) => {
                      const isActive = current?.id === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setActiveMedia(m); if (videoRef.current) videoRef.current.pause() }}
                          style={{
                            width: 72, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
                            border: isActive ? '2px solid #E67E22' : '2px solid #e5e7eb',
                            background: '#f3f4f6', padding: 0, cursor: 'pointer', position: 'relative',
                          }}
                        >
                          {m.type === 'image' ? (
                            <img src={m.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <>
                              <video src={m.src} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} muted />
                              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', background: 'rgba(0,0,0,0.35)' }}>▶</span>
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Main viewer */}
                <div style={{ flex: 1 }}>
                  <div className="rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!current || current.type === 'image' ? (
                      <img
                        src={current?.src || fallbackSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect fill="%232C3E50" width="600" height="600"/><text fill="%23E67E22" font-size="20" font-family="sans-serif" x="300" y="310" text-anchor="middle">Steel Product</text></svg>' }}
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        src={current.src}
                        controls
                        className="w-full h-full"
                        style={{ objectFit: 'contain', background: '#000', maxHeight: '100%' }}
                      />
                    )}
                  </div>

                  {/* Stock + Brand badges */}
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {product.brand && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg">
                        Brand: <strong>{product.brand}</strong>
                      </span>
                    )}
                    <span className={`inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg ${product.stock_status === 'in_stock' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {product.stock_status === 'in_stock' ? '● In Stock' : '● On Order'}
                    </span>
                    {isCustom && <span className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700">Custom / Made to Order</span>}
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Info panel */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">{product.description}</p>

          {/* Specs table */}
          {product.specs?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Product Specifications</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                {product.specs.map((s, i) => (
                  <div key={i} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="w-40 px-4 py-2.5 font-medium text-gray-500 border-r border-gray-200">{s.spec_name || s.label}</div>
                    <div className="flex-1 px-4 py-2.5 text-gray-800">{s.spec_value || s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Standard product: variant selector ── */}
          {!isCustom && (
            <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Select Variant & Quantity</h3>

              {product.variants?.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm text-gray-500 block mb-1">Dimension / Size</label>
                  <select
                    value={selectedVariant?.id || ''}
                    onChange={(e) => {
                      const v = product.variants.find((v) => v.id === parseInt(e.target.value))
                      setSelectedVariant(v)
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    {product.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.variant_name || v.name}
                        {(v.price_per_unit || v.price) > 0 ? ` — ₹${Number(v.price_per_unit || v.price).toLocaleString('en-IN')}/${v.unit || 'MT'}` : ' — Price on Request'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm text-gray-500 block mb-1">Quantity (MT)</label>
                <input
                  type="number" min="1" value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
              </div>

              {stdPrice && (
                <div className="border-t border-gray-200 pt-4 mb-4 space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Unit Price</span>
                    <span>{'\u20b9'}{Number(stdPrice).toLocaleString('en-IN')}/MT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({quantity} MT)</span>
                    <span>{'\u20b9'}{Number(stdTotal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>GST ({gst}%)</span>
                    <span>+ {'\u20b9'}{Number(stdGst).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Total (incl. GST)</span>
                    <span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(stdTotal + stdGst).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddStandard}
                disabled={!selectedVariant}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#d35400'}
                onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}
              >
                + Add to Quote Basket
              </button>
              {addedMsg && <p className="mt-2 text-sm text-green-600 text-center">{addedMsg}</p>}
            </div>
          )}

          {/* ── Custom product: dimension form ── */}
          {isCustom && (
            <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-1">Custom Dimensions</h3>
              <p className="text-xs text-gray-500 mb-4">Enter your required dimensions. Price will be calculated based on weight / area.</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Thickness (mm)</label>
                  <input type="number" min="0.1" step="0.1" placeholder="e.g. 0.5" value={customThick} onChange={(e) => setCustomThick(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Width (mm)</label>
                  <input type="number" min="1" placeholder="e.g. 1000" value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Length (m)</label>
                  <input type="number" min="0.1" step="0.1" placeholder="e.g. 3.0" value={customLength} onChange={(e) => setCustomLength(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Quantity (Sheets)</label>
                  <input type="number" min="1" placeholder="e.g. 100" value={customQty} onChange={(e) => setCustomQty(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>

              <button onClick={handleCalculate} disabled={calculating || !customThick || !customWidth || !customLength || !customQty} className="w-full py-2 rounded-lg text-sm font-semibold text-white mb-3 disabled:opacity-50" style={{ background: '#2C3E50' }}>
                {calculating ? 'Calculating...' : 'Calculate Weight / Price'}
              </button>

              {calcResult && (
                <div className="bg-white rounded-lg p-3 mb-3 border border-blue-200 text-sm">
                  {calcResult.estimated && <p className="text-xs text-amber-600 mb-2">&#9888; Estimated — final price confirmed by our team</p>}
                  {calcResult.weight_mt && <div className="flex justify-between text-gray-600"><span>Estimated Weight</span><strong>{calcResult.weight_mt} MT</strong></div>}
                  {calcResult.subtotal && <div className="flex justify-between text-gray-600 mt-1"><span>Subtotal</span><strong>{'\u20b9'}{Number(calcResult.subtotal).toLocaleString('en-IN')}</strong></div>}
                  {calcResult.gst_amount && <div className="flex justify-between text-gray-600 mt-1"><span>GST ({gst}%)</span><strong>{'\u20b9'}{Number(calcResult.gst_amount).toLocaleString('en-IN')}</strong></div>}
                  {calcResult.total && <div className="flex justify-between font-bold text-gray-800 mt-1 pt-1 border-t"><span>Total</span><span style={{ color: '#E67E22' }}>{'\u20b9'}{Number(calcResult.total).toLocaleString('en-IN')}</span></div>}
                </div>
              )}

              <button onClick={handleAddCustom} disabled={!customThick || !customWidth || !customLength || !customQty} className="w-full py-3 rounded-lg font-semibold text-white transition-all disabled:opacity-50" style={{ background: '#E67E22', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={(e) => e.currentTarget.style.background = '#d35400'} onMouseOut={(e) => e.currentTarget.style.background = '#E67E22'}>
                + Add to Quote Basket
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Our team will confirm pricing within 2 hours</p>
              {addedMsg && <p className="mt-2 text-sm text-green-600 text-center">{addedMsg}</p>}
            </div>
          )}

          {/* GST notice */}
          <p className="mt-3 text-xs text-gray-400">* Prices shown are exclusive of GST ({gst}%). GST will be added at checkout.</p>
        </div>
      </div>

      {/* View Basket CTA */}
      <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between">
        <p className="text-sm text-gray-600">Items added to your quote basket will be sent to our team for review.</p>
        <Link to="/quote-basket" className="text-sm font-semibold whitespace-nowrap ml-4" style={{ color: '#E67E22' }}>View Quote Basket &rarr;</Link>
      </div>
    </div>
  )
}
