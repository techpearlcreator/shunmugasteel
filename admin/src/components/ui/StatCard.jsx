const COLOR_MAP = {
  orange: { bg: '#FFF7ED', color: '#EA580C' },
  blue:   { bg: '#EFF6FF', color: '#2563EB' },
  green:  { bg: '#F0FDF4', color: '#16A34A' },
  purple: { bg: '#FAF5FF', color: '#9333EA' },
  red:    { bg: '#FFF1F2', color: '#E11D48' },
  teal:   { bg: '#F0FDFA', color: '#0D9488' },
}

export default function StatCard({ label, value, icon, sub, color = 'orange' }) {
  const { bg, color: clr } = COLOR_MAP[color] || COLOR_MAP.orange
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bg, color: clr, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '26px', fontWeight: 700, color: '#1f2937', lineHeight: 1.1 }}>{value ?? 0}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>{sub}</div>}
      </div>
    </div>
  )
}
