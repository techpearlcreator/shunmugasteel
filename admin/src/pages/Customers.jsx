import { useEffect, useState } from 'react'
import { getCustomers } from '../services/adminApi'
import Spinner from '../components/ui/Spinner'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  titleWrap: { display: 'flex', alignItems: 'baseline', gap: 8 },
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  count: { fontSize: 15, fontWeight: 400, color: '#94A3B8' },
  searchInput: {
    border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 13, width: 260, outline: 'none', color: '#0F172A',
    background: '#fff',
  },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9' },
  tdNum: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#CBD5E1', fontSize: 12 },
  tdName: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 600, color: '#0F172A' },
  tdEmail: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: 13 },
  tdPhone: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: 13 },
  tdSmall: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 12 },
  tdQuotes: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', textAlign: 'center' },
  tdDate: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#94A3B8', fontSize: 12 },
  quoteBadge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, borderRadius: '50%',
    background: '#FFF7ED', color: '#EA580C', fontSize: 12, fontWeight: 700,
  },
  emptyWrap: { padding: '56px 16px', textAlign: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { color: '#94A3B8', fontSize: 14 },
  emptyNote: { color: '#CBD5E1', fontSize: 12, marginTop: 4 },
}

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    getCustomers()
      .then((r) => setCustomers(Array.isArray(r.data) ? r.data : []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? customers.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      )
    : customers

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div style={S.titleWrap}>
          <h2 style={S.title}>Customers</h2>
          <span style={S.count}>({filtered.length})</span>
        </div>
        <input
          style={S.searchInput}
          placeholder="Search name / email / phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#F97316'}
          onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
        />
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <table style={S.table}>
            <thead style={S.thead}>
              <tr>
                {['#', 'Name', 'Email', 'Phone', 'Company', 'City', 'Quotes', 'Joined'].map((h) => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  style={{ background: '#fff' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                >
                  <td style={S.tdNum}>{i + 1}</td>
                  <td style={S.tdName}>{c.name}</td>
                  <td style={S.tdEmail}>{c.email}</td>
                  <td style={S.tdPhone}>{c.phone}</td>
                  <td style={S.tdSmall}>{c.company_name || '—'}</td>
                  <td style={S.tdSmall}>{c.city || '—'}</td>
                  <td style={S.tdQuotes}>
                    <span style={S.quoteBadge}>{c.quote_count}</span>
                  </td>
                  <td style={S.tdDate}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} style={S.emptyWrap}>
                    <div style={S.emptyIcon}>👤</div>
                    <div style={S.emptyText}>No customers yet</div>
                    <div style={S.emptyNote}>Register customers from the public site</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
