export default function FormField({ label, children, full = false }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : undefined }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1,
        textTransform: 'uppercase', color: '#003DA5', marginBottom: 5,
      }}>{label}</label>
      {children}
    </div>
  )
}

export const inputStyle = {
  width: '100%', padding: '10px 14px',
  border: '2px solid #D6EEFA', borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  background: '#F8FBFF', color: '#0A1628', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
  minHeight: 44,   /* mínimo táctil recomendado (44px) */
}

const focusBlue = '#009FDA'
const blurColor  = '#D6EEFA'

export function Input({ ...props }) {
  return (
    <input {...props} style={inputStyle}
      onFocus={e => e.target.style.borderColor = focusBlue}
      onBlur={e  => e.target.style.borderColor = blurColor}
    />
  )
}

export function Select({ children, ...props }) {
  return (
    <select {...props} style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
      onFocus={e => e.target.style.borderColor = focusBlue}
      onBlur={e  => e.target.style.borderColor = blurColor}
    >{children}</select>
  )
}

export function Textarea({ ...props }) {
  return (
    <textarea {...props} style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
      onFocus={e => e.target.style.borderColor = focusBlue}
      onBlur={e  => e.target.style.borderColor = blurColor}
    />
  )
}