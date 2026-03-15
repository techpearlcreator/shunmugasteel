import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuote, updateQuoteStatus } from '../../services/adminApi'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'

const STATUSES = ['submitted', 'reviewed', 'confirmed', 'dispatched', 'cancelled']

const STATUS_DOT = {
  submitted:  '#F97316',
  reviewed:   '#3B82F6',
  confirmed:  '#8B5CF6',
  dispatched: '#06B6D4',
  cancelled:  '#EF4444',
}

const safeJson = (val) => {
  if (!val) return null
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return null }
}

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const fmtTs   = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const S = {
  page:        { display: 'flex', flexDirection: 'column', gap: 20, minHeight: '100vh' },
  backBtn:     { background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 13, fontWeight: 500, padding: '6px 0', display: 'inline-flex', alignItems: 'center', gap: 6 },
  columns:     { display: 'grid', gridTemplateColumns: '1fr', gap: 20 },
  left:        { display: 'flex', flexDirection: 'column', gap: 20 },
  right:       { display: 'flex', flexDirection: 'column', gap: 20 },
  card:        { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 20 },
  cardTitle:   { fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 },
  quoteNum:    { fontFamily: 'monospace', fontSize: 26, fontWeight: 800, color: '#F97316', letterSpacing: 1 },
  statusRow:   { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, marginBottom: 12 },
  metaRow:     { display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 4 },
  metaItem:    { fontSize: 12, color: '#94A3B8' },
  metaVal:     { fontWeight: 600, color: '#0F172A', marginLeft: 4 },
  infoGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  infoLabel:   { fontSize: 11, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 },
  infoVal:     { fontSize: 14, color: '#0F172A', fontWeight: 500 },
  infoValMuted:{ fontSize: 13, color: '#64748B' },
  addrBox:     { background: '#F8FAFC', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#64748B', lineHeight: 1.6, marginTop: 4 },
  scrollWrap:  { overflowX: 'auto' },
  table:       { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  thead:       { background: '#F8FAFC' },
  th:          { padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  thRight:     { padding: '9px 12px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  td:          { padding: '10px 12px', borderBottom: '1px solid #F1F5F9', color: '#0F172A', fontSize: 13 },
  tdRight:     { padding: '10px 12px', borderBottom: '1px solid #F1F5F9', color: '#0F172A', fontSize: 13, textAlign: 'right' },
  tdMuted:     { padding: '10px 12px', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: 12 },
  specTag:     { display: 'inline-block', background: '#F1F5F9', borderRadius: 4, padding: '2px 6px', fontSize: 11, color: '#64748B', margin: '1px 2px' },
  totalsWrap:  { paddingTop: 10, marginTop: 6, borderTop: '2px solid #F1F5F9' },
  totalRow:    { display: 'flex', justifyContent: 'flex-end', gap: 0, marginBottom: 4 },
  totalLabel:  { fontSize: 13, color: '#64748B', minWidth: 160, textAlign: 'right', paddingRight: 16 },
  totalVal:    { fontSize: 13, color: '#0F172A', fontWeight: 600, minWidth: 100, textAlign: 'right' },
  grandLabel:  { fontSize: 15, color: '#0F172A', fontWeight: 700, minWidth: 160, textAlign: 'right', paddingRight: 16 },
  grandVal:    { fontSize: 15, color: '#F97316', fontWeight: 800, minWidth: 100, textAlign: 'right' },
  formGroup:   { display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 },
  label:       { fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 2 },
  select:      { border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#0F172A', outline: 'none', background: '#fff', width: '100%', cursor: 'pointer' },
  textarea:    { border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 12px', fontSize: 13, color: '#0F172A', outline: 'none', background: '#fff', width: '100%', resize: 'vertical', minHeight: 72, fontFamily: 'inherit' },
  msgSuccess:  { fontSize: 13, color: '#16A34A', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, padding: '8px 12px', marginBottom: 10 },
  msgError:    { fontSize: 13, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '8px 12px', marginBottom: 10 },
  timeline:    { display: 'flex', flexDirection: 'column', gap: 0 },
  tlItem:      { display: 'flex', gap: 12, position: 'relative', paddingBottom: 16 },
  tlDot:       { width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4, zIndex: 1 },
  tlLine:      { position: 'absolute', left: 4, top: 14, bottom: 0, width: 2, background: '#F1F5F9' },
  tlStatus:    { fontSize: 13, fontWeight: 600, color: '#0F172A', textTransform: 'capitalize' },
  tlNote:      { fontSize: 12, color: '#64748B', marginTop: 2 },
  tlTime:      { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  notesBox:    { background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#92400E', lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  notesEmpty:  { fontSize: 13, color: '#CBD5E1', fontStyle: 'italic' },
  spinnerWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 },
  notFound:    { textAlign: 'center', color: '#EF4444', padding: '48px 16px', fontSize: 16 },
}

export default function QuoteDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const [quote, setQuote]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [ns, setNs]           = useState('')
  const [an, setAn]           = useState('')
  const [sn, setSn]           = useState('')
  const [msg, setMsg]         = useState('')

  const load = () => {
    setLoading(true)
    getQuote(id)
      .then((r) => {
        setQuote(r.data)
        setNs(r.data.status)
        setAn(r.data.admin_notes || '')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      await updateQuoteStatus(id, { status: ns, admin_notes: an, notes: sn })
      setMsg('success')
      load()
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={S.spinnerWrap}><Spinner /></div>
  if (!quote)  return <div style={S.notFound}>Quote not found</div>

  const items   = Array.isArray(quote.items) ? quote.items : (safeJson(quote.items) || [])
  const addr    = safeJson(quote.delivery_address)
  const timeline = Array.isArray(quote.timeline) ? quote.timeline : (safeJson(quote.timeline) || [])

  const subtotal = items.reduce((s, it) => s + (Number(it.unit_price || 0) * Number(it.quantity || 0)), 0)
  const gstPct   = Number(quote.gst_percent || 18)
  const gstAmt   = subtotal * gstPct / 100
  const grandTotal = subtotal + gstAmt

  const fmtAddr = addr
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')
    : (quote.delivery_address || '—')

  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate('/quotes')}>
        ← Back to Quotes
      </button>

      {/* Two-column layout via responsive inline grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={S.left}>

          {/* Quote Header Card */}
          <div style={S.card}>
            <div style={S.cardTitle}>Quote Details</div>
            <div style={S.quoteNum}>{quote.quote_number}</div>
            <div style={S.statusRow}>
              <Badge label={quote.status?.replace(/_/g, ' ')} variant={quote.status} />
            </div>
            <div style={S.metaRow}>
              <span style={S.metaItem}>Created: <strong style={S.metaVal}>{fmtDate(quote.created_at)}</strong></span>
              <span style={S.metaItem}>Valid Until: <strong style={S.metaVal}>{fmtDate(quote.valid_until)}</strong></span>
              {quote.updated_at && (
                <span style={S.metaItem}>Updated: <strong style={S.metaVal}>{fmtDate(quote.updated_at)}</strong></span>
              )}
            </div>
          </div>

          {/* Customer Info Card */}
          <div style={S.card}>
            <div style={S.cardTitle}>Customer Information</div>
            <div style={S.infoGrid}>
              <div>
                <div style={S.infoLabel}>Name</div>
                <div style={S.infoVal}>{quote.customer_name || '—'}</div>
              </div>
              <div>
                <div style={S.infoLabel}>Phone</div>
                <div style={S.infoVal}>{quote.customer_phone || '—'}</div>
              </div>
              <div>
                <div style={S.infoLabel}>Email</div>
                <div style={S.infoValMuted}>{quote.customer_email || '—'}</div>
              </div>
              <div>
                <div style={S.infoLabel}>Company</div>
                <div style={S.infoValMuted}>{quote.company_name || '—'}</div>
              </div>
            </div>
            {fmtAddr && (
              <div style={{ marginTop: 12 }}>
                <div style={S.infoLabel}>Delivery Address</div>
                <div style={S.addrBox}>{fmtAddr}</div>
              </div>
            )}
          </div>

          {/* Items Table Card */}
          <div style={S.card}>
            <div style={S.cardTitle}>Items ({items.length})</div>
            <div style={S.scrollWrap}>
              <table style={S.table}>
                <thead style={S.thead}>
                  <tr>
                    <th style={S.th}>Product</th>
                    <th style={S.th}>Brand</th>
                    <th style={S.th}>Specifications</th>
                    <th style={S.thRight}>Qty</th>
                    <th style={S.th}>Unit</th>
                    <th style={S.thRight}>Unit Price</th>
                    <th style={S.thRight}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => {
                    const specs = safeJson(it.specifications)
                    const lineTotal = Number(it.unit_price || 0) * Number(it.quantity || 0)
                    return (
                      <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={S.td}>{it.product_name || it.product_id || '—'}</td>
                        <td style={S.tdMuted}>{it.brand || '—'}</td>
                        <td style={S.td}>
                          {specs
                            ? Object.entries(specs).map(([k, v]) => (
                                <span key={k} style={S.specTag}>{k}: {v}</span>
                              ))
                            : <span style={{ color: '#CBD5E1' }}>—</span>
                          }
                        </td>
                        <td style={S.tdRight}>{it.quantity}</td>
                        <td style={S.tdMuted}>{it.unit || '—'}</td>
                        <td style={S.tdRight}>₹{Number(it.unit_price || 0).toLocaleString('en-IN')}</td>
                        <td style={{ ...S.tdRight, fontWeight: 600 }}>₹{lineTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div style={S.totalsWrap}>
              <div style={S.totalRow}>
                <span style={S.totalLabel}>Subtotal</span>
                <span style={S.totalVal}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={S.totalRow}>
                <span style={S.totalLabel}>GST ({gstPct}%)</span>
                <span style={S.totalVal}>₹{gstAmt.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ ...S.totalRow, borderTop: '2px solid #F1F5F9', paddingTop: 8, marginTop: 6 }}>
                <span style={S.grandLabel}>TOTAL</span>
                <span style={S.grandVal}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={S.right}>

          {/* Update Status Card */}
          <div style={S.card}>
            <div style={S.cardTitle}>Update Status</div>

            {msg === 'success' && <div style={S.msgSuccess}>Status updated successfully!</div>}
            {msg === 'error'   && <div style={S.msgError}>Update failed. Please try again.</div>}

            <div style={S.formGroup}>
              <label style={S.label}>New Status</label>
              <select
                style={S.select}
                value={ns}
                onChange={(e) => setNs(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div style={S.formGroup}>
              <label style={S.label}>Admin Notes (internal)</label>
              <textarea
                style={S.textarea}
                value={an}
                onChange={(e) => setAn(e.target.value)}
                placeholder="Internal notes for this quote..."
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <div style={S.formGroup}>
              <label style={S.label}>Message to Customer</label>
              <textarea
                style={S.textarea}
                value={sn}
                onChange={(e) => setSn(e.target.value)}
                placeholder="Status note visible to customer..."
                onFocus={(e) => e.target.style.borderColor = '#F97316'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>

            <Button loading={saving} onClick={handleUpdate} style={{ width: '100%' }}>
              Save Changes
            </Button>
          </div>

          {/* Timeline Card */}
          {timeline.length > 0 && (
            <div style={S.card}>
              <div style={S.cardTitle}>Timeline</div>
              <div style={S.timeline}>
                {timeline.map((t, idx) => (
                  <div key={idx} style={{ ...S.tlItem, paddingBottom: idx < timeline.length - 1 ? 20 : 0 }}>
                    {idx < timeline.length - 1 && <div style={S.tlLine} />}
                    <div
                      style={{
                        ...S.tlDot,
                        background: STATUS_DOT[t.status] || '#94A3B8',
                        boxShadow: `0 0 0 3px ${(STATUS_DOT[t.status] || '#94A3B8')}22`,
                      }}
                    />
                    <div>
                      <div style={S.tlStatus}>{(t.status || '').replace(/_/g, ' ')}</div>
                      {t.note && <div style={S.tlNote}>{t.note}</div>}
                      <div style={S.tlTime}>{fmtTs(t.timestamp || t.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Notes Card */}
          <div style={S.card}>
            <div style={S.cardTitle}>Current Admin Notes</div>
            {quote.admin_notes
              ? <div style={S.notesBox}>{quote.admin_notes}</div>
              : <div style={S.notesEmpty}>No admin notes yet</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
