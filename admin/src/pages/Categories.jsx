import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory, uploadCategoryImage } from '../services/adminApi'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { FormInput, FormSelect, FormTextarea } from '../components/ui/FormInput'
import Spinner from '../components/ui/Spinner'

const EMPTY = { name: '', slug: '', description: '', parent_id: '', sort_order: 0, status: 'active', image: '' }
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  thCenter: { padding: '10px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  td: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#0F172A' },
  tdMuted: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 },
  tdCenter: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', textAlign: 'center', fontSize: 12 },
  tdSmall: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: 12 },
  tdActions: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9' },
  nameWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  nameWrapChild: { display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 24 },
  childArrow: { color: '#CBD5E1', fontSize: 12 },
  catImg: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover' },
  catNameRoot: { fontWeight: 600, color: '#0F172A' },
  catNameChild: { fontWeight: 500, color: '#64748B', fontSize: 13 },
  rootBadge: { color: '#F97316', fontWeight: 600, fontSize: 12 },
  actionsWrap: { display: 'flex', gap: 12 },
  editBtn: { fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  deleteBtn: { fontSize: 12, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  emptyCell: { padding: '40px 16px', textAlign: 'center', color: '#94A3B8' },
  formGrid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  formGrid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  errorBox: { fontSize: 13, color: '#DC2626', background: '#FEF2F2', borderRadius: 6, padding: '8px 12px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 },
}

export default function Categories() {
  const [cats, setCats]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modal, setModal]       = useState(false)
  const [confirm, setConfirm]   = useState(null)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [error, setError]       = useState('')
  const [imgUploading, setImgUploading] = useState(false)
  const fileInputRef = useRef(null)

  const load = () => {
    setLoading(true)
    getCategories().then((r) => setCats(Array.isArray(r.data) ? r.data : [])).catch(() => setCats([])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const parents = cats.filter((c) => !c.parent_id)
  const openAdd  = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }
  const openEdit = (cat) => { setEditing(cat); setForm({ ...cat, parent_id: cat.parent_id || '' }); setError(''); setModal(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.slug) return setError('Name and slug are required')
    setSaving(true)
    try {
      editing ? await updateCategory(editing.id, form) : await createCategory(form)
      setModal(false); load()
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCategory(confirm.id)
      // Remove deleted category and its children from state directly
      setCats((prev) => prev.filter((c) => c.id !== confirm.id && c.parent_id !== confirm.id))
      setConfirm(null)
    } catch {
      setConfirm(null)
    } finally { setDeleting(false) }
  }

  const toggleStatus = async (cat) => {
    const newStatus = cat.status === 'active' ? 'inactive' : 'active'
    // Optimistic update
    setCats((prev) => prev.map((c) => c.id === cat.id ? { ...c, status: newStatus } : c))
    try {
      await updateCategory(cat.id, { ...cat, status: newStatus })
    } catch {
      // Rollback on failure
      setCats((prev) => prev.map((c) => c.id === cat.id ? { ...c, status: cat.status } : c))
    }
  }

  const tree = parents.flatMap((p) => [p, ...cats.filter((c) => c.parent_id == p.id)])

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <h2 style={S.title}>Categories</h2>
        <Button onClick={openAdd}>+ Add Category</Button>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                <th style={S.th}>Name</th>
                <th style={S.th}>Slug</th>
                <th style={S.th}>Parent</th>
                <th style={S.thCenter}>Sort</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tree.map((cat) => {
                const isChild = !!cat.parent_id
                return (
                  <tr
                    key={cat.id}
                    style={{ background: '#fff' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={S.td}>
                      <div style={isChild ? S.nameWrapChild : S.nameWrap}>
                        {isChild && <span style={S.childArrow}>↳</span>}
                        {cat.image && (
                          <img
                            src={cat.image}
                            alt=""
                            style={S.catImg}
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <span style={isChild ? S.catNameChild : S.catNameRoot}>{cat.name}</span>
                      </div>
                    </td>
                    <td style={S.tdMuted}>{cat.slug}</td>
                    <td style={S.tdSmall}>
                      {cat.parent_id
                        ? (parents.find((p) => p.id == cat.parent_id)?.name || '—')
                        : <span style={S.rootBadge}>Root</span>
                      }
                    </td>
                    <td style={S.tdCenter}>{cat.sort_order}</td>
                    <td style={S.td}><Badge label={cat.status} /></td>
                    <td style={S.tdActions}>
                      <div style={S.actionsWrap}>
                        <button onClick={() => openEdit(cat)} style={S.editBtn}>Edit</button>
                        <button
                          onClick={() => toggleStatus(cat)}
                          style={{ ...S.editBtn, color: cat.status === 'active' ? '#D97706' : '#16A34A' }}
                        >
                          {cat.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => setConfirm(cat)} style={S.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!cats.length && (
                <tr>
                  <td colSpan={6} style={S.emptyCell}>No categories yet</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={S.formGrid2}>
            <FormInput
              label="Name"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value
                setForm({ ...form, name, slug: editing ? form.slug : slugify(name) })
              }}
            />
            <FormInput
              label="Slug"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Category Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {form.image && (
                <img
                  src={form.image.startsWith('http') ? form.image : `http://localhost/shunmugasteel/backend/${form.image}`}
                  alt=""
                  style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover', border: '1px solid #E2E8F0' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #E2E8F0', borderRadius: 8, cursor: imgUploading ? 'wait' : 'pointer', background: '#F8FAFC', fontSize: 13, color: '#64748B', fontWeight: 500 }}>
                {imgUploading ? '⏳ Uploading…' : '📁 Choose Image'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  disabled={imgUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (!editing) {
                      setError('Save the category first, then upload an image.')
                      return
                    }
                    setImgUploading(true)
                    try {
                      const r = await uploadCategoryImage(editing.id, file)
                      setForm((f) => ({ ...f, image: r.data.image_path }))
                    } catch {
                      setError('Image upload failed. Please try again.')
                    } finally {
                      setImgUploading(false)
                      e.target.value = ''
                    }
                  }}
                />
              </label>
              {!editing && <span style={{ fontSize: 12, color: '#94A3B8' }}>Save category first to upload image</span>}
            </div>
          </div>
          <FormTextarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div style={S.formGrid3}>
            <FormSelect
              label="Parent"
              value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            >
              <option value="">— Root —</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </FormSelect>
            <FormInput
              label="Sort Order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />
            <FormSelect
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </div>
          {error && <p style={S.errorBox}>{error}</p>}
          <div style={S.modalFooter}>
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button loading={saving} type="submit">{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message={`Deactivate category "${confirm?.name}"?`}
      />
    </div>
  )
}
