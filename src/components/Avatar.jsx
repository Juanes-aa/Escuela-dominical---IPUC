import { getInitials } from '../lib/utils'

// IPUC-themed gradients
const GRADIENTS = [
  'linear-gradient(135deg,#003DA5,#009FDA)',
  'linear-gradient(135deg,#009FDA,#00C6FF)',
  'linear-gradient(135deg,#001F5B,#003DA5)',
  'linear-gradient(135deg,#F0AB00,#FF8C00)',
  'linear-gradient(135deg,#0070C0,#009FDA)',
]

export default function Avatar({ name = '', src, size = 38, radius = '50%' }) {
  // FIX: charCodeAt puede retornar NaN si name es vacío
  const code = (name && name.length > 0) ? name.charCodeAt(0) : 0
  const grad = GRADIENTS[code % GRADIENTS.length]

  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: size * 0.35, color: 'white', overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,61,165,0.2)',
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        : getInitials(name)
      }
    </div>
  )
}