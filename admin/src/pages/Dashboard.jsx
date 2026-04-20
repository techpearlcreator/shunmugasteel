import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getDashboard } from '../services/adminApi'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'

const STATUS_ORDER = ['submitted', 'reviewed', 'confirmed', 'payment_pending', 'paid', 'dispatched', 'cancelled']

const STATUS_COLOR = {
  submitted: '#3B82F6', reviewed: '#EAB308', confirmed: '#8B5CF6',
  payment_pending: '#F59E0B', paid: '#22C55E',
  dispatched: '#14B8A6', cancelled: '#EF4444',
}

const STAT_CARDS = (d) => [
  { label: 'Total Quotes',   value: d.total_quotes,    color: '#3B82F6', bg: '#EFF6FF',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: 'Pending Review', value: d.pending_quotes,  color: '#F97316', bg: '#FFF7ED', sub: 'Need action',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg> },
  { label: 'Total Revenue',  value: `₹${Number(d.total_revenue||0).toLocaleString('en-IN')}`, color: '#22C55E', bg: '#F0FDF4',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: 'Customers',      value: d.total_customers, color: '#8B5CF6', bg: '#FAF5FF',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Products',       value: d.total_products,  color: '#14B8A6', bg: '#F0FDFA',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { label: 'Categories',     value: d.total_categories,color: '#EC4899', bg: '#FDF2F8',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then((r) => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Spinner size="lg" />
    </div>
  )

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#EF4444' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>Failed to load dashboard</div>
      <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 6 }}>Check backend server is running</div>
    </div>
  )

  const cards = STAT_CARDS(data)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: '4px 0 0' }}>Welcome back — here's what's happening.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {cards.map((c) => (
          <div key={c.label} style={{
            background: '#fff', borderRadius: 14, padding: '20px 18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{c.value ?? 0}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{c.label}</div>
              {c.sub && <div style={{ fontSize: 11, color: c.color, marginTop: 3, fontWeight: 500 }}>{c.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue Chart */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Monthly Revenue</h3>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>Last 6 months</p>
            </div>
          </div>
          {data.monthly_revenue?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.monthly_revenue} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: 10, border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13 }}
                />
                <Bar dataKey="revenue" fill="#F97316" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#CBD5E1' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              <span style={{ fontSize: 13 }}>No revenue data yet</span>
            </div>
          )}
        </div>

        {/* Quote Status */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Quotes by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {STATUS_ORDER.map((status) => {
              const count = data.recent_quotes?.filter((q) => q.status === status).length || 0
              const color = STATUS_COLOR[status] || '#64748B'
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#475569', textTransform: 'capitalize' }}>{status.replace(/_/g,' ')}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: count > 0 ? color : '#CBD5E1' }}>{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Quotes Table */}
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Recent Quotes</h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>Latest customer quote requests</p>
          </div>
          <button onClick={() => navigate('/quotes')} style={{ background: '#FFF7ED', border: 'none', color: '#F97316', fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: 'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Quote #','Customer','Phone','Amount','Status','Date'].map((h) => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recent_quotes?.slice(0,8).map((q, i) => (
                <tr key={q.id} onClick={() => navigate(`/quotes/${q.id}`)}
                  style={{ borderTop: '1px solid #F1F5F9', cursor: 'pointer', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#FFF7ED'}
                  onMouseOut={(e)  => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: '#F97316' }}>{q.quote_number}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0F172A' }}>{q.customer_name}</td>
                  <td style={{ padding: '14px 20px', color: '#64748B' }}>{q.customer_phone}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0F172A' }}>₹{Number(q.total_amount).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px' }}><Badge label={q.status.replace(/_/g,' ')} variant={q.status} /></td>
                  <td style={{ padding: '14px 20px', color: '#94A3B8', fontSize: 12 }}>{new Date(q.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!data.recent_quotes?.length && (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#CBD5E1' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                    <div style={{ fontSize: 14 }}>No quotes yet</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
