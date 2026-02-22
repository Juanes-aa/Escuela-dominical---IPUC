import { useState } from 'react'
import { getSession } from './lib/auth'
import Login from './pages/Login'
import Navbar from "./components/Navbar.jsx"
import Dashboard from './pages/Dashboard'
import Ninos from './pages/Ninos'
import Maestros from './pages/Maestros'
import Miembros from './pages/Miembros'
import Asistencia from './pages/Asistencia'
import Cumpleanos from './pages/Cumpleanos'
import Importar from './pages/Importar'
import Setup from './pages/Setup'
import { useStore } from './hooks/useStore'

export default function App() {
  const [user, setUser] = useState(() => getSession())
  const [page, setPage] = useState('dashboard')

  const {
    ninos, maestros, miembros, asistencia, loading,
    addNino, updateNino, deleteNino,
    addMaestro, updateMaestro, deleteMaestro,
    addMiembro, updateMiembro, deleteMiembro,
    toggleAsistencia, setPresentesEnFecha,
  } = useStore()

  if (!user) return <Login onLogin={u => setUser(u)} />

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontSize: 40 }}>⚓</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: '#003DA5', fontWeight: 600 }}>
        Cargando datos...
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh' }}>
      <style>{`
        .app-main {
          padding-top: 90px;
          padding-bottom: 40px;
          padding-left: 24px;
          padding-right: 24px;
          max-width: 1248px;
          margin: 0 auto;
          box-sizing: border-box;
          width: 100%;
        }
        @media (max-width: 768px) {
          .app-main {
            padding-top: 80px;
            padding-left: 16px;
            padding-right: 16px;
            padding-bottom: 32px;
            max-width: 100%;
          }
        }
      `}</style>

      <Navbar
        page={page} setPage={setPage} user={user}
        ninosCount={ninos.length}
        maestrosCount={maestros.length}
        miembrosCount={miembros.length}
      />

      <main className="app-main">
        <div key={page}>
          {page === 'dashboard'  && <Dashboard  ninos={ninos} maestros={maestros} asistencia={asistencia} />}
          {page === 'ninos'      && <Ninos      ninos={ninos} addNino={addNino} updateNino={updateNino} deleteNino={deleteNino} />}
          {page === 'maestros'   && <Maestros   maestros={maestros} addMaestro={addMaestro} updateMaestro={updateMaestro} deleteMaestro={deleteMaestro} />}
          {page === 'miembros'   && <Miembros   miembros={miembros} addMiembro={addMiembro} updateMiembro={updateMiembro} deleteMiembro={deleteMiembro} />}
          {page === 'asistencia' && <Asistencia ninos={ninos} asistencia={asistencia} toggleAsistencia={toggleAsistencia} setPresentesEnFecha={setPresentesEnFecha} />}
          {page === 'cumpleanos' && <Cumpleanos ninos={ninos} />}
          {page === 'importar'   && <Importar   addNino={addNino} />}
          {page === 'setup'      && <Setup />}
        </div>
      </main>
    </div>
  )
}