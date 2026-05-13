import { useState } from 'react'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import MaestroDetail from '../components/MaestroDetail'
import MaestroForm from '../components/MaestroForm'
import { GRUPOS, GRUPO_CONFIG } from '../data/ninos'

const C = { blue: '#009FDA', navy: '#003DA5', yellow: '#F0AB00' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const GRUPO_STYLES = {
  'Pequeños Navegantes':   { bg: 'rgba(0,159,218,0.08)',  border: '#009FDA', text: '#006B8F' },
  'Firmes en el Puerto':   { bg: 'rgba(0,61,165,0.08)',   border: '#003DA5', text: '#003DA5' },
  'Guardianes del Puerto': { bg: 'rgba(240,171,0,0.12)',  border: '#F0AB00', text: '#8a6000' },
}
const GRUPO_STYLES_DEFAULT = { bg: 'rgba(150,150,150,0.08)', border: '#999', text: '#555' }

export default function Maestros({ maestros, addMaestro, updateMaestro, deleteMaestro }) {
  const [modal, setModal] = useState(null)
  const [sel,   setSel]   = useState(null)
  const [search, setSearch] = useState('')

  const openView   = m  => { setSel(m);    setModal('view') }
  const openEdit   = m  => { setSel(m);    setModal('edit') }
  const openAdd    = () => { setSel(null); setModal('add')  }
  const closeModal = () => { setModal(null); setSel(null)   }

  const handleEditFromDetail = m => { setSel(m); setModal('edit') }

  const handleSave = f => {
    if (modal === 'add') addMaestro(f)
    else updateMaestro({ ...sel, ...f })
    closeModal()
  }

  const handleDelete = (id, nombre) => {
    if (confirm(`¿Eliminar a ${nombre || 'este maestro'}?`)) deleteMaestro(id)
  }

  const q = search.toLowerCase()
  const filtered = (maestros || []).filter(m =>
    !q || (m.nombre || '').toLowerCase().includes(q) || (m.rol || '').toLowerCase().includes(q)
  )

  const clases = [...GRUPOS, 'Todas', ...filtered.map(m => m.clase).filter(c => c && !GRUPOS.includes(c) && c !== 'Todas')]
  const clasesConDatos = [...new Set(clases)].filter(c => filtered.some(m => (m.clase || 'Sin asignar') === c || (c === 'Sin asignar' && !m.clase)))

  // Grupos que aparecen en los datos (en orden canónico primero)
  const gruposRender = [
    ...GRUPOS.filter(g => filtered.some(m => m.clase === g)),
    ...[...new Set(filtered.map(m => m.clase))].filter(c => !GRUPOS.includes(c)),
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: C.navy, margin: '0 0 2px' }}>
            👨‍🏫 Maestros
          </h1>
          <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
            Equipo docente · {maestros.length} maestros registrados
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar..."
            style={{ padding: '9px 14px', border: '1.5px solid rgba(0,61,165,0.2)', borderRadius: 10, fontSize: 14, background: 'rgba(255,255,255,0.7)', outline: 'none', width: 180 }}
          />
          <button onClick={openAdd} style={{
            padding: '10px 20px', background: 'linear-gradient(135deg,#003DA5,#009FDA)',
            color: 'white', border: 'none', borderRadius: 12,
            fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,61,165,0.35)', whiteSpace: 'nowrap',
          }}>➕ Nuevo maestro</button>
        </div>
      </div>

      {/* Grupos */}
      {maestros.length === 0 ? (
        <div style={{ ...glass, borderRadius: 18, padding: '60px 24px', textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🏫</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No hay maestros registrados</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Agrega el primer maestro con el botón de arriba</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {gruposRender.map(clase => {
            const miembros = filtered.filter(m => m.clase === clase)
            if (!miembros.length) return null
            const cfg = GRUPO_CONFIG[clase] ?? {}
            const st  = GRUPO_STYLES[clase] ?? GRUPO_STYLES_DEFAULT
            return (
              <div key={clase}>
                {/* Encabezado de grupo */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
                  paddingLeft: 16, borderLeft: `5px solid ${st.border}`,
                }}>
                  <span style={{ fontSize: 22 }}>{cfg.emoji ?? '📚'}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 800, color: st.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {clase}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
                      {cfg.rango ? `${cfg.rango} · ` : ''}{miembros.length} maestro{miembros.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Cards del grupo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 14 }}>
                  {miembros.map(m => (
                    <div key={m.id} style={{
                      ...glass, borderRadius: 18, padding: 20,
                      borderLeft: `4px solid ${st.border}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,30,100,0.18)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,30,100,0.1)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                        <Avatar name={m.nombre} src={m.foto_url} size={54} radius={13} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.nombre || <span style={{ color: '#bbb' }}>Sin nombre</span>}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: st.text, marginTop: 3 }}>
                            {m.rol}
                          </div>
                        </div>
                      </div>

                      <div style={{ height: 1, background: `linear-gradient(90deg,${st.border},rgba(0,0,0,0.04))`, marginBottom: 12 }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                        {m.celular && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                            <span>📞</span> {m.celular}
                          </div>
                        )}
                        {m.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                            <span>📧</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</span>
                          </div>
                        )}
                        {!m.celular && !m.email && (
                          <div style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>Sin información de contacto</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openView(m)} style={{
                          flex: 1, padding: '8px 0', background: `${st.bg}`, color: st.text,
                          border: `1px solid ${st.border}40`, borderRadius: 9,
                          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >👁️ Ver</button>
                        <button onClick={() => openEdit(m)} style={{
                          flex: 1, padding: '8px 0', background: 'rgba(0,61,165,0.07)', color: C.navy,
                          border: '1px solid rgba(0,61,165,0.18)', borderRadius: 9,
                          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.14)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.07)'}
                        >✏️ Editar</button>
                        <button onClick={() => handleDelete(m.id, m.nombre)} style={{
                          padding: '8px 13px', background: 'rgba(239,68,68,0.07)', color: '#DC2626',
                          border: '1px solid rgba(239,68,68,0.18)', borderRadius: 9, cursor: 'pointer', fontSize: 15,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.07)'}
                        >🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div style={{ ...glass, borderRadius: 16, padding: '40px 24px', textAlign: 'center', color: '#aaa' }}>
              Sin resultados para "{search}"
            </div>
          )}
        </div>
      )}

      {modal === 'view' && (
        <Modal title="👁️ Detalle del Maestro" onClose={closeModal} maxWidth={500}>
          <MaestroDetail maestro={sel} onClose={closeModal} onEdit={handleEditFromDetail} />
        </Modal>
      )}
      {modal === 'edit' && (
        <Modal title="✏️ Editar Maestro" onClose={closeModal} maxWidth={480}>
          <MaestroForm initial={sel} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
      {modal === 'add' && (
        <Modal title="➕ Nuevo Maestro" onClose={closeModal} maxWidth={480}>
          <MaestroForm initial={null} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}
    </div>
  )
}