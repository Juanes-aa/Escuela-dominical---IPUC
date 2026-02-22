import { useState } from 'react'
import { logout } from '../lib/auth'

const NAV = [
  { id: 'dashboard',  label: 'Inicio' },
  { id: 'ninos',      label: 'Niños' },
  { id: 'maestros',   label: 'Maestros' },
  { id: 'miembros',   label: 'Liderazgo' },
  { id: 'asistencia', label: 'Asistencia' },
  { id: 'cumpleanos', label: 'Cumpleaños' },
  { id: 'importar',   label: 'Importar', desktopOnly: true },
]

const COUNTS = { ninos: true, maestros: true, miembros: true }

function Badge({ item, active, ninosCount, maestrosCount, miembrosCount }) {
  if (item.id === 'ninos')
    return <span style={{ marginLeft: 6, background: active ? 'rgba(255,255,255,0.25)' : 'rgba(240,171,0,0.2)', color: active ? 'white' : '#92400E', borderRadius: 20, padding: '0px 7px', fontSize: 10, fontWeight: 800 }}>{ninosCount}</span>
  if (item.id === 'maestros')
    return <span style={{ marginLeft: 6, background: active ? 'rgba(255,255,255,0.25)' : 'rgba(0,159,218,0.15)', color: active ? 'white' : '#003DA5', borderRadius: 20, padding: '0px 7px', fontSize: 10, fontWeight: 800 }}>{maestrosCount}</span>
  if (item.id === 'miembros')
    return <span style={{ marginLeft: 6, background: active ? 'rgba(255,255,255,0.25)' : 'rgba(240,171,0,0.2)', color: active ? 'white' : '#92400E', borderRadius: 20, padding: '0px 7px', fontSize: 10, fontWeight: 800 }}>{miembrosCount}</span>
  return null
}

export default function Navbar({ page, setPage, user, ninosCount, maestrosCount, miembrosCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNav = (id) => {
    setPage(id)
    setMenuOpen(false)
  }

  const glassStyle = {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 32px rgba(0,15,60,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-hamburger { display: flex !important; }
          .navbar-user-role { display: none !important; }
        }
        @media (min-width: 769px) {
          .navbar-mobile-menu { display: none !important; }
          .navbar-hamburger { display: none !important; }
        }
      `}</style>

      <header style={{
        position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 200, width: 'calc(100% - 32px)', maxWidth: 1200,
      }}>

        {/* ── Barra principal ── */}
        <nav style={{
          ...glassStyle,
          borderRadius: menuOpen ? '20px 20px 0 0' : 20,
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'border-radius 0.2s',
        }}>

          {/* Logo */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo-ipuc.png" alt="IPUC" style={{ width: 34, height: 34, objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#003DA5', letterSpacing: 0.5 }}>IPUC</div>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 0.5, textTransform: 'uppercase' }}>Calasanz</div>
            </div>
          </div>

          {/* Links desktop */}
          <div className="navbar-desktop-links" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'nowrap' }}>
            {NAV.map(item => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setPage(item.id)}
                  style={{
                    padding: '8px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(0,61,165,0.85)' : 'transparent',
                    color: active ? 'white' : '#1A1A2E',
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    transition: 'all 0.18s', whiteSpace: 'nowrap',
                    boxShadow: active ? '0 4px 14px rgba(0,61,165,0.35)' : 'none',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,61,165,0.1)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  {item.label}
                  <Badge item={item} active={active} ninosCount={ninosCount} maestrosCount={maestrosCount} miembrosCount={miembrosCount} />
                </button>
              )
            })}
          </div>

          {/* Derecha: rol + logout + hamburger */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
            <div className="navbar-user-role" style={{ fontSize: 13, fontWeight: 700, color: '#003DA5' }}>
              {user?.rol}
            </div>

            {/* Botón logout (siempre visible) */}
            <button
              onClick={() => { logout(); window.location.reload() }}
              title="Cerrar sesión"
              style={{
                width: 34, height: 34, borderRadius: 10,
                border: '1px solid rgba(214,69,69,0.5)',
                background: 'rgba(214,69,69,0.15)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', padding: 0, flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(214,69,69,0.3)'; e.currentTarget.style.borderColor = 'rgba(214,69,69,0.8)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(214,69,69,0.15)'; e.currentTarget.style.borderColor = 'rgba(214,69,69,0.5)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                stroke="#D64545" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>

            {/* Hamburger (solo móvil) */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'none', // overridden by CSS media query
                width: 34, height: 34, borderRadius: 10,
                border: '1px solid rgba(0,61,165,0.3)',
                background: menuOpen ? 'rgba(0,61,165,0.15)' : 'transparent',
                cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
                padding: 0, flexShrink: 0, transition: 'all 0.15s',
              }}
            >
              {menuOpen ? (
                // X
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                // ☰
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>

        </nav>

        {/* ── Menú móvil desplegable ── */}
        <div
          className="navbar-mobile-menu"
          style={{
            ...glassStyle,
            borderRadius: '0 0 20px 20px',
            borderTop: 'none',
            overflow: 'hidden',
            maxHeight: menuOpen ? 420 : 0,
            opacity: menuOpen ? 1 : 0,
            transition: 'max-height 0.3s ease, opacity 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Rol del usuario */}
          <div style={{ padding: '10px 16px 4px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {user?.rol}
          </div>

          {/* Items del menú — sin opciones desktopOnly */}
          <div style={{ padding: '4px 10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.filter(item => !item.desktopOnly).map(item => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  style={{
                    padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(0,61,165,0.85)' : 'transparent',
                    color: active ? 'white' : '#1A1A2E',
                    fontSize: 15, fontWeight: active ? 700 : 500,
                    textAlign: 'left', display: 'flex', alignItems: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {item.label}
                  <Badge item={item} active={active} ninosCount={ninosCount} maestrosCount={maestrosCount} miembrosCount={miembrosCount} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Overlay para cerrar el menú tocando fuera */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: -1,
            }}
          />
        )}

      </header>
    </>
  )
}