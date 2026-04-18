export default function Spinner({ size = 'md', color = 'orange' }) {
  const px = { sm: 16, md: 32, lg: 48 }[size] || 32
  const clr = color === 'white' ? '#fff' : color === 'blue' ? '#3b82f6' : '#f97316'
  return (
    <div style={{
      width: px, height: px, borderRadius: '50%',
      border: `3px solid #e5e7eb`,
      borderTopColor: clr,
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block',
    }} />
  )
}
