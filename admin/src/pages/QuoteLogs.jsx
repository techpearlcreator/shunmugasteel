import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuotes } from '../services/adminApi'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

const STATUSES = ['', 'submitted', 'reviewed', 'confirmed', 'payment_pending', 'paid', 'dispatched', 'cancelled']

const STATUS_COLORS = {
  submitted:       '#F97316',
  reviewed:        '#3B82F6',
  confirmed:       '#8B5CF6',
  payment_pending: '#F59E0B',
  paid:            '#10B981',
  dispatched:      '#06B6D4',
  cancelled:       '#EF4444',
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  titleWrap: { display: 'flex', alignItems: 'baseline', gap: 8 },
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  count: { fontSize: 15, fontWeight: 400, color: '#94A3B8' },
  controls: { display: 'flex', alignItems: 'center', gap: 12 },
  searchInput: {
    border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 13, width: 210, outline: 'none', color: '#0F172A',
    background: '#fff',
  },
  selectInput: {
    border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 13, outline: 'none', color: '#0F172A', background: '#fff',
    cursor: 'pointer',
  },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  scrollWrap: { overflowX: 'auto' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' },
  td: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#0F172A' },
  tdMono: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontFamily: 'monospace', fontWeight: 700, color: '#F97316', whiteSpace: 'nowrap' },
  tdName: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 500, color: '#0F172A' },
  tdPhone: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B' },
  tdCenter: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', color: '#64748B', textAlign: 'center' },
  tdAmount: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' },
  tdDate: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8' },
  tdView: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9' },
  viewLink: { fontSize: 12, color: '#3B82F6', fontWeight: 500 },
  emptyWrap: { padding: '56px 16px', textAlign: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { color: '#94A3B8', fontSize: 14 },
  statusDot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', marginRight: 6 },
}

export default function QuoteLogs() {
  const navigate = useNavigate()
  const [quotes, setQuotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [sf, setSf]           = useState('')
  const [search, setSearch]   = useState('')

  const load = (s) => {
    setLoading(true)
    getQuotes(s || undefined)
      .then((r) => setQuotes(Array.isArray(r.data) ? r.data : []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = search
    ? quotes.filter((q) =>
        q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
        q.customer_name?.toLowerCase().includes(search.toLowerCase())
      )
    : quotes

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div style={S.titleWrap}>
          <h2 style={S.title}>Quote Logs</h2>
          <span style={S.count}>({filtered.length})</span>
        </div>
        <div style={S.controls}>
          <input
            style={S.searchInput}
            placeholder="Search quote # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#F97316'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
          <select
            style={S.selectInput}
            value={sf}
            onChange={(e) => { setSf(e.target.value); load(e.target.value) }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Statuses'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={S.card}>
        {loading ? (
          <div style={S.spinner}><Spinner /></div>
        ) : (
          <div style={S.scrollWrap}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  {['Quote #', 'Customer', 'Phone', 'Items', 'Amount', 'Status', 'Valid Until', 'Date', ''].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    style={{ background: '#fff', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    onClick={() => navigate('/quotes/' + q.id)}
                  >
                    <td style={S.tdMono}>{q.quote_number}</td>
                    <td style={S.tdName}>{q.customer_name}</td>
                    <td style={S.tdPhone}>{q.customer_phone}</td>
                    <td style={S.tdCenter}>{q.item_count}</td>
                    <td style={S.tdAmount}>₹{Number(q.total_amount).toLocaleString('en-IN')}</td>
                    <td style={S.td}>
                      <Badge label={q.status.replace(/_/g, ' ')} variant={q.status} />
                    </td>
                    <td style={S.tdDate}>
                      {q.valid_until ? new Date(q.valid_until).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={S.tdDate}>{new Date(q.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={S.tdView}>
                      <span style={S.viewLink}>View →</span>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={9} style={S.emptyWrap}>
                      <div style={S.emptyIcon}>📋</div>
                      <div style={S.emptyText}>No quotes found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
