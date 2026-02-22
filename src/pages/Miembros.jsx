import React, { useState } from 'react'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import MiembroForm from '../components/MiembroForm'
import MiembroDetail from '../components/MiembroDetail'
import ErrorBoundary from '../components/Errorboundary'

const C = { navy: '#003DA5', blue: '#009FDA', yellow: '#F0AB00' }

const ROL_CONFIG = {
  'Líder':        { emoji: '👑', bg: 'linear-gradient(135deg,#003DA5,#0052CC)', text: '#fff', glow: 'rgba(0,61,165,0.3)',  chipBg: '#003DA5' },
  'Sublíder':     { emoji: '⭐', bg: 'linear-gradient(135deg,#009FDA,#00B8FF)', text: '#fff', glow: 'rgba(0,159,218,0.3)', chipBg: '#009FDA' },
  'Secretario/a': { emoji: '📋', bg: 'linear-gradient(135deg,#6C3BD5,#9B6DFF)', text: '#fff', glow: 'rgba(108,59,213,0.3)',chipBg: '#6C3BD5' },
  'Tesorero/a':   { emoji: '💰', bg: 'linear-gradient(135deg,#F0AB00,#FFD000)', text: '#1A1628', glow: 'rgba(240,171,0,0.3)', chipBg: '#F0AB00' },
  'Vocal':        { emoji: '🎙️', bg: 'linear-gradient(135deg,#0A8A5A,#0EBF7C)', text: '#fff', glow: 'rgba(10,138,90,0.3)', chipBg: '#0A8A5A' },
}

const ROLES = Object.keys(ROL_CONFIG)

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

function MiembroCard({ m, onDetail, onEdit, onDelete }) {
  const cfg = ROL_CONFIG[m.rol] ?? ROL_CONFIG['Vocal']

  return (
    <div
      style={{
        ...glass,
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 16px 40px ${cfg.glow}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,30,100,0.1)'
      }}
    >
      {/* Header con color del rol */}
      <div style={{
        background: cfg.bg,
        padding: '24px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.5)',
          overflow: 'hidden',
          boxShadow: `0 4px 16px ${cfg.glow}`,
          flexShrink: 0,
        }}>
          <Avatar name={m.nombre || '?'} src={m.foto_url} size={70} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'DM Sans',sans-serif", fontWeight: 800,
            fontSize: 15, color: cfg.text, lineHeight: 1.2,
          }}>
            {m.nombre}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 20, padding: '4px 13px',
          fontSize: 12, fontWeight: 700, color: cfg.text,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          {cfg.emoji} {m.rol}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {m.celular && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
            <span>📱</span><span>{m.celular}</span>
          </div>
        )}
        {m.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444' }}>
            <span>✉️</span>
            <span style={{ wordBreak: 'break-all' }}>{m.email}</span>
          </div>
        )}
        {m.notas && (
          <div style={{
            marginTop: 2,
            background: 'rgba(0,61,165,0.04)',
            borderRadius: 8, padding: '7px 10px',
            fontSize: 12, color: '#666',
            borderLeft: `3px solid ${C.blue}`,
          }}>
            {m.notas}
          </div>
        )}

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12 }}>
          <button onClick={() => onDetail(m)} style={{
            flex: 1, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            border: '1.5px solid rgba(0,61,165,0.15)', borderRadius: 9,
            background: 'rgba(0,61,165,0.04)', color: C.navy,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.04)'}
          >👁️ Ver</button>
          <button onClick={() => onEdit(m)} style={{
            flex: 1, padding: '8px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            border: '1.5px solid rgba(0,61,165,0.15)', borderRadius: 9,
            background: 'rgba(0,61,165,0.04)', color: C.navy,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.04)'}
          >✏️ Editar</button>
          <button
            onClick={() => { if (window.confirm(`¿Eliminar a ${m.nombre}?`)) onDelete(m.id) }}
            style={{
              padding: '8px 10px', cursor: 'pointer', fontSize: 13,
              border: '1.5px solid rgba(220,50,50,0.18)', borderRadius: 9,
              background: 'rgba(220,50,50,0.04)', color: '#dc3232',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,50,50,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,50,50,0.04)'}
          >🗑️</button>
        </div>
      </div>
    </div>
  )
}

export default function Miembros({ miembros, addMiembro, updateMiembro, deleteMiembro }) {
  const [modal, setModal]       = useState(null)   // 'add' | 'edit' | 'detail'
  const [sel, setSel]           = useState(null)

  const filtered = miembros || []

  const openDetail = m  => { setSel(m);    setModal('detail') }
  const openEdit   = m  => { setSel(m);    setModal('edit')   }
  const openAdd    = () => { setSel(null); setModal('add')    }
  const closeModal = () => { setModal(null); setSel(null)     }
  const detailToEdit = m => { setSel(m);  setModal('edit')    }

  const handleSave = form => {
    if (modal === 'add') addMiembro(form)
    else updateMiembro({ ...sel, ...form, id: sel.id })
    closeModal()
  }

  return (
    <div>
      {/* Encabezado */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'DM Sans',sans-serif", fontSize: 26, fontWeight: 800,
          color: C.navy, margin: '0 0 2px',
        }}>
          🏅 Equipo de Liderazgo
        </h1>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>
          {(miembros || []).length} miembros registrados
        </p>
      </div>

      {/* Botón agregar */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={openAdd} style={{
          padding: '9px 18px',
          background: 'linear-gradient(135deg,#003DA5,#009FDA)',
          color: 'white', border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          ➕ Nuevo miembro
        </button>
      </div>

      {/* Grid de cards */}
      {filtered.length === 0 ? (
        <div style={{ ...glass, borderRadius: 18, padding: 48, textAlign: 'center', color: '#aaa' }}>
          Sin resultados
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(m => (
            <MiembroCard
              key={m.id} m={m}
              onDetail={openDetail}
              onEdit={openEdit}
              onDelete={deleteMiembro}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {modal === 'add' && (
        <Modal title="➕ Nuevo Miembro" onClose={closeModal} maxWidth={580}>
          <MiembroForm initial={null} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}

      {modal === 'edit' && sel && (
        <Modal title={`✏️ Editar — ${sel.nombre}`} onClose={closeModal} maxWidth={580}>
          <MiembroForm key={sel.id} initial={sel} onSave={handleSave} onClose={closeModal} />
        </Modal>
      )}

      {modal === 'detail' && sel && (
        <Modal title="👤 Perfil del Miembro" onClose={closeModal} maxWidth={500}>
          <ErrorBoundary key={sel.id}>
            <MiembroDetail miembro={sel} onClose={closeModal} onEdit={detailToEdit} />
          </ErrorBoundary>
        </Modal>
      )}
    </div>
  )
}