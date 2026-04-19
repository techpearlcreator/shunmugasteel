import { useEffect, useState, useRef } from 'react'
import { getSlides, createSlide, updateSlide, deleteSlide, uploadSlideImage, getCategories } from '../services/adminApi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FormInput, FormTextarea } from '../components/ui/FormInput'
import Spinner from '../components/ui/Spinner'

const EMPTY = { subtitle: '', title: '', description: '', cta_text: 'Get a Quote', cta_link: '/quote-basket', sort_order: 0, status: 'active', image_path: '' }

const S = {
  page:       { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title:      { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  card:       { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  spinner:    { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table:      { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead:      { background: '#F8FAFC' },
  th:         { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  td:         { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#0F172A', verticalAlign: 'middle' },
  tdMuted:    { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 12, verticalAlign: 'middle' },
  tdActions:  { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', verticalAlign: 'middle' },
  actionsWrap:{ display: 'flex', gap: 12, alignItems: 'center' },
  editBtn:    { fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  deleteBtn:  { fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  slideThumb: { width: 100, height: 56, objectFit: 'cover', borderRadius: 6, background: '#F1F5F9', display: 'block' },
  thumbPlaceholder: { width: 100, height: 56, borderRadius: 6, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#94A3B8' },
  formGrid2:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  errorBox:   { fontSize: 13, color: '#DC2626', background: '#FEF2F2', borderRadius: 6, padding: '8px 12px' },
  modalFooter:{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 },
  iStyle:     { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8, padding: '10px 13px', fontSize: 14, outline: 'none', background: '#fff', color: '#0F172A', boxSizing: 'border-box' },
  hint:       { fontSize: 12, color: '#94A3B8', marginTop: 4 },
}

export default function HeroSlides() {
  const [slides, setSlides]       = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [modal, setModal]         = useState(false)
  const [confirm, setConfirm]     = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [error, setError]         = useState('')
  const [imgUploading, setImgUploading] = useState(false)
  const fileInputRef = useRef(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      getSlides(),
      getCategories(),
    ]).then(([slidesRes, catsRes]) => {
      setSlides(Array.isArray(slidesRes.data) ? slidesRes.data : [])
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit = (s) => { setEditing(s); setForm({ ...s }); setError(''); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title) return setError('Title is required')
    setSaving(true)
    try {
      if (editing) {
        await updateSlide(editing.id, form)
        setSlides((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...form } : s))
      } else {
        const res = await createSlide(form)
        setSlides((prev) => [...prev, { ...form, id: res.data.id }])
      }
      setModal(false)
    } catch {
      setError('Save failed. Try again.')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteSlide(confirm.id)
      setSlides((prev) => prev.filter((s) => s.id !== confirm.id))
      setConfirm(null)
    } catch { setConfirm(null) }
    finally { setDeleting(false) }
  }

  const toggleStatus = async (slide) => {
    const newStatus = slide.status === 'active' ? 'inactive' : 'active'
    setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, status: newStatus } : s))
    try {
      await updateSlide(slide.id, { ...slide, status: newStatus })
    } catch {
      setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, status: slide.status } : s))
    }
  }

  const handleImageUpload = async (e, slideId) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    try {
      const r = await uploadSlideImage(slideId, file)
      setForm((f) => ({ ...f, image_path: r.data.image_path, image_url: r.data.image_url }))
      setSlides((prev) => prev.map((s) => s.id === slideId ? { ...s, image_path: r.data.image_path, image_url: r.data.image_url } : s))
    } catch {
      setError('Image upload failed.')
    } finally {
      setImgUploading(false)
      e.target.value = ''
    }
  }

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/shunmugasteel/backend'
  const imgSrc = (slide) => {
    if (!slide.image_path && !slide.image_url) return null
    if (slide.image_url) return slide.image_url
    return slide.image_path.startsWith('http') ? slide.image_path : `${BASE_URL}/${slide.image_path}`
  }

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div>
          <h2 style={S.title}>Hero Slides</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8' }}>Manage homepage banner slides — image, text, and CTA button</p>
        </div>
        <Button onClick={openAdd}>+ Add Slide</Button>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th}>Preview</th>
                <th style={S.th}>Title</th>
                <th style={S.th}>Subtitle</th>
                <th style={S.th}>CTA Button</th>
                <th style={S.th}>Order</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) => (
                <tr key={slide.id}
                  style={{ background: '#fff' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <td style={S.td}>
                    {imgSrc(slide)
                      ? <img src={imgSrc(slide)} alt="" style={S.slideThumb} onError={(e) => e.target.style.display = 'none'} />
                      : <div style={S.thumbPlaceholder}>No image</div>
                    }
                  </td>
                  <td style={S.td}><strong>{slide.title}</strong></td>
                  <td style={S.tdMuted}>{slide.subtitle}</td>
                  <td style={S.tdMuted}>{slide.cta_text} → {slide.cta_link}</td>
                  <td style={{ ...S.td, textAlign: 'center' }}>{slide.sort_order}</td>
                  <td style={S.td}><Badge label={slide.status} /></td>
                  <td style={S.tdActions}>
                    <div style={S.actionsWrap}>
                      <button onClick={() => openEdit(slide)} style={S.editBtn}>Edit</button>
                      <button
                        onClick={() => toggleStatus(slide)}
                        style={{ ...S.editBtn, color: slide.status === 'active' ? '#D97706' : '#16A34A' }}
                      >
                        {slide.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => setConfirm(slide)} style={S.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!slides.length && (
                <tr><td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8' }}>No slides yet. Add your first slide.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Slide' : 'Add Slide'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Image upload — only available when editing */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>Slide Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {(form.image_url || form.image_path) && (
                <img
                  src={form.image_url || (form.image_path.startsWith('http') ? form.image_path : `${BASE_URL}/${form.image_path}`)}
                  alt=""
                  style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2E8F0' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: 8,
                  cursor: !editing || imgUploading ? 'not-allowed' : 'pointer',
                  background: !editing ? '#F8FAFC' : '#fff', fontSize: 13, color: '#64748B', fontWeight: 500,
                  opacity: !editing ? 0.6 : 1,
                }}>
                  {imgUploading ? '⏳ Uploading…' : '📁 Upload Image'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    disabled={!editing || imgUploading}
                    onChange={(e) => handleImageUpload(e, editing.id)}
                  />
                </label>
                {!editing && <span style={S.hint}>Save the slide first, then upload image</span>}
                <span style={S.hint}>Recommended: 1400×560px, JPG/PNG/WEBP, max 10MB</span>
              </div>
            </div>
          </div>

          <div style={S.formGrid2}>
            <FormInput label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <FormInput label="Subtitle (e.g. SINCE 1976)" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>

          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div style={S.formGrid2}>
            <FormInput label="CTA Button Text" value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="Get a Quote" />
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>CTA Link</label>
              <select value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} style={S.iStyle}>
                <optgroup label="Pages">
                  <option value="/quote-basket">Quote Basket</option>
                  <option value="/brands">Brands</option>
                  <option value="/about">About Us</option>
                  <option value="/contact">Contact</option>
                </optgroup>
                <optgroup label="Categories">
                  {categories.filter(c => !c.parent_id).map((c) => (
                    <option key={c.id} value={`/products/${c.slug}`}>{c.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Sub-Categories">
                  {categories.filter(c => c.parent_id).map((c) => (
                    <option key={c.id} value={`/products/${c.slug}`}>↳ {c.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div style={S.formGrid2}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                style={S.iStyle} min="0" />
              <p style={S.hint}>Lower number = shown first</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase' }}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={S.iStyle}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {error && <p style={S.errorBox}>{error}</p>}

          <div style={S.modalFooter}>
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button loading={saving} type="submit">{editing ? 'Save Changes' : 'Create Slide'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Delete slide "${confirm?.title}"? This cannot be undone.`}
      />
    </div>
  )
}
