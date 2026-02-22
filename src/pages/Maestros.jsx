import { useState } from 'react'
import Avatar from '../components/Avatar'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import MaestroDetail from '../components/MaestroDetail'
import MaestroForm from '../components/MaestroForm'
import { GRUPO_CONFIG } from '../data/ninos'

const C = { blue: '#009FDA', navy: '#003DA5', yellow: '#F0AB00' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const variantGrupo = clase =>
  clase === 'Pequeños Navegantes'     ? 'ovejitas'
  : clase === 'Firmes en el Puerto'   ? 'nissi'
  : clase === 'Guardianes del Puerto' ? 'torre'
  : 'gold'

export default function Maestros({ maestros, addMaestro, updateMaestro, deleteMaestro }) {
  const [modal, setModal] = useState(null)
  const [sel,   setSel]   = useState(null)

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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: C.navy, margin: '0 0 2px' }}>
            👨‍🏫 Maestros
          </h1>
          <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
            Equipo docente · {maestros.length} maestros registrados
          </p>
        </div>
        <button onClick={openAdd} style={{
          padding: '10px 20px', background: 'linear-gradient(135deg,#003DA5,#009FDA)',
          color: 'white', border: 'none', borderRadius: 12,
          fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,61,165,0.35)',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>➕ Nuevo maestro</button>
      </div>

      {/* Cards */}
      {maestros.length === 0 ? (
        <div style={{ ...glass, borderRadius: 18, padding: '60px 24px', textAlign: 'center', color: '#888' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🏫</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No hay maestros registrados</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Agrega el primer maestro con el botón de arriba</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {maestros.map(m => {
            const cfg = GRUPO_CONFIG[m.clase] ?? {}
            return (
              <div key={m.id} style={{
                ...glass, borderRadius: 18, padding: 22,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,30,100,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,30,100,0.1)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <Avatar name={m.nombre} src={m.foto_url} size={56} radius={14} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1A1628', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.nombre || <span style={{ color: '#bbb' }}>Sin nombre</span>}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.blue, marginTop: 3 }}>
                      {m.rol}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: 'linear-gradient(90deg,#F0AB00,rgba(240,171,0,0.1))', marginBottom: 14 }} />

                <div style={{ marginBottom: 12 }}>
                  <Badge variant={variantGrupo(m.clase)}>
                    {cfg.emoji ?? '📚'} {m.clase || 'Sin asignar'}
                  </Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                  {m.celular && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                      <span style={{ fontSize: 15 }}>📞</span> {m.celular}
                    </div>
                  )}
                  {m.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
                      <span style={{ fontSize: 15 }}>📧</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</span>
                    </div>
                  )}
                  {!m.celular && !m.email && (
                    <div style={{ fontSize: 12, color: '#bbb', fontStyle: 'italic' }}>Sin información de contacto</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openView(m)} style={{
                    flex: 1, padding: '8px 0',
                    background: 'rgba(0,159,218,0.08)', color: C.blue,
                    border: '1px solid rgba(0,159,218,0.22)', borderRadius: 9,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,159,218,0.16)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,159,218,0.08)'}
                  >👁️ Ver</button>

                  <button onClick={() => openEdit(m)} style={{
                    flex: 1, padding: '8px 0',
                    background: 'rgba(0,61,165,0.08)', color: C.navy,
                    border: '1px solid rgba(0,61,165,0.18)', borderRadius: 9,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.08)'}
                  >✏️ Editar</button>

                  <button onClick={() => handleDelete(m.id, m.nombre)} style={{
                    padding: '8px 14px',
                    background: 'rgba(239,68,68,0.08)', color: '#DC2626',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9,
                    cursor: 'pointer', fontSize: 15, transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >🗑️</button>
                </div>
              </div>
            )
          })}
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