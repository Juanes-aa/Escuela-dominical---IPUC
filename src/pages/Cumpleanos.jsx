import { useState } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import CumpleCard from '../components/Cumplecard'
import { MESES, GRUPO_CONFIG } from '../data/ninos'
import { calcAge } from '../lib/utils'

const C = { blue: '#009FDA', navy: '#003DA5', yellow: '#F0AB00' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const diasEnMes = (mesIdx) => new Date(2026, mesIdx + 1, 0).getDate()
const primerDia = (mesIdx) => new Date(2026, mesIdx, 1).getDay()

const variantGrupo = g =>
  g === 'Pequeños Navegantes' ? 'Pequeños Navegantes'
  : g === 'Firmes en el Puerto' ? 'Firmes en el Puerto'
  : 'Guardianes del puerto'

const CM = '#059669' // verde maestros

export default function Cumpleanos({ ninos, maestros = [] }) {
  const mesActual = new Date().getMonth()
  const [mesIdx, setMesIdx] = useState(mesActual)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [ninoCard, setNinoCard] = useState(null)

  const mesNombre = MESES[mesIdx]
  const totalDias = diasEnMes(mesIdx)
  const offset    = primerDia(mesIdx)

  const ninesMes = ninos.filter(n => n.fecha_nacimiento && new Date(n.fecha_nacimiento).getMonth() === mesIdx)
  const maestrosMes = maestros.filter(m => m.fecha_nacimiento && new Date(m.fecha_nacimiento).getMonth() === mesIdx)

  // porDia: { dia: { ninos: [], maestros: [] } }
  const porDia = {}
  const addToDia = (dia, tipo, obj) => {
    if (!porDia[dia]) porDia[dia] = { ninos: [], maestros: [] }
    porDia[dia][tipo].push(obj)
  }
  ninesMes.forEach(n => addToDia(n.fecha_nacimiento ? parseInt(n.fecha_nacimiento.split('-')[2]) : 0, 'ninos', n))
  maestrosMes.forEach(m => addToDia(m.fecha_nacimiento ? parseInt(m.fecha_nacimiento.split('-')[2]) : 0, 'maestros', m))

  const diaSel = diaSeleccionado ? (porDia[diaSeleccionado] ?? { ninos: [], maestros: [] }) : { ninos: [], maestros: [] }

  const prevMes = () => { setMesIdx(m => (m + 11) % 12); setDiaSeleccionado(null) }
  const nextMes = () => { setMesIdx(m => (m + 1)  % 12); setDiaSeleccionado(null) }

  return (
    <div>
      <style>{`
        .cumple-grid { grid-template-columns: 1fr 340px; }
        .cal-dia { min-height: 72px; padding: 6px 7px; }
        .cal-dia-num { width: 26px; height: 26px; font-size: 13px; }
        .cal-avatar-row { display: flex; }
        @media (max-width: 768px) {
          .cumple-grid { grid-template-columns: 1fr !important; }
          .cal-dia { min-height: 48px !important; padding: 4px 3px !important; }
          .cal-dia-num { width: 22px !important; height: 22px !important; font-size: 11px !important; margin-bottom: 2px !important; }
          .cal-avatar-row { display: none !important; }
          .cal-mas { display: none !important; }
          .cal-punto { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:24, fontWeight:800, color:C.navy, margin:'0 0 2px' }}>
          🎂 Cumpleaños
        </h1>
        <p style={{ color:'#555', fontSize:13, margin:0 }}>Calendario de cumpleaños por mes</p>
      </div>

      <div className="cumple-grid" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>

        {/* ── CALENDARIO ── */}
        <div style={{ ...glass, borderRadius:20, overflow:'hidden' }}>

          {/* Header mes */}
          <div style={{ background:'linear-gradient(135deg,#003DA5,#009FDA)', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <button onClick={prevMes} style={{ width:34, height:34, borderRadius:10, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            >‹</button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color:'white', textTransform:'capitalize', letterSpacing:0.5 }}>{mesNombre}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{ninesMes.length + maestrosMes.length} cumpleaños este mes</div>
            </div>
            <button onClick={nextMes} style={{ width:34, height:34, borderRadius:10, border:'1px solid rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            >›</button>
          </div>

          {/* Días semana */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'rgba(0,61,165,0.06)', borderBottom:'1px solid rgba(0,61,165,0.1)' }}>
            {DIAS_SEMANA.map(d => (
              <div key={d} style={{ padding:'8px 4px', textAlign:'center', fontSize:11, fontWeight:800, letterSpacing:0.8, color:C.navy, textTransform:'uppercase' }}>{d}</div>
            ))}
          </div>

          {/* Grid de días */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:0 }}>
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className="cal-dia" style={{ borderRight:'1px solid rgba(0,61,165,0.06)', borderBottom:'1px solid rgba(0,61,165,0.06)', background:'rgba(0,0,0,0.01)' }} />
            ))}
            {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
              const entry    = porDia[dia] ?? { ninos: [], maestros: [] }
              const total    = entry.ninos.length + entry.maestros.length
              const tieneCump = total > 0
              const soloMaestros = entry.ninos.length === 0 && entry.maestros.length > 0
              const esHoy    = mesIdx === mesActual && dia === new Date().getDate()
              const seleccionado = diaSeleccionado === dia
              const bgColor  = soloMaestros ? 'rgba(5,150,105,0.08)' : tieneCump ? 'rgba(0,159,218,0.06)' : 'transparent'
              const bgHover  = soloMaestros ? 'rgba(5,150,105,0.15)' : 'rgba(0,159,218,0.1)'
              return (
                <div key={dia}
                  className="cal-dia"
                  onClick={() => tieneCump && setDiaSeleccionado(seleccionado ? null : dia)}
                  style={{
                    borderRight:'1px solid rgba(0,61,165,0.06)', borderBottom:'1px solid rgba(0,61,165,0.06)',
                    cursor: tieneCump ? 'pointer' : 'default',
                    background: seleccionado ? 'rgba(240,171,0,0.15)' : bgColor,
                    transition:'background 0.15s', position:'relative',
                  }}
                  onMouseEnter={e => { if(tieneCump&&!seleccionado) e.currentTarget.style.background=bgHover }}
                  onMouseLeave={e => { if(!seleccionado) e.currentTarget.style.background=tieneCump?bgColor:'transparent' }}
                >
                  <div className="cal-dia-num" style={{ borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:esHoy?800:500, background:esHoy?C.navy:seleccionado?C.yellow:'transparent', color:esHoy||seleccionado?'white':'#333', marginBottom:4 }}>{dia}</div>

                  {/* Avatars niños (azul) */}
                  {entry.ninos.slice(0,1).map(n => (
                    <div className="cal-avatar-row" key={n.id} style={{ alignItems:'center', gap:4, marginBottom:2, overflow:'hidden' }}>
                      <Avatar name={n.nombre} size={16} />
                      <span style={{ fontSize:10, fontWeight:600, color:C.navy, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:55 }}>{n.nombre.split(' ')[0]}</span>
                    </div>
                  ))}
                  {/* Avatars maestros (verde) */}
                  {entry.maestros.slice(0,1).map(m => (
                    <div className="cal-avatar-row" key={m.id} style={{ alignItems:'center', gap:4, marginBottom:2, overflow:'hidden' }}>
                      <Avatar name={m.nombre} size={16} />
                      <span style={{ fontSize:10, fontWeight:600, color:CM, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:55 }}>{m.nombre.split(' ')[0]}</span>
                    </div>
                  ))}
                  {total > 2 && <div className="cal-mas" style={{ fontSize:10, color:'#888', fontWeight:700 }}>+{total-2} más</div>}

                  {/* Puntos en móvil */}
                  {tieneCump && (
                    <div className="cal-punto" style={{ display:'none', gap:3, justifyContent:'center', margin:'2px auto 0' }}>
                      {entry.ninos.length > 0  && <span style={{ width:6, height:6, borderRadius:'50%', background:C.blue,  display:'inline-block' }} />}
                      {entry.maestros.length > 0 && <span style={{ width:6, height:6, borderRadius:'50%', background:CM, display:'inline-block' }} />}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Leyenda */}
          <div style={{ padding:'10px 16px', borderTop:'1px solid rgba(0,61,165,0.08)', display:'flex', gap:16, fontSize:11, color:'#888', flexWrap:'wrap', alignItems:'center' }}>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:'rgba(0,159,218,0.35)', display:'inline-block' }} /> Niños</span>
            <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:'rgba(5,150,105,0.35)', display:'inline-block' }} /> Maestros</span>
            <span>🟡 Seleccionado</span>
            <span>
              <span style={{ background:C.navy, color:'white', borderRadius:'50%', width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, verticalAlign:'middle', marginRight:4 }}>{new Date().getDate()}</span>
              Hoy
            </span>
          </div>
        </div>

        {/* ── PANEL LATERAL ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Selector mes */}
          <div style={{ ...glass, borderRadius:16, padding:14 }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.navy, marginBottom:10 }}>Mes</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
              {MESES.map((m, i) => {
                const cnt = [...ninos, ...maestros].filter(n => n.fecha_nacimiento && new Date(n.fecha_nacimiento).getMonth()===i).length
                const active = mesIdx===i
                return (
                  <button key={m} onClick={() => { setMesIdx(i); setDiaSeleccionado(null) }} style={{
                    padding:'6px 4px', borderRadius:8, border:'none', cursor:'pointer',
                    background: active ? C.navy : 'rgba(0,61,165,0.06)',
                    color: active ? 'white' : '#555',
                    fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:active?700:500,
                    transition:'all 0.15s', textAlign:'center',
                  }}>
                    <div style={{ textTransform:'capitalize' }}>{m.slice(0,3)}</div>
                    {cnt>0 && <div style={{ fontSize:13, fontWeight:800, color:active?C.yellow:C.blue }}>{cnt}</div>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detalle día / lista mes */}
          {diaSeleccionado && (diaSel.ninos.length + diaSel.maestros.length) > 0 ? (
            <div style={{ ...glass, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.navy, marginBottom:12 }}>
                🎂 {diaSeleccionado} de {mesNombre}
              </div>
              {diaSel.ninos.map(n => {
                const cfg = GRUPO_CONFIG[n.grupo] ?? {}
                return (
                  <div key={n.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(0,61,165,0.07)' }}>
                    <Avatar name={n.nombre} src={n.foto_url} size={44} radius={10} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:'#1A1628', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{n.nombre}</div>
                      <Badge variant={variantGrupo(n.grupo)}>{cfg.emoji} {n.grupo}</Badge>
                      {n.fecha_nacimiento && <div style={{ fontSize:11, color:'#888', marginTop:4 }}>Cumple {calcAge(n.fecha_nacimiento)+1} años 🎈</div>}
                      {n.celular && <div style={{ fontSize:11, color:C.blue, marginTop:2 }}>📞 {n.celular}</div>}
                      <button onClick={() => setNinoCard(n)} style={{ marginTop:8, padding:'5px 12px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#003DA5,#009FDA)', color:'white', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>🎂 Generar card</button>
                    </div>
                  </div>
                )
              })}
              {diaSel.maestros.map(m => (
                <div key={m.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(5,150,105,0.1)' }}>
                  <Avatar name={m.nombre} src={m.foto_url} size={44} radius={10} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'#1A1628', marginBottom:4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.nombre}</div>
                    <span style={{ fontSize:10, fontWeight:700, background:'rgba(5,150,105,0.12)', color:CM, padding:'2px 8px', borderRadius:6 }}>👩‍🏫 {m.rol}</span>
                    {m.fecha_nacimiento && <div style={{ fontSize:11, color:'#888', marginTop:4 }}>Cumple {calcAge(m.fecha_nacimiento)+1} años 🎈</div>}
                    {m.celular && <div style={{ fontSize:11, color:CM, marginTop:2 }}>📞 {m.celular}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...glass, borderRadius:16, padding:16 }}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.navy, marginBottom:12 }}>
                Todo {mesNombre} · {ninesMes.length + maestrosMes.length}
              </div>
              {ninesMes.length + maestrosMes.length === 0 ? (
                <div style={{ textAlign:'center', padding:'24px 0', color:'#bbb', fontSize:13 }}>🎈 Sin cumpleaños este mes</div>
              ) : (
                <div style={{ maxHeight:400, overflowY:'auto' }}>
                  {[
                    ...ninesMes.map(n => ({ ...n, _tipo: 'nino' })),
                    ...maestrosMes.map(m => ({ ...m, _tipo: 'maestro' })),
                  ]
                    .sort((a,b) => {
                      const da = a.fecha_nacimiento ? parseInt(a.fecha_nacimiento.split('-')[2]) : 99
                      const db = b.fecha_nacimiento ? parseInt(b.fecha_nacimiento.split('-')[2]) : 99
                      return da - db
                    })
                    .map(p => {
                      const dia = p.fecha_nacimiento ? parseInt(p.fecha_nacimiento.split('-')[2]) : null
                      const esMaestro = p._tipo === 'maestro'
                      const cfg = esMaestro ? {} : (GRUPO_CONFIG[p.grupo] ?? {})
                      return (
                        <div key={`${p._tipo}-${p.id}`} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${esMaestro ? 'rgba(5,150,105,0.08)' : 'rgba(0,61,165,0.07)'}` }}>
                          {dia && (
                            <div onClick={() => setDiaSeleccionado(dia)} style={{ width:30, height:30, borderRadius:8, background: esMaestro ? 'rgba(5,150,105,0.1)' : 'rgba(0,61,165,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color: esMaestro ? CM : C.navy, flexShrink:0, cursor:'pointer' }}>{dia}</div>
                          )}
                          <Avatar name={p.nombre} src={p.foto_url} size={32} radius={8} />
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:600, color:'#1A1628', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.nombre}</div>
                            <div style={{ fontSize:10, color: esMaestro ? CM : '#aaa' }}>{esMaestro ? `👩‍🏫 ${p.rol}` : `${cfg.emoji ?? ''} ${p.grupo ?? ''}`}</div>
                          </div>
                          {!esMaestro && (
                            <button onClick={() => setNinoCard(p)} style={{ padding:'4px 10px', borderRadius:8, border:'none', flexShrink:0, background:'linear-gradient(135deg,#003DA5,#009FDA)', color:'white', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>🎂</button>
                          )}
                        </div>
                      )
                    })
                  }
                </div>
              )}
            </div>
          )}

          {/* Sin fecha exacta */}
          {porDia[0] && porDia[0].length > 0 && (
            <div style={{ ...glass, borderRadius:14, padding:'12px 16px' }}>
              <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:'#999', marginBottom:8 }}>Sin fecha exacta</div>
              {porDia[0].map(n => (
                <div key={n.id} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                  <Avatar name={n.nombre} size={28} />
                  <span style={{ fontSize:12, color:'#666' }}>{n.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {ninoCard && (
        <Modal title={`🎂 Card de cumpleaños — ${ninoCard.nombre}`} onClose={() => setNinoCard(null)} maxWidth={560}>
          <CumpleCard nino={ninoCard} onClose={() => setNinoCard(null)} />
        </Modal>
      )}
    </div>
  )
}