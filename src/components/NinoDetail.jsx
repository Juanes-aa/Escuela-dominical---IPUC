import Avatar from './Avatar'
import Badge from './Badge'

const C = { navy: '#003DA5', blue: '#009FDA', yellow: '#F0AB00' }

const GRUPO_EMOJI = {
  'Pequeños Navegantes':   '⛵',
  'Firmes en el Puerto':   '⚓',
  'Guardianes del Puerto': '🛡️',
}

const GRUPO_CHIP = {
  'Pequeños Navegantes':  { bg: '#009FDA', color: '#fff',    border: '#009FDA' },
  'Firmes en el Puerto':  { bg: '#003DA5', color: '#fff',    border: '#003DA5' },
  'Guardianes del Puerto':{ bg: '#F0AB00', color: '#1A1628', border: '#F0AB00' },
}

const DEFAULT_CHIP = { bg: 'rgba(0,61,165,0.08)', color: C.navy, border: 'rgba(0,61,165,0.2)' }

const normalizar = txt =>
  (txt || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

const canonizarGrupo = (grupo = '') => {
  const n = normalizar(grupo)
  if (n.includes('peque') || n.includes('naveg')) return 'Pequeños Navegantes'
  if (n.includes('firme'))                         return 'Firmes en el Puerto'
  if (n.includes('guardian'))                      return 'Guardianes del Puerto'
  return grupo
}

function Campo({ label, value, full }) {
  return (
    <div style={{
      gridColumn: full ? '1 / -1' : undefined,
      padding: '10px 14px', borderRadius: 10,
      background: 'rgba(0,61,165,0.04)',
      border: '1px solid rgba(0,61,165,0.08)',
    }}>
      <div style={{ fontSize:9, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.blue, marginBottom:4 }}>
        {label}
      </div>
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

export default function NinoDetail({ nino, onClose, onEdit }) {
  if (!nino) return null

  const grupoCanon = canonizarGrupo(nino.grupo)
  const chip       = GRUPO_CHIP[grupoCanon] ?? DEFAULT_CHIP
  const emoji      = GRUPO_EMOJI[grupoCanon] || '📌'
  const hasAlert   = nino.alergias && nino.alergias !== 'Ninguna'

  const mesCap = (nino.mes_cumple && typeof nino.mes_cumple === 'string' && nino.mes_cumple.trim())
    ? nino.mes_cumple.charAt(0).toUpperCase() + nino.mes_cumple.slice(1) : ''

  const nombreSeguro = (nino.nombre && nino.nombre.trim()) ? nino.nombre : 'Sin nombre'

  return (
    <div>
      <style>{`
        .nino-detail-header { flex-direction: row; align-items: center; }
        .nino-detail-badges { justify-content: flex-start; }
        .nino-detail-campos { grid-template-columns: 1fr 1fr; }
        .nino-detail-btns   { justify-content: flex-end; flex-direction: row; }
        @media (max-width: 480px) {
          .nino-detail-header { flex-direction: column; align-items: center; text-align: center; }
          .nino-detail-imagen { display: none !important; }
          .nino-detail-badges { justify-content: center !important; flex-wrap: wrap; }
          .nino-detail-campos { grid-template-columns: 1fr !important; }
          .nino-detail-campos > * { grid-column: 1 / -1 !important; }
          .nino-detail-btns   { flex-direction: column-reverse !important; }
          .nino-detail-btns button { width: 100% !important; }
        }
      `}</style>

      {/* Header */}
      <div className="nino-detail-header" style={{
        display:'flex', gap:16,
        padding:'18px 20px', borderRadius:14, marginBottom:18,
        background:'linear-gradient(135deg, rgba(0,61,165,0.07), rgba(0,159,218,0.05))',
        border:'1px solid rgba(0,61,165,0.1)',
      }}>
        <Avatar name={nombreSeguro} src={nino.foto_url||''} size={72} radius={16} />

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:19, fontWeight:800, color:C.navy, marginBottom:10, lineHeight:1.2 }}>
            {nombreSeguro}
          </div>

          <div className="nino-detail-badges" style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>

            {/* ── Chip de grupo — mismo estilo que los filtros de la página ── */}
            {grupoCanon && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 999,
                background: chip.bg, color: chip.color,
                border: `1.5px solid ${chip.border}`,
                fontSize: 13, fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                {emoji} {grupoCanon}
              </span>
            )}

            {/* Mes cumpleaños */}
            {mesCap && (
              <span style={{
                fontSize:12, color:'#555',
                background:'rgba(240,171,0,0.1)',
                border:'1px solid rgba(240,171,0,0.25)',
                padding:'5px 12px', borderRadius:999, fontWeight:600,
              }}>
                🎂 {mesCap}
              </span>
            )}

          </div>
        </div>

        {/* Autorización imagen — solo desktop */}
        <div className="nino-detail-imagen" style={{ textAlign:'center', flexShrink:0 }}>
          <div style={{ fontSize:9, color:'#aaa', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Imagen</div>
          <Badge variant={nino.autorizacion_imagen==='Sí'?'success':'danger'}>
            {nino.autorizacion_imagen==='Sí'?'✓ Sí':'✗ No'}
          </Badge>
        </div>
      </div>

      {/* Alerta médica */}
      {hasAlert && (
        <div style={{
          background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.4)',
          borderRadius:10, padding:'12px 16px', marginBottom:16,
          display:'flex', gap:10, alignItems:'flex-start',
        }}>
          <span style={{ fontSize:20, flexShrink:0 }}>⚠️</span>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:'#92400E', letterSpacing:0.5, marginBottom:3, textTransform:'uppercase' }}>Alerta médica</div>
            <div style={{ fontSize:13, color:'#78350F' }}>{nino.alergias}</div>
          </div>
        </div>
      )}

      {/* Datos */}
      <div className="nino-detail-campos" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <Campo label="EPS"                    value={nino.eps} />
        <Campo label="Fecha de nacimiento"    value={nino.fecha_nacimiento} />
        <Campo label="Dirección"              value={nino.direccion} full />
        <Campo label="Acudiente"              value={nino.acudiente} />
        <Campo label="Parentesco"             value={nino.parentesco} />
        <Campo label="Celular"                value={nino.celular} />
        <Campo label="Acudiente bautizado"    value={nino.acudiente_bautizado} />
        <Campo label="Autorización imagen"    value={nino.autorizacion_imagen} />
      </div>

      {/* Botones */}
      <div className="nino-detail-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
        <button onClick={onClose} style={{
          padding:'10px 22px', background:'rgba(0,61,165,0.07)', color:C.navy,
          border:'1px solid rgba(0,61,165,0.2)', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.07)'}
        >Cerrar</button>
        <button onClick={() => onEdit(nino)} style={{
          padding:'10px 26px', background:'linear-gradient(135deg, #003DA5, #009FDA)',
          color:'white', border:'none', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer',
          boxShadow:'0 4px 14px rgba(0,61,165,0.35)',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >✏️ Editar</button>
      </div>
    </div>
  )
}