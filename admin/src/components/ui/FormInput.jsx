const inputStyle = (error) => ({
  width: '100%', border: `1.5px solid ${error ? '#f87171' : '#d1d5db'}`,
  borderRadius: '8px', padding: '8px 12px', fontSize: '14px',
  outline: 'none', background: error ? '#fef2f2' : '#fff',
  color: '#111', boxSizing: 'border-box',
})
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }

export function FormInput({ label, error, required, style: extraStyle = {}, ...props }) {
  return (
    <div>
      {label && (
        <label style={labelStyle}>
          {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input style={{ ...inputStyle(error), ...extraStyle }} {...props}
        onFocus={(e) => { e.target.style.borderColor = '#f97316'; props.onFocus?.(e) }}
        onBlur={(e)  => { e.target.style.borderColor = error ? '#f87171' : '#d1d5db'; props.onBlur?.(e) }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

export function FormSelect({ label, error, required, children, style: extraStyle = {}, ...props }) {
  return (
    <div>
      {label && (
        <label style={labelStyle}>
          {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <select style={{ ...inputStyle(error), ...extraStyle }} {...props}>{children}</select>
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

export function FormTextarea({ label, error, required, style: extraStyle = {}, ...props }) {
  return (
    <div>
      {label && (
        <label style={labelStyle}>
          {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <textarea rows={3} style={{ ...inputStyle(error), resize: 'vertical', ...extraStyle }} {...props}
        onFocus={(e) => { e.target.style.borderColor = '#f97316'; props.onFocus?.(e) }}
        onBlur={(e)  => { e.target.style.borderColor = error ? '#f87171' : '#d1d5db'; props.onBlur?.(e) }}
      />
      {error && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}
