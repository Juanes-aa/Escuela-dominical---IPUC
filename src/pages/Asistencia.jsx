import { useState } from 'react'
import Avatar from '../components/Avatar'
import { GRUPOS, GRUPO_CONFIG } from '../data/ninos'
import { formatDate } from '../lib/utils'

const C = { blue:'#009FDA', navy:'#003DA5', yellow:'#F0AB00' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const normalizar = txt =>
  (txt || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

// Mapea cualquier variación de nombre de grupo al nombre canónico
const canonizarGrupo = (grupo = '') => {
  const n = normalizar(grupo)
  if (n.includes('peque') || n.includes('naveg')) return 'Pequeños Navegantes'
  if (n.includes('firme')) return 'Firmes en el Puerto'
  if (n.includes('guardian')) return 'Guardianes del Puerto'
  for (const g of GRUPOS) {
    if (normalizar(g) === n) return g
  }
  return grupo
}

function generarDomingos2026() {
  const domingos = []
  const fecha = new Date(2026, 0, 1)
  while (fecha.getFullYear() === 2026) {
    if (fecha.getDay() === 0) domingos.push(fecha.toISOString().split('T')[0])
    fecha.setDate(fecha.getDate() + 1)
  }
  return domingos
}
const DOMINGOS_2026 = generarDomingos2026()

export default function Asistencia({ ninos, asistencia, toggleAsistencia }) {
  const [fecha, setFecha] = useState(DOMINGOS_2026[0])
  const [grupo, setGrupo] = useState(GRUPOS[0])
  const [modo,  setModo]  = useState('ver')

  const presentes = asistencia[fecha] ?? []

  // Usar canonizarGrupo para que coincidan independientemente del texto exacto en BD
  const enGrupo = ninos.filter(n => canonizarGrupo(n.grupo) === grupo)
  const totalPresentes = enGrupo.filter(n => presentes.includes(n.id)).length

  return (
    <div>
      <style>{`
        .asistencia-panel-inner { flex-direction: row; align-items: flex-end; }
        .asistencia-tabs { flex-wrap: nowrap; overflow-x: auto; width: auto; }
        .asistencia-tabs button { flex-shrink: 0; }
        @media (max-width: 600px) {
          .asistencia-panel-inner { flex-direction: column !important; align-items: stretch !important; gap: 14px !important; }
          .asistencia-select { width: 100% !important; }
          .asistencia-modos { width: 100%; }
          .asistencia-modos button { flex: 1; }
          .asistencia-tabs { width: 100% !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:C.navy, margin:'0 0 2px' }}>
          📋 Asistencia 2026
        </h1>
        <p style={{ color:'#555', fontSize:13, margin:0 }}>Registro de asistencia por domingo</p>
      </div>

      {/* Panel superior */}
      <div style={{ ...glass, borderRadius:20, padding:'18px 20px', marginBottom:18 }}>
        <div className="asistencia-panel-inner" style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'flex-end' }}>

          {/* Selector de fecha */}
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.navy, marginBottom:6 }}>Domingo</div>
            <select
              className="asistencia-select"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              style={{
                width:'100%', padding:'10px 14px', borderRadius:10,
                border:'1px solid rgba(0,61,165,0.2)',
                background:'rgba(255,255,255,0.6)', backdropFilter:'blur(6px)',
                fontSize:14,
              }}
            >
              {DOMINGOS_2026.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}
            </select>
          </div>

          {/* Modo */}
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.navy, marginBottom:6 }}>Modo</div>
            <div className="asistencia-modos" style={{ display:'flex', gap:8 }}>
              {['ver','marcar'].map(m => (
                <button key={m} onClick={() => setModo(m)} style={{
                  padding:'10px 18px', borderRadius:10,
                  border:'1px solid rgba(0,61,165,0.15)',
                  background: modo===m ? 'linear-gradient(135deg,#003DA5,#009FDA)' : 'rgba(255,255,255,0.4)',
                  color: modo===m ? 'white' : C.navy,
                  fontWeight:600, cursor:'pointer', fontSize:14,
                }}>
                  {m==='ver' ? '👁️ Ver' : '✏️ Marcar'}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs de grupos */}
      <div className="asistencia-tabs" style={{
        ...glass, borderRadius:16, padding:6, marginBottom:16,
        display:'flex', gap:6, width:'fit-content', maxWidth:'100%',
        overflowX:'auto',
      }}>
        {GRUPOS.map(g => {
          const active = grupo === g
          const cfg = GRUPO_CONFIG[g] ?? {}
          return (
            <button key={g} onClick={() => setGrupo(g)} style={{
              padding:'8px 14px', borderRadius:10, border:'none', cursor:'pointer',
              background: active ? 'linear-gradient(135deg,#003DA5,#009FDA)' : 'transparent',
              color: active ? 'white' : '#444',
              fontWeight: active ? 700 : 500,
              whiteSpace:'nowrap', fontSize:13,
            }}>
              {cfg.emoji} {g}
            </button>
          )
        })}
      </div>

      {/* Contador */}
      <div style={{ marginBottom:10, fontSize:13, color:'#555', fontWeight:600 }}>
        <span style={{ color:'#065F46', fontWeight:800 }}>{totalPresentes}</span> / {enGrupo.length} presentes
      </div>

      {/* Lista */}
      <div style={{ ...glass, borderRadius:20, overflow:'hidden' }}>
        {enGrupo.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'#aaa' }}>Sin niños en este grupo</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <tbody>
              {enGrupo.map(n => {
                const presente = presentes.includes(n.id)
                return (
                  <tr key={n.id} style={{
                    borderBottom:'1px solid rgba(0,61,165,0.06)',
                    background: presente ? 'rgba(16,185,129,0.08)' : 'transparent',
                  }}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Avatar name={n.nombre} size={34} />
                        <span style={{ fontWeight:600, fontSize:14 }}>{n.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', textAlign:'right', whiteSpace:'nowrap' }}>
                      {modo === 'ver' ? (
                        <span style={{ fontWeight:600, fontSize:13, color: presente ? '#065F46' : '#991B1B' }}>
                          {presente ? '✔ Presente' : 'Ausente'}
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={presente}
                          onChange={() => toggleAsistencia(fecha, n.id)}
                          style={{ width:22, height:22, cursor:'pointer', accentColor:C.navy }}
                        />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}