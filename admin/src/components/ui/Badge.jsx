const STYLES = {
  submitted:       { background: '#dbeafe', color: '#1d4ed8' },
  reviewed:        { background: '#fef9c3', color: '#a16207' },
  confirmed:       { background: '#e0e7ff', color: '#4338ca' },
  payment_pending: { background: '#ffedd5', color: '#c2410c' },
  paid:            { background: '#dcfce7', color: '#15803d' },
  dispatched:      { background: '#ccfbf1', color: '#0f766e' },
  cancelled:       { background: '#fee2e2', color: '#dc2626' },
  active:          { background: '#dcfce7', color: '#15803d' },
  inactive:        { background: '#f3f4f6', color: '#6b7280' },
  in_stock:        { background: '#dcfce7', color: '#15803d' },
  out_of_stock:    { background: '#fee2e2', color: '#dc2626' },
  made_to_order:   { background: '#fef9c3', color: '#a16207' },
  captured:        { background: '#dcfce7', color: '#15803d' },
  failed:          { background: '#fee2e2', color: '#dc2626' },
  created:         { background: '#f3f4f6', color: '#6b7280' },
}

export default function Badge({ label, variant }) {
  const key = (variant || label || '').toLowerCase().replace(/\s/g, '_')
  const s = STYLES[key] || { background: '#f3f4f6', color: '#374151' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: '999px',
      fontSize: '11px', fontWeight: 600,
      background: s.background, color: s.color,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}
