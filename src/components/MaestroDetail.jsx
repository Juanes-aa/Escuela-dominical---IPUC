import Avatar from './Avatar'
import Badge from './Badge'
import { GRUPO_CONFIG } from '../data/ninos'

const C = { blue: '#009FDA', navy: '#003DA5' }

const variantGrupo = clase =>
  clase === 'Pequeños Navegantes'     ? 'Pequeños Navegantes'
  : clase === 'Firmes en el Puerto'   ? 'Firmes en el Puerto'
  : clase === 'Guardianes del Puerto' ? 'Guardianes del Puerto'
  : 'gold'

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

export default function MaestroDetail({ maestro, onClose, onEdit }) {
  if (!maestro) return null
  const cfg = GRUPO_CONFIG[maestro.clase] ?? {}

  return (
    <div>
      <style>{`
        .maestro-header { flex-direction: row; }
        .maestro-campos { grid-template-columns: 1fr 1fr; }
        .maestro-btns   { justify-content: flex-end; }
        @media (max-width: 480px) {
          .maestro-header { flex-direction: column; align-items: center; text-align: center; }
          .maestro-header-badges { justify-content: center !important; }
          .maestro-campos { grid-template-columns: 1fr !important; }
          .maestro-btns   { flex-direction: column-reverse; }
          .maestro-btns button { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Header perfil */}
      <div className="maestro-header" style={{
        display:'flex', gap:16, alignItems:'center',
        padding:'18px 20px', borderRadius:14, marginBottom:18,
        background:'linear-gradient(135deg, rgba(0,61,165,0.07), rgba(0,159,218,0.05))',
        border:'1px solid rgba(0,61,165,0.1)',
      }}>
        <Avatar name={maestro.nombre||'?'} src={maestro.foto_url} size={72} radius={16} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:19, fontWeight:800, color:C.navy, marginBottom:8, lineHeight:1.2 }}>
            {maestro.nombre || 'Sin nombre'}
          </div>
          <div className="maestro-header-badges" style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ fontSize:12, color:C.blue, background:'rgba(0,159,218,0.08)', padding:'3px 10px', borderRadius:20, fontWeight:700, letterSpacing:0.5, textTransform:'uppercase' }}>
              {maestro.rol}
            </span>
            {maestro.clase && (
              <Badge variant={variantGrupo(maestro.clase)}>
                {cfg.emoji ?? '📚'} {maestro.clase}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="maestro-campos" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <Campo label="Celular"            value={maestro.celular} />
        <Campo label="Correo electrónico" value={maestro.email}   />
        <Campo label="Clase asignada"     value={maestro.clase}   full />
      </div>

      {/* Botones */}
      <div className="maestro-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
        <button onClick={onClose} style={{
          padding:'10px 22px', background:'rgba(0,61,165,0.07)', color:C.navy,
          border:'1px solid rgba(0,61,165,0.2)', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.07)'}
        >Cerrar</button>
        <button onClick={() => onEdit(maestro)} style={{
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