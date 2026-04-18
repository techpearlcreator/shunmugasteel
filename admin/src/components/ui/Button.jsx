import Spinner from './Spinner'

const STYLES = {
  primary:   { background: '#f97316', color: '#fff', border: 'none' },
  secondary: { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' },
  danger:    { background: '#ef4444', color: '#fff', border: 'none' },
  ghost:     { background: 'transparent', color: '#6b7280', border: 'none' },
  success:   { background: '#22c55e', color: '#fff', border: 'none' },
  outline:   { background: 'transparent', color: '#f97316', border: '1px solid #f97316' },
}
const SIZES = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
}

export default function Button({ children, variant = 'primary', loading, size = 'md', style = {}, ...props }) {
  return (
    <button
      disabled={loading || props.disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        borderRadius: '8px', fontWeight: 500, cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1, transition: 'opacity 0.15s',
        ...STYLES[variant], ...SIZES[size], ...style,
      }}
      {...props}
    >
      {loading && <Spinner size="sm" color={variant === 'secondary' ? 'orange' : 'white'} />}
      {children}
    </button>
  )
}
