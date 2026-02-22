import Avatar from './Avatar'
import Badge from './Badge'

const C = { blue: '#009FDA', navy: '#003DA5' }

const ROL_CONFIG = {
  'Líder':        { emoji: '👑', color: '#003DA5' },
  'Sublíder':     { emoji: '⭐', color: '#009FDA' },
  'Secretario/a': { emoji: '📋', color: '#6C3BD5' },
  'Tesorero/a':   { emoji: '💰', color: '#F0AB00' },
  'Vocal':        { emoji: '🎙️', color: '#0A8A5A' },
}

function Campo({ label, value, full }) {
  return (
    <div style={{
      gridColumn: full ? '1 / -1' : undefined,
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(0,61,165,0.04)',
      border: '1px solid rgba(0,61,165,0.08)',
    }}>
      <div style={{ fontSize:9, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.blue, marginBottom:4 }}>{label}</div>
      <div style={{
        fontSize: 14,
        color: (value && String(value).trim()) ? '#1A1628' : '#bbb',
        fontWeight: (value && String(value).trim()) ? 500 : 400,
        fontStyle: (value && String(value).trim()) ? 'normal' : 'italic',
      }}>
        {(value && String(value).trim()) ? String(value) : 'No registrado'}
      </div>
    </div>
  )
}

export default function MiembroDetail({ miembro, onClose, onEdit }) {
  if (!miembro) return null
  const cfg = ROL_CONFIG[miembro.rol] ?? ROL_CONFIG['Vocal']

  return (
    <div>
      <style>{`
        .miembro-header { flex-direction: row; }
        .miembro-campos { grid-template-columns: 1fr 1fr; }
        .miembro-btns   { justify-content: flex-end; }
        @media (max-width: 480px) {
          .miembro-header { flex-direction: column; align-items: center; text-align: center; }
          .miembro-campos { grid-template-columns: 1fr !important; }
          .miembro-btns   { flex-direction: column-reverse; }
          .miembro-btns button { width: 100%; }
        }
      `}</style>

      {/* Header perfil */}
      <div className="miembro-header" style={{
        display:'flex', gap:16, alignItems:'center',
        padding:'18px 20px', borderRadius:14, marginBottom:18,
        background:'linear-gradient(135deg, rgba(0,61,165,0.07), rgba(0,159,218,0.05))',
        border:'1px solid rgba(0,61,165,0.1)',
      }}>
        <Avatar name={miembro.nombre||'?'} src={miembro.foto_url} size={72} radius={16} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:19, fontWeight:800, color:C.navy, marginBottom:8, lineHeight:1.2 }}>
            {miembro.nombre || 'Sin nombre'}
          </div>
          <span style={{
            fontSize:13, fontWeight:700, color:cfg.color,
            background:`${cfg.color}18`, padding:'4px 12px', borderRadius:20,
            display:'inline-flex', alignItems:'center', gap:5,
          }}>
            {cfg.emoji} {miembro.rol}
          </span>
        </div>
      </div>

      {/* Datos */}
      <div className="miembro-campos" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <Campo label="Celular"            value={miembro.celular} />
        <Campo label="Correo electrónico" value={miembro.email}   />
        {miembro.notas && <Campo label="Notas" value={miembro.notas} full />}
      </div>

      {/* Botones */}
      <div className="miembro-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
        <button onClick={onClose} style={{
          padding:'10px 22px', background:'rgba(0,61,165,0.07)', color:C.navy,
          border:'1px solid rgba(0,61,165,0.2)', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.07)'}
        >Cerrar</button>
        <button onClick={() => onEdit(miembro)} style={{
          padding:'10px 26px',
          background:'linear-gradient(135deg, #003DA5, #009FDA)',
          color:'white', border:'none', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer',
          boxShadow:'0 4px 14px rgba(0,61,165,0.35)', transition:'transform 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >✏️ Editar</button>
      </div>
    </div>
  )
}