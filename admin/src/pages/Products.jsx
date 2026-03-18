import { useEffect, useRef, useState } from 'react'
import { getProducts, getProduct, getCategories, createProduct, updateProduct, deleteProduct,
         getProductImages, uploadProductImage, setPrimaryImage, deleteProductImage,
         getProductVideos, uploadProductVideo, deleteProductVideo } from '../services/adminApi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput'
import Spinner from '../components/ui/Spinner'
import adminApi from '../services/adminApi'

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const EMPTY = {
  category_id: '', name: '', slug: '', short_description: '', description: '',
  product_type: 'standard', brand: '', stock_status: 'in_stock',
  is_featured: 0, sort_order: 0, status: 'active',
}
const EMPTY_VARIANT = { variant_name: '', thickness: '', width: '', length: '', grade: '', unit: 'ton', price_per_unit: '', sort_order: 0 }
const EMPTY_RULE    = { primary_pricing_unit: 'kg', price_per_kg: '', price_per_ton: '', price_per_meter: '', price_per_sqft: '', price_per_sheet: '' }
const BRANDS  = ['', 'SAIL', 'AMNS India', 'JSW Steel', 'Evonith', 'Multiple']
const UNITS   = ['ton', 'kg', 'meter', 'sqft', 'sheet', 'piece']
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173'

const TYPE_STYLE = {
  standard: { background: '#EFF6FF', color: '#2563EB' },
  custom:   { background: '#F5F3FF', color: '#7C3AED' },
  both:     { background: '#FFF7ED', color: '#EA580C' },
}
const STOCK_STYLE = {
  in_stock:      { background: '#F0FDF4', color: '#16A34A' },
  out_of_stock:  { background: '#FEF2F2', color: '#DC2626' },
  made_to_order: { background: '#FFFBEB', color: '#D97706' },
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  titleWrap: { display: 'flex', alignItems: 'baseline', gap: 8 },
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  count: { fontSize: 15, fontWeight: 400, color: '#94A3B8' },
  controls: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  selectInput: { border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', color: '#0F172A', background: '#fff', cursor: 'pointer' },
  searchInput: { border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px', fontSize: 13, width: 210, outline: 'none', color: '#0F172A', background: '#fff' },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  scrollWrap: { overflowX: 'auto' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' },
  thCenter: { padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  td: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#0F172A' },
  tdSm: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: 13 },
  tdCenter: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', textAlign: 'center' },
  tdActions: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9' },
  productWrap: { display: 'flex', alignItems: 'center', gap: 10 },
  productImg: { width: 36, height: 36, borderRadius: 8, objectFit: 'cover', background: '#F1F5F9' },
  productImgFallback: { width: 36, height: 36, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  productName: { fontWeight: 600, color: '#0F172A' },
  productSlug: { fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' },
  typeBadge: { fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 },
  stockBadge: { fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 },
  liveDot: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 20, padding: '2px 8px' },
  offlineDot: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 20, padding: '2px 8px' },
  actionsWrap: { display: 'flex', gap: 12 },
  editBtn: { fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  deleteBtn: { fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  emptyWrap: { padding: '56px 16px', textAlign: 'center', color: '#94A3B8' },
  // Modal
  tabBar: { display: 'flex', gap: 2, borderBottom: '1px solid #F1F5F9', marginBottom: 20 },
  tabBtn: { padding: '8px 16px', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize', borderBottom: '2px solid transparent', color: '#64748B' },
  tabBtnActive: { padding: '8px 16px', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize', borderBottom: '2px solid #F97316', color: '#F97316' },
  formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  formGrid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  formGrid4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 },
  hint: { fontSize: 12, color: '#94A3B8', marginTop: -8, marginBottom: 4 },
  variantCard: { border: '1px solid #E2E8F0', borderRadius: 10, padding: 12, position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 },
  removeBtn: { position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', color: '#EF4444', fontSize: 18, cursor: 'pointer', lineHeight: 1 },
  addVariantBtn: { fontSize: 13, color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 },
  errorBox: { fontSize: 13, color: '#DC2626', background: '#FEF2F2', borderRadius: 6, padding: '8px 12px', marginTop: 8 },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, marginTop: 8, borderTop: '1px solid #F1F5F9' },
  checkWrap: { display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4 },
  checkLabel: { fontSize: 13, color: '#64748B', cursor: 'pointer' },
}

export default function Products() {
  const [products,  setProducts]  = useState([])
  const [cats,      setCats]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [modal,     setModal]     = useState(false)
  const [confirm,   setConfirm]   = useState(null)
  const [editing,   setEditing]   = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [deleting,  setDeleting]  = useState(false)
  const [tab,       setTab]       = useState('info')
  const [form,      setForm]      = useState(EMPTY)
  const [variants,  setVariants]  = useState([])
  const [rule,      setRule]      = useState(EMPTY_RULE)
  const [images,    setImages]    = useState([])
  const [imgUploading, setImgUploading] = useState(false)
  const [videos,    setVideos]    = useState([])
  const [vidUploading, setVidUploading] = useState(false)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [filterCat, setFilterCat] = useState('')
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      getProducts().then((r) => setProducts(Array.isArray(r.data) ? r.data : [])),
      getCategories().then((r) => setCats(Array.isArray(r.data) ? r.data : [])),
    ]).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setVariants([{ ...EMPTY_VARIANT }])
    setRule({ ...EMPTY_RULE }); setError(''); setTab('info'); setModal(true)
  }

  const openEdit = async (prod) => {
    setEditing(prod); setTab('info'); setError(''); setModal(true)
    setForm({
      category_id: prod.category_id, name: prod.name, slug: prod.slug,
      short_description: prod.short_description || '', description: prod.description || '',
      product_type: prod.product_type, brand: prod.brand || '',
      stock_status: prod.stock_status, is_featured: prod.is_featured,
      sort_order: prod.sort_order, status: prod.status,
    })
    setVariants([]); setRule({ ...EMPTY_RULE }); setImages([]); setVideos([])
    try {
      const r = await getProduct(prod.id)
      setVariants(r.data.variants?.length ? r.data.variants : [{ ...EMPTY_VARIANT }])
      setRule(r.data.pricing_rules || { ...EMPTY_RULE })
      setImages(r.data.images || [])
      setVideos(r.data.videos || [])
    } catch {}
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !editing) return
    setImgUploading(true)
    try {
      const r = await uploadProductImage(editing.id, file)
      setImages((prev) => [...prev, r.data])
      load()
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed')
    } finally {
      setImgUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !editing) return
    setVidUploading(true)
    try {
      const r = await uploadProductVideo(editing.id, file)
      setVideos((prev) => [...prev, r.data])
    } catch (err) {
      setError(err.response?.data?.error || 'Video upload failed')
    } finally {
      setVidUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!editing) return
    try {
      await deleteProductVideo(editing.id, videoId)
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
    } catch {}
  }

  const handleSetPrimary = async (imageId) => {
    if (!editing) return
    try {
      await setPrimaryImage(editing.id, imageId)
      setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId ? 1 : 0 })))
      load()
    } catch {}
  }

  const handleDeleteImage = async (imageId) => {
    if (!editing) return
    try {
      await deleteProductImage(editing.id, imageId)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      load()
    } catch {}
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category_id) return setError('Name and category are required')
    setSaving(true)
    try {
      let productId = editing?.id
      if (editing) {
        await updateProduct(editing.id, form)
      } else {
        const r = await createProduct(form)
        productId = r.data.id
      }
      if (['standard','both'].includes(form.product_type) && productId) {
        for (const v of variants) {
          if (!v.variant_name) continue
          if (v.id) {
            await adminApi.put(`/admin/products/${productId}/variants/${v.id}`, v)
          } else {
            await adminApi.post(`/admin/products/${productId}/variants`, v)
          }
        }
      }
      if (['custom','both'].includes(form.product_type) && productId) {
        await adminApi.post(`/admin/products/${productId}/pricing`, rule)
      }
      setModal(false); load()
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await deleteProduct(confirm.id); setConfirm(null); load() }
    catch {} finally { setDeleting(false) }
  }

  const toggleStatus = async (prod) => {
    const newStatus = prod.status === 'active' ? 'inactive' : 'active'
    await updateProduct(prod.id, { ...prod, status: newStatus })
    setProducts((prev) => prev.map((p) => p.id === prod.id ? { ...p, status: newStatus } : p))
  }

  const addVariant    = () => setVariants([...variants, { ...EMPTY_VARIANT }])
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i))
  const setVariant    = (i, field, val) => setVariants(variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v))

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
    const matchCat    = !filterCat || String(p.category_id) === filterCat
    return matchSearch && matchCat
  })

  const showVariants = ['standard','both'].includes(form.product_type)
  const showPricing  = ['custom','both'].includes(form.product_type)
  const tabs = ['info', ...(showVariants ? ['variants'] : []), ...(showPricing ? ['pricing'] : []), ...(editing ? ['images'] : [])]

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.topRow}>
        <div style={S.titleWrap}>
          <h2 style={S.title}>Products</h2>
          <span style={S.count}>({filtered.length})</span>
        </div>
        <div style={S.controls}>
          <select
            style={S.selectInput}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          >
            <option value="">All Categories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            style={S.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
          <Button onClick={openAdd}>+ Add Product</Button>
        </div>
      </div>

      {/* Table */}
      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <div style={S.scrollWrap}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  {['Product', 'Category', 'Type', 'Brand', 'Stock', 'Featured', 'Status', 'Live on Site', 'Actions'].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isLive = p.status === 'active'
                  return (
                    <tr
                      key={p.id}
                      style={{ background: '#fff' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={S.td}>
                        <div style={S.productWrap}>
                          {p.primary_image ? (
                            <img src={p.primary_image} alt="" style={S.productImg} onError={(e) => e.target.style.display = 'none'} />
                          ) : (
                            <div style={S.productImgFallback}>🏗️</div>
                          )}
                          <div>
                            <div style={S.productName}>{p.name}</div>
                            <div style={S.productSlug}>{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={S.tdSm}>{p.category_name || '—'}</td>
                      <td style={S.td}>
                        <span style={{ ...S.typeBadge, ...(TYPE_STYLE[p.product_type] || {}) }}>
                          {p.product_type}
                        </span>
                      </td>
                      <td style={S.tdSm}>{p.brand || '—'}</td>
                      <td style={S.td}>
                        <span style={{ ...S.stockBadge, ...(STOCK_STYLE[p.stock_status] || {}) }}>
                          {p.stock_status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={S.tdCenter}>{p.is_featured ? '⭐' : <span style={{ color: '#CBD5E1' }}>—</span>}</td>
                      <td style={S.td}><Badge label={p.status} /></td>
                      <td style={S.td}>
                        {isLive ? (
                          <span style={S.liveDot}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                            Live
                          </span>
                        ) : (
                          <span style={S.offlineDot}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
                            Hidden
                          </span>
                        )}
                      </td>
                      <td style={S.tdActions}>
                        <div style={S.actionsWrap}>
                          <button onClick={() => openEdit(p)} style={S.editBtn}>Edit</button>
                          <button
                            onClick={() => toggleStatus(p)}
                            style={{ ...S.editBtn, color: isLive ? '#D97706' : '#16A34A' }}
                          >{isLive ? 'Disable' : 'Enable'}</button>
                          {isLive && (
                            <a
                              href={`${PUBLIC_URL}/products/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ ...S.editBtn, color: '#8B5CF6' }}
                            >View ↗</a>
                          )}
                          <button onClick={() => setConfirm(p)} style={S.deleteBtn}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {!filtered.length && (
                  <tr>
                    <td colSpan={9} style={S.emptyWrap}>
                      {products.length ? 'No products match filters' : 'No products yet — click + Add Product'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? `Edit: ${editing.name}` : 'Add Product'}>
        {/* Tabs */}
        <div style={S.tabBar}>
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={tab === t ? S.tabBtnActive : S.tabBtn}
            >{t}</button>
          ))}
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* INFO TAB */}
          {tab === 'info' && (
            <>
              <div style={S.formGrid2}>
                <FormInput label="Product Name" required value={form.name} onChange={(e) => {
                  const name = e.target.value
                  setForm({ ...form, name, slug: editing ? form.slug : slugify(name) })
                }} />
                <FormInput label="Slug" required value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
              </div>
              <div style={S.formGrid2}>
                <FormSelect label="Category" required value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— Select Category —</option>
                  {cats.filter((c) => c.status === 'active').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </FormSelect>
                <FormSelect label="Product Type" value={form.product_type}
                  onChange={(e) => setForm({ ...form, product_type: e.target.value })}>
                  <option value="standard">Standard (fixed variants)</option>
                  <option value="custom">Custom (dimension-based)</option>
                  <option value="both">Both</option>
                </FormSelect>
              </div>
              <div style={S.formGrid2}>
                <FormSelect label="Brand" value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}>
                  {BRANDS.map((b) => <option key={b} value={b}>{b || '— Select Brand —'}</option>)}
                </FormSelect>
                <FormSelect label="Stock Status" value={form.stock_status}
                  onChange={(e) => setForm({ ...form, stock_status: e.target.value })}>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="made_to_order">Made to Order</option>
                </FormSelect>
              </div>
              <FormInput label="Short Description" value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
              <FormTextarea label="Full Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div style={S.formGrid3}>
                <FormInput label="Sort Order" type="number" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
                <FormSelect label="Status" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active (visible on site)</option>
                  <option value="inactive">Inactive (hidden)</option>
                </FormSelect>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                  <label style={S.checkWrap}>
                    <input
                      type="checkbox"
                      checked={!!form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })}
                      style={{ width: 16, height: 16, accentColor: '#F97316', cursor: 'pointer' }}
                    />
                    <span style={S.checkLabel}>Featured Product ⭐</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* VARIANTS TAB */}
          {tab === 'variants' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={S.hint}>Define standard size/grade variants with fixed prices.</p>
              {variants.map((v, i) => (
                <div key={i} style={S.variantCard}>
                  <button type="button" onClick={() => removeVariant(i)} style={S.removeBtn}>×</button>
                  <div style={S.formGrid2}>
                    <FormInput label="Variant Name" placeholder="e.g. 2mm × 1250mm HR Coil" value={v.variant_name}
                      onChange={(e) => setVariant(i, 'variant_name', e.target.value)} />
                    <FormInput label="Grade" placeholder="e.g. IS2062" value={v.grade}
                      onChange={(e) => setVariant(i, 'grade', e.target.value)} />
                  </div>
                  <div style={S.formGrid4}>
                    <FormInput label="Thickness (mm)" type="number" value={v.thickness}
                      onChange={(e) => setVariant(i, 'thickness', e.target.value)} />
                    <FormInput label="Width (mm)" type="number" value={v.width}
                      onChange={(e) => setVariant(i, 'width', e.target.value)} />
                    <FormInput label="Price per Unit" type="number" value={v.price_per_unit}
                      onChange={(e) => setVariant(i, 'price_per_unit', e.target.value)} />
                    <FormSelect label="Unit" value={v.unit}
                      onChange={(e) => setVariant(i, 'unit', e.target.value)}>
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </FormSelect>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addVariant} style={S.addVariantBtn}>+ Add Variant</button>
            </div>
          )}

          {/* PRICING TAB */}
          {tab === 'pricing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={S.hint}>Set pricing per unit for custom dimension orders.</p>
              <FormSelect label="Primary Pricing Unit" value={rule.primary_pricing_unit}
                onChange={(e) => setRule({ ...rule, primary_pricing_unit: e.target.value })}>
                <option value="kg">Per KG</option>
                <option value="ton">Per Ton</option>
                <option value="meter">Per Meter</option>
                <option value="sqft">Per Sq.Ft</option>
                <option value="sheet">Per Sheet</option>
              </FormSelect>
              <div style={S.formGrid2}>
                <FormInput label="Price per KG (₹)"    type="number" value={rule.price_per_kg}
                  onChange={(e) => setRule({ ...rule, price_per_kg: e.target.value })} />
                <FormInput label="Price per Ton (₹)"   type="number" value={rule.price_per_ton}
                  onChange={(e) => setRule({ ...rule, price_per_ton: e.target.value })} />
                <FormInput label="Price per Meter (₹)" type="number" value={rule.price_per_meter}
                  onChange={(e) => setRule({ ...rule, price_per_meter: e.target.value })} />
                <FormInput label="Price per Sq.Ft (₹)" type="number" value={rule.price_per_sqft}
                  onChange={(e) => setRule({ ...rule, price_per_sqft: e.target.value })} />
                <FormInput label="Price per Sheet (₹)" type="number" value={rule.price_per_sheet}
                  onChange={(e) => setRule({ ...rule, price_per_sheet: e.target.value })} />
              </div>
            </div>
          )}

          {/* IMAGES TAB */}
          {tab === 'images' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={S.hint}>Upload product images to MinIO. The starred image is shown as the primary thumbnail.</p>

              {/* Image grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {images.map((img) => (
                  <div key={img.id} style={{ position: 'relative', width: 110, height: 110, borderRadius: 10, border: img.is_primary ? '2px solid #F97316' : '2px solid #E2E8F0', overflow: 'hidden', background: '#F8FAFC' }}>
                    <img src={img.image_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                    {/* Primary badge */}
                    {img.is_primary ? (
                      <span style={{ position: 'absolute', top: 4, left: 4, background: '#F97316', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px' }}>Primary</span>
                    ) : (
                      <button type="button" title="Set as primary" onClick={() => handleSetPrimary(img.id)}
                        style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.45)', border: 'none', color: '#fff', fontSize: 13, borderRadius: 10, padding: '1px 7px', cursor: 'pointer' }}>☆</button>
                    )}
                    {/* Delete button */}
                    <button type="button" title="Delete image" onClick={() => handleDeleteImage(img.id)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,0.85)', border: 'none', color: '#fff', fontSize: 14, width: 22, height: 22, borderRadius: '50%', cursor: 'pointer', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}

                {/* Upload tile */}
                <label style={{ width: 110, height: 110, borderRadius: 10, border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: imgUploading ? 'wait' : 'pointer', color: '#94A3B8', fontSize: 12, gap: 4, background: '#FAFAFA' }}>
                  <span style={{ fontSize: 28 }}>{imgUploading ? '⏳' : '+'}</span>
                  <span>{imgUploading ? 'Uploading…' : 'Add Image'}</span>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageUpload} disabled={imgUploading} />
                </label>
              </div>

              <p style={{ ...S.hint, marginTop: 0 }}>Accepted: JPG, PNG, WEBP · Max 5 MB per image</p>

              {/* ── Videos section ── */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Videos</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {videos.map((vid) => (
                    <div key={vid.id} style={{ position: 'relative', width: 110, height: 110, borderRadius: 10, border: '2px solid #E2E8F0', overflow: 'hidden', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <video src={vid.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} muted />
                      <span style={{ position: 'absolute', fontSize: 28, color: '#fff', pointerEvents: 'none' }}>▶</span>
                      {vid.title && (
                        <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 9, padding: '2px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vid.title}</span>
                      )}
                      <button type="button" onClick={() => handleDeleteVideo(vid.id)}
                        style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(220,38,38,0.85)', border: 'none', color: '#fff', fontSize: 14, width: 22, height: 22, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                  {/* Upload video tile */}
                  <label style={{ width: 110, height: 110, borderRadius: 10, border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: vidUploading ? 'wait' : 'pointer', color: '#94A3B8', fontSize: 12, gap: 4, background: '#FAFAFA' }}>
                    <span style={{ fontSize: 28 }}>{vidUploading ? '⏳' : '▶'}</span>
                    <span>{vidUploading ? 'Uploading…' : 'Add Video'}</span>
                    <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo" style={{ display: 'none' }} onChange={handleVideoUpload} disabled={vidUploading} />
                  </label>
                </div>
                <p style={{ ...S.hint, marginTop: 8 }}>Accepted: MP4, WEBM, MOV, AVI · Max 100 MB per video</p>
              </div>
            </div>
          )}

          {error && <p style={S.errorBox}>{error}</p>}

          <div style={S.modalFooter}>
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button loading={saving} type="submit">{editing ? 'Save Changes' : 'Create Product'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Deactivate product "${confirm?.name}"?`}
      />
    </div>
  )
}
