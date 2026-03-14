import { useEffect, useState } from 'react'
import { getPayments } from '../services/adminApi'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 20 },
  topRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  titleBlock: {},
  title: { fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 },
  statCard: {
    display: 'inline-flex', alignItems: 'center', gap: 12,
    background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10,
    padding: '14px 20px', marginTop: 12,
  },
  statIcon: { fontSize: 22 },
  statLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  statValue: { fontSize: 20, fontWeight: 700, color: '#16A34A' },
  searchInput: {
    border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 14px',
    fontSize: 13, width: 260, outline: 'none', color: '#0F172A',
    background: '#fff',
  },
  card: { background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' },
  scrollWrap: { overflowX: 'auto' },
  spinner: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 192 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  thead: { background: '#F8FAFC' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' },
  tdQuote: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontFamily: 'monospace', fontWeight: 700, color: '#F97316' },
  tdName: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 500, color: '#0F172A' },
  tdTxn: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontFamily: 'monospace', fontSize: 12, color: '#94A3B8' },
  tdAmount: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontWeight: 700, color: '#0F172A' },
  tdMethod: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontSize: 12, color: '#64748B', textTransform: 'capitalize' },
  tdStatus: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9' },
  tdDate: { padding: '11px 16px', borderBottom: '1px solid #F1F5F9', fontSize: 12, color: '#94A3B8' },
  emptyWrap: { padding: '56px 16px', textAlign: 'center' },
  emptyIcon: { fontSize: 32, marginBottom: 10 },
  emptyText: { color: '#94A3B8', fontSize: 14 },
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    getPayments()
      .then((r) => setPayments(Array.isArray(r.data) ? r.data : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? payments.filter((p) =>
        p.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
        p.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.razorpay_payment_id?.includes(search)
      )
    : payments

  const total = payments.filter((p) => p.status === 'captured').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div style={S.page}>
      <div style={S.topRow}>
        <div style={S.titleBlock}>
          <h2 style={S.title}>Payments</h2>
          <div style={S.statCard}>
            <span style={S.statIcon}>💰</span>
            <div>
              <div style={S.statLabel}>Total Captured</div>
              <div style={S.statValue}>₹{total.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
        <input
          style={S.searchInput}
          placeholder="Search quote # or txn ID..."
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
          <div style={S.scrollWrap}>
            <table style={S.table}>
              <thead style={S.thead}>
                <tr>
                  {['Quote #', 'Customer', 'Txn ID', 'Amount', 'Method', 'Status', 'Paid At'].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    style={{ background: '#fff' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={S.tdQuote}>{p.quote_number}</td>
                    <td style={S.tdName}>{p.customer_name}</td>
                    <td style={S.tdTxn}>{p.razorpay_payment_id || '—'}</td>
                    <td style={S.tdAmount}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                    <td style={S.tdMethod}>{p.payment_method || '—'}</td>
                    <td style={S.tdStatus}><Badge label={p.status} variant={p.status} /></td>
                    <td style={S.tdDate}>
                      {p.paid_at ? new Date(p.paid_at).toLocaleString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={7} style={S.emptyWrap}>
                      <div style={S.emptyIcon}>🧾</div>
                      <div style={S.emptyText}>No payments yet</div>
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
