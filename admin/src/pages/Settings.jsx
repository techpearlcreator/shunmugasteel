import { useEffect, useState } from 'react'
import { getSettings, saveSettings, getProducts } from '../services/adminApi'
import Spinner from '../components/ui/Spinner'

const iStyle = {
  width: '100%', border: '1.5px solid #E2E8F0', borderRadius: 8,
  padding: '10px 13px', fontSize: 14, outline: 'none',
  background: '#fff', color: '#0F172A', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}
const lStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }

function Field({ label, children }) {
  return (
    <div>
      <label style={lStyle}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={iStyle}
      onFocus={(e)  => e.target.style.borderColor = '#F97316'}
      onBlur={(e)   => e.target.style.borderColor = '#E2E8F0'}
    />
  )
}

function Select({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} style={iStyle}>
      {children}
    </select>
  )
}

const TABS = [
  { k: 'general',    label: 'Company',     icon: '🏢' },
  { k: 'quote',      label: 'Quotes',      icon: '📄' },
  { k: 'hurry_deal', label: 'Deal Banner', icon: '🔥' },
  { k: 'tax',        label: 'GST & Tax',   icon: '🧾' },
]

export default function Settings() {
  const [company,  setCompany]  = useState({})
  const [tax,      setTax]      = useState([])
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState({ text: '', ok: true })
  const [tab,      setTab]      = useState('general')

  useEffect(() => {
    Promise.all([
      getSettings(),
      getProducts(),
    ]).then(([settingsRes, productsRes]) => {
      const m = {}
      settingsRes.data.company.forEach((s) => { m[s.setting_key] = s.setting_value })
      setCompany(m)
      setTax(Array.isArray(settingsRes.data.tax) ? settingsRes.data.tax : [])
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const set   = (k, v) => setCompany((p) => ({ ...p, [k]: v }))
  const setTV = (k, v) => setTax((p) => p.map((t) => t.setting_key === k ? { ...t, setting_value: v } : t))

  const handleSave = async () => {
    setSaving(true)
    const taxObj = {}
    tax.forEach((t) => { taxObj[t.setting_key] = t.setting_value })
    try {
      await saveSettings({ company, tax: taxObj })
      setMsg({ text: 'Settings saved successfully!', ok: true })
    } catch {
      setMsg({ text: 'Failed to save. Try again.', ok: false })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg({ text: '', ok: true }), 3000)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Spinner size="lg" />
    </div>
  )

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#0F172A' }}>Settings</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8' }}>Configure company, quotes, deals and tax</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: saving ? '#94A3B8' : '#F97316', color: '#fff',
          border: 'none', borderRadius: 10, padding: '11px 22px',
          fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
        }}>
          {saving ? <Spinner size="sm" color="white" /> : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Toast */}
      {msg.text && (
        <div style={{
          padding: '12px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
          background: msg.ok ? '#F0FDF4' : '#FEF2F2',
          color: msg.ok ? '#15803D' : '#DC2626',
          border: `1px solid ${msg.ok ? '#BBF7D0' : '#FECACA'}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {msg.ok ? '✅' : '❌'} {msg.text}
        </div>
      )}

      {/* Tab + Content Card */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9', padding: '0 8px' }}>
          {TABS.map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '16px 16px 14px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: tab === t.k ? 700 : 500,
              color: tab === t.k ? '#F97316' : '#94A3B8',
              borderBottom: `2px solid ${tab === t.k ? '#F97316' : 'transparent'}`,
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '28px' }}>

          {/* COMPANY */}
          {tab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={gridStyle}>
                <Field label="Company Name"><Input value={company.company_name||''} onChange={(e)=>set('company_name',e.target.value)} /></Field>
                <Field label="Tagline"><Input value={company.company_tagline||''} onChange={(e)=>set('company_tagline',e.target.value)} placeholder="Est. 1976 — Quality Steel" /></Field>
                <Field label="GST Number"><Input value={company.company_gstin||''} onChange={(e)=>set('company_gstin',e.target.value)} placeholder="22AAAAA0000A1Z5" /></Field>
                <Field label="Phone"><Input value={company.company_phone||''} onChange={(e)=>set('company_phone',e.target.value)} /></Field>
                <Field label="WhatsApp Number"><Input value={company.company_whatsapp||''} onChange={(e)=>set('company_whatsapp',e.target.value)} /></Field>
                <Field label="Email"><Input value={company.company_email||''} onChange={(e)=>set('company_email',e.target.value)} /></Field>
              </div>
              <Field label="Full Address">
                <textarea value={company.company_address||''} onChange={(e)=>set('company_address',e.target.value)}
                  rows={2} style={{ ...iStyle, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor='#F97316'}
                  onBlur={(e)  => e.target.style.borderColor='#E2E8F0'} />
              </Field>
              <div style={gridStyle}>
                <Field label="City"><Input value={company.company_city||''} onChange={(e)=>set('company_city',e.target.value)} /></Field>
                <Field label="Pincode"><Input value={company.company_pincode||''} onChange={(e)=>set('company_pincode',e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* QUOTE SETTINGS */}
          {tab === 'quote' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ maxWidth: 320 }}>
                <Field label="Quote Number Prefix"><Input value={company.quote_prefix||'SST'} onChange={(e)=>set('quote_prefix',e.target.value)} placeholder="SST" /></Field>
              </div>
              <Field label="Quote Footer Terms & Conditions">
                <textarea value={company.quote_footer_terms||''} onChange={(e)=>set('quote_footer_terms',e.target.value)}
                  rows={4} style={{ ...iStyle, resize: 'vertical' }}
                  onFocus={(e) => e.target.style.borderColor='#F97316'}
                  onBlur={(e)  => e.target.style.borderColor='#E2E8F0'}
                  placeholder="1. Prices are subject to change without notice.&#10;2. Delivery within 7-10 working days..." />
              </Field>
            </div>
          )}

          {/* HURRY DEAL */}
          {tab === 'hurry_deal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>
                When enabled, a countdown banner appears on the home page linking to a featured product.
              </p>

              {/* Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ position: 'relative', width: 48, height: 26, flexShrink: 0 }}>
                  <input type="checkbox" id="hurry_toggle"
                    checked={company.hurry_deal_enabled === '1'}
                    onChange={(e) => set('hurry_deal_enabled', e.target.checked ? '1' : '0')}
                    style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                  />
                  <label htmlFor="hurry_toggle" style={{
                    display: 'block', width: 48, height: 26, borderRadius: 13,
                    background: company.hurry_deal_enabled === '1' ? '#F97316' : '#CBD5E1',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 3, left: company.hurry_deal_enabled === '1' ? 25 : 3,
                      width: 20, height: 20, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </label>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    {company.hurry_deal_enabled === '1' ? '🔥 Banner is LIVE' : 'Banner is OFF'}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Toggle to show/hide the deal banner on the public site</div>
                </div>
              </div>

              {company.hurry_deal_enabled === '1' && (
                <div style={{ padding: '12px 16px', background: '#FFF7ED', borderRadius: 10, border: '1px solid #FED7AA', fontSize: 13, color: '#C2410C' }}>
                  🔥 Deal banner is currently <strong>live</strong> on the website. Ends: {company.hurry_deal_end_at || 'not set'}
                </div>
              )}

              <div style={gridStyle}>
                <Field label="Banner Title">
                  <Input value={company.hurry_deal_title||''} onChange={(e)=>set('hurry_deal_title',e.target.value)} placeholder="Hurry! Flash Deal On HR Coils" />
                </Field>
                <Field label="Banner Subtitle">
                  <Input value={company.hurry_deal_subtitle||''} onChange={(e)=>set('hurry_deal_subtitle',e.target.value)} placeholder="Special bulk pricing — limited time only" />
                </Field>
                <Field label="Product (for Deal Link)">
                  <select value={company.hurry_deal_product_slug||''} onChange={(e)=>set('hurry_deal_product_slug',e.target.value)} style={iStyle}
                    onFocus={(e) => e.target.style.borderColor='#F97316'}
                    onBlur={(e)  => e.target.style.borderColor='#E2E8F0'}>
                    <option value="">— Select a Product —</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.slug}>{p.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Offer End Date & Time">
                  <input type="datetime-local" value={company.hurry_deal_end_at||''} onChange={(e)=>set('hurry_deal_end_at',e.target.value)}
                    style={iStyle}
                    onFocus={(e) => e.target.style.borderColor='#F97316'}
                    onBlur={(e)  => e.target.style.borderColor='#E2E8F0'} />
                </Field>
              </div>
            </div>
          )}

          {/* GST & TAX */}
          {tab === 'tax' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>These rates are applied to all quotes and invoices.</p>
              <div style={gridStyle}>
                {tax.map((t) => (
                  <div key={t.setting_key}>
                    <label style={lStyle}>{t.label || t.setting_key}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                      <input type="number" step="0.01" value={t.setting_value}
                        onChange={(e) => setTV(t.setting_key, e.target.value)}
                        style={{ ...iStyle, borderRadius: '8px 0 0 8px', borderRight: 'none' }}
                        onFocus={(e) => e.target.style.borderColor='#F97316'}
                        onBlur={(e)  => e.target.style.borderColor='#E2E8F0'}
                      />
                      <div style={{ background: '#F1F5F9', border: '1.5px solid #E2E8F0', borderLeft: 'none', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#64748B', fontWeight: 600 }}>%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
