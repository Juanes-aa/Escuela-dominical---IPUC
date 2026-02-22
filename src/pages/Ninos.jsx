import React, { useState } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import NinoForm from '../components/NinoForm'
import NinoDetail from '../components/NinoDetail'
import ErrorBoundary from '../components/Errorboundary'

const C = { navy: '#003DA5', blue: '#009FDA', yellow: '#F0AB00' }

const GRUPOS = ['Pequeños Navegantes', 'Firmes en el Puerto', 'Guardianes del Puerto']

const GRUPO_EMOJI = {
  'Pequeños Navegantes':   '⚓',
  'Firmes en el Puerto':   '🧭',
  'Guardianes del Puerto': '🛡️',
}

const GRUPO_STYLES = {
  'Pequeños Navegantes':  { bg: 'rgba(0,159,218,0.10)',  border: '#009FDA', chipBg: '#009FDA', chipText: '#ffffff' },
  'Firmes en el Puerto':  { bg: 'rgba(0,61,165,0.10)',   border: '#003DA5', chipBg: '#003DA5', chipText: '#ffffff' },
  'Guardianes del Puerto':{ bg: 'rgba(240,171,0,0.15)',  border: '#F0AB00', chipBg: '#F0AB00', chipText: '#1A1628' },
}

const GRUPO_STYLES_DEFAULT = {
  bg: 'rgba(150,150,150,0.1)', border: '#999', chipBg: '#999', chipText: '#fff'
}

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const normalizar = txt =>
  (txt || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

const canonizarGrupo = (grupo = '') => {
  const n = normalizar(grupo)
  // Nombres canónicos y variaciones
  if (n.includes('peque') || n.includes('naveg')) return 'Pequeños Navegantes'
  if (n.includes('firme'))                         return 'Firmes en el Puerto'
  if (n.includes('guardian'))                      return 'Guardianes del Puerto'
  // Rangos de edad en BD: "3 a 5 años", "6 a 8 años", "9 a 12 años"
  if (/[345]/.test(n))                        return 'Pequeños Navegantes'
  if (/[678]/.test(n))                        return 'Firmes en el Puerto'
  if (/(9|10|11|12)/.test(n))                 return 'Guardianes del Puerto'
  for (const g of GRUPOS) {
    if (normalizar(g) === n) return g
  }
  return grupo
}

export default function Ninos({ ninos, addNino, updateNino, deleteNino }) {
  const [search, setSearch] = useState('')
  const [grupo,  setGrupo]  = useState('Todos')
  const [modal,  setModal]  = useState(null)
  const [sel,    setSel]    = useState(null)

  const ninosNormalizados = (ninos || []).map(n => ({
    ...n,
    _grupoCanon: canonizarGrupo(n.grupo),
  }))

  const filtered = ninosNormalizados
    .filter(n => {
      const q = search.toLowerCase()
      const grupoMatch = grupo === 'Todos' || n._grupoCanon === grupo
      return grupoMatch && (
        (n.nombre    || '').toLowerCase().includes(q) ||
        (n.acudiente || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => (a._grupoCanon || '').localeCompare(b._grupoCanon || ''))

  const openDetail   = n => { setSel(n); setModal('detail') }
  const openEdit     = n => { setSel(n); setModal('edit') }
  const openAdd      = ()  => { setSel(null); setModal('add') }
  const closeModal   = ()  => { setModal(null); setSel(null) }
  const detailToEdit = n  => { setSel(n); setModal('edit') }

  const handleSave = form => {
    if (modal === 'add') addNino(form)
    else updateNino({ ...sel, ...form, id: sel.id, item: sel.item })
    closeModal()
  }

  const handleDelete = n => {
    if (window.confirm(`¿Eliminar a ${n.nombre}?`)) deleteNino(n.id)
  }

  const gruposEnDatos = [...new Set(filtered.map(n => n._grupoCanon))]
  const gruposRender  = [
    ...GRUPOS.filter(g => gruposEnDatos.includes(g)),
    ...gruposEnDatos.filter(g => !GRUPOS.includes(g)),
  ]

  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .ninos-table-view { display: none !important; }
          .ninos-cards-view { display: block !important; }
          .filter-grupo-scroll { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 4px; }
          .filter-grupo-scroll button { flex-shrink: 0; }
        }
        @media (min-width: 769px) {
          .ninos-cards-view { display: none !important; }
          .ninos-table-view { display: block !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: C.navy, margin:'0 0 2px' }}>
          👨‍👧‍👦 Niños Inscritos
        </h1>
        <p style={{ color:'#555', fontSize:13, margin:0 }}>{(ninos||[]).length} niños registrados</p>
      </div>

      {/* Filtros */}
      <div style={{ ...glass, borderRadius:16, padding:'14px 16px', marginBottom:16, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Buscar por nombre o acudiente..."
          style={{ flex:1, minWidth:180, padding:'9px 14px', border:'1.5px solid rgba(0,61,165,0.2)', borderRadius:10, fontSize:14, background:'rgba(255,255,255,0.7)', outline:'none' }}
        />
        <div className="filter-grupo-scroll" style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Todos', ...GRUPOS].map(g => {
            const active = grupo === g
            const emoji = GRUPO_EMOJI[g] || ''
            return (
              <button key={g} onClick={() => setGrupo(g)} style={{
                padding:'8px 12px', borderRadius:10, cursor:'pointer', fontSize:12, fontWeight:600,
                border:`1.5px solid ${active ? C.navy : 'rgba(0,61,165,0.2)'}`,
                background: active ? C.navy : 'rgba(255,255,255,0.6)',
                color: active ? 'white' : '#444',
                whiteSpace:'nowrap',
              }}>{emoji ? `${emoji} ${g}` : g}</button>
            )
          })}
        </div>
        <button onClick={openAdd} style={{
          padding:'9px 18px', background:'linear-gradient(135deg,#003DA5,#009FDA)',
          color:'white', border:'none', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer',
          whiteSpace:'nowrap',
        }}>
          ➕ Nuevo niño
        </button>
      </div>

      {/* ══ VISTA TABLA (desktop) ══ */}
      <div className="ninos-table-view">
        <div style={{ ...glass, borderRadius:18, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'rgba(0,61,165,0.07)' }}>
                  {['#','Nombre','Grupo','Cumpleaños','Acudiente','Celular','Alergias','Imagen',''].map(h => (
                    <th key={h} style={{ padding:'12px 14px', textAlign:'left', fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:C.navy }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#aaa' }}>Sin resultados</td></tr>
                ) : (
                  gruposRender.map(g => {
                    const grupoNinos = filtered.filter(n => n._grupoCanon === g)
                    if (grupoNinos.length === 0) return null
                    const st = GRUPO_STYLES[g] ?? GRUPO_STYLES_DEFAULT
                    return (
                      <React.Fragment key={g}>
                        <tr>
                          <td colSpan={9} style={{ background:st.bg, borderLeft:`6px solid ${st.border}`, padding:'12px 18px', fontWeight:800, fontSize:13, color:st.border, textTransform:'uppercase' }}>
                            {GRUPO_EMOJI[g] || '📌'} {g} — {grupoNinos.length} niños
                          </td>
                        </tr>
                        {grupoNinos.map(n => {
                          const hasAlert = n.alergias && n.alergias !== 'Ninguna'
                          return (
                            <tr key={n.id} style={{ borderBottom:'1px solid rgba(0,61,165,0.06)' }}>
                              <td style={{ padding:'11px 14px', fontSize:12, color:'#aaa' }}>{n.item}</td>
                              <td style={{ padding:'11px 14px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                  <Avatar name={n.nombre||'?'} src={n.foto_url} size={34} />
                                  <span style={{ fontWeight:600, fontSize:13 }}>{n.nombre||'—'}</span>
                                </div>
                              </td>
                              <td style={{ padding:'11px 14px' }}>
                                <span style={{ background:st.chipBg, color:st.chipText, padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:700, whiteSpace:'nowrap' }}>
                                  {GRUPO_EMOJI[n._grupoCanon] || '📌'} {n._grupoCanon}
                                </span>
                              </td>
                              <td style={{ padding:'11px 14px', textTransform:'capitalize' }}>{n.mes_cumple||'—'}</td>
                              <td style={{ padding:'11px 14px' }}>
                                <div style={{ fontWeight:600 }}>{n.acudiente||'—'}</div>
                                <div style={{ fontSize:11, color:'#aaa' }}>{n.parentesco}</div>
                              </td>
                              <td style={{ padding:'11px 14px' }}>{n.celular||'—'}</td>
                              <td style={{ padding:'11px 14px' }}>
                                {hasAlert ? <Badge variant="warning">⚠️ {n.alergias}</Badge> : '—'}
                              </td>
                              <td style={{ padding:'11px 14px' }}>
                                <Badge variant={n.autorizacion_imagen==='Sí'?'success':'danger'}>{n.autorizacion_imagen}</Badge>
                              </td>
                              <td style={{ padding:'11px 14px' }}>
                                <div style={{ display:'flex', gap:4 }}>
                                  <button onClick={() => openDetail(n)} style={btnStyle}>👁️</button>
                                  <button onClick={() => openEdit(n)}   style={btnStyle}>✏️</button>
                                  <button onClick={() => handleDelete(n)} style={btnStyle}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </React.Fragment>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══ VISTA CARDS (móvil) ══ */}
      <div className="ninos-cards-view" style={{ display:'none' }}>
        {filtered.length === 0 ? (
          <div style={{ ...glass, borderRadius:16, padding:40, textAlign:'center', color:'#aaa' }}>Sin resultados</div>
        ) : (
          gruposRender.map(g => {
            const grupoNinos = filtered.filter(n => n._grupoCanon === g)
            if (grupoNinos.length === 0) return null
            const gStyle = GRUPO_STYLES[g] ?? GRUPO_STYLES_DEFAULT
            return (
              <div key={g} style={{ marginBottom:20 }}>
                <div style={{
                  background: gStyle.bg, borderLeft:`5px solid ${gStyle.border}`,
                  padding:'10px 16px', borderRadius:'12px 12px 0 0',
                  fontWeight:800, fontSize:13, color:gStyle.border, textTransform:'uppercase',
                }}>
                  {GRUPO_EMOJI[g] || '📌'} {g} — {grupoNinos.length} niños
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                  {grupoNinos.map(n => {
                    const hasAlert = n.alergias && n.alergias !== 'Ninguna'
                    return (
                      <div key={n.id} style={{
                        ...glass, borderRadius:0, padding:'14px 16px',
                        display:'flex', alignItems:'center', gap:12,
                        borderBottom:'1px solid rgba(0,61,165,0.06)',
                      }}>
                        <Avatar name={n.nombre||'?'} src={n.foto_url} size={42} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{n.nombre||'—'}</div>
                          <div style={{ fontSize:12, color:'#666', marginBottom:4 }}>
                            {n.acudiente && <span>{n.acudiente}</span>}
                            {n.celular && <span style={{ color:'#aaa' }}> · {n.celular}</span>}
                          </div>
                          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                            {n.mes_cumple && (
                              <span style={{ fontSize:11, color:'#888', textTransform:'capitalize' }}>🎂 {n.mes_cumple}</span>
                            )}
                            {hasAlert && <Badge variant="warning">⚠️ Alergia</Badge>}
                            <Badge variant={n.autorizacion_imagen==='Sí'?'success':'danger'}>
                              {n.autorizacion_imagen==='Sí'?'📸 OK':'🚫 Sin img'}
                            </Badge>
                          </div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                          <button onClick={() => openDetail(n)} style={{ ...btnStyle, fontSize:18 }}>👁️</button>
                          <button onClick={() => openEdit(n)}   style={{ ...btnStyle, fontSize:18 }}>✏️</button>
                          <button onClick={() => handleDelete(n)} style={{ ...btnStyle, fontSize:18 }}>🗑️</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ height:8, background: gStyle.bg, borderRadius:'0 0 12px 12px' }} />
              </div>
            )
          })
        )}
      </div>

      {/* Modales */}
      {modal === 'add' && (
        <Modal title="➕ Nuevo Niño/a" onClose={closeModal} maxWidth={640}>
          <NinoForm initial={null} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'edit' && sel && (
        <Modal title={`✏️ Editar — ${sel.nombre}`} onClose={closeModal} maxWidth={640}>
          <NinoForm key={sel.id} initial={sel} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'detail' && sel && (
        <Modal title="👤 Perfil del Niño/a" onClose={closeModal} maxWidth={560}>
          <ErrorBoundary key={sel.id}>
            <NinoDetail nino={sel} onClose={closeModal} onEdit={detailToEdit} />
          </ErrorBoundary>
        </Modal>
      )}
    </div>
  )
}

const btnStyle = {
  background:'none', border:'none', cursor:'pointer', fontSize:16, padding:'5px 7px', borderRadius:7,
}