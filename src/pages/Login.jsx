import { useState } from 'react'
import { login } from '../lib/auth'

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ user: '', pass: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.user || !form.pass) { setError('Por favor completa todos los campos'); return }
    setLoading(true)
    setError('')
    const result = await login(form.user, form.pass)
    if (result.ok) {
      onLogin(result.user)
    } else {
      setError(result.message || 'Usuario o contraseña incorrectos')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'url(/bg-login.png) center center / cover no-repeat',
      position: 'relative', overflow: 'hidden',
      padding: '16px',
    }}>
      <style>{`
        .login-card {
          padding: 44px 40px;
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 22px !important;
            border-radius: 20px !important;
          }
          .login-card h1 { font-size: 22px !important; }
        }
      `}</style>

      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%23FFFFFF' stroke-width='1.5'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%23FFFFFF' stroke-width='1'/%3E%3Cline x1='10' y1='50' x2='90' y2='50' stroke='%23FFFFFF' stroke-width='1'/%3E%3Cline x1='50' y1='10' x2='50' y2='90' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
      }} />

      {/* Glow orbs */}
      <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(240,171,0,0.12) 0%, transparent 65%)', top:'-20%', right:'-15%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,159,218,0.18) 0%, transparent 65%)', bottom:'-15%', left:'-10%', pointerEvents:'none' }} />

      {/* Card */}
      <div className="animate-fadeUp login-card" style={{
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        borderRadius: 28,
        border: '1px solid rgba(255,255,255,0.3)',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 60px rgba(0,15,60,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',
        position: 'relative', zIndex: 1,
        boxSizing: 'border-box',
      }}>
        {/* Logo + Header */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
            <img src="/logo-ipuc.png" alt="IPUC" style={{ width:100, height:100, objectFit:'contain', filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }} />
          </div>
          <h1 style={{ fontFamily:"'DM Sans', sans-serif", fontSize:26, fontWeight:800, color:'#003DA5', margin:'0 0 6px', lineHeight:1.15, textShadow:'0 1px 4px rgba(255,255,255,0.8)', letterSpacing:0.5 }}>
            IPUC
          </h1>
          <p style={{ fontSize:12, fontWeight:700, color:'#009FDA', letterSpacing:2, textTransform:'uppercase', margin:'4px 0 0' }}>
            Escuela Dominical · Calasanz
          </p>
          <p style={{ fontSize:11, color:'#555', margin:'6px 0 0', fontStyle:'italic' }}>
            "Un Señor, una fe, un bautismo"
          </p>
        </div>

        <div style={{ height:2, background:'#F0AB00', marginBottom:26, borderRadius:2, boxShadow:'0 0 10px rgba(240,171,0,0.6)' }} />

        {error && (
          <div style={{ background:'rgba(255,80,80,0.1)', border:'1px solid rgba(200,0,0,0.2)', color:'#991B1B', padding:'10px 14px', borderRadius:10, fontSize:14, textAlign:'center', marginBottom:16 }}>
            🔒 {error}
          </div>
        )}

        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#003DA5', marginBottom:7 }}>
            Usuario
          </label>
          <input
            value={form.user}
            onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Usuario"
            style={{ width:'100%', padding:'12px 16px', border:'1.5px solid rgba(0,61,165,0.2)', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:15, background:'rgba(255,255,255,0.6)', color:'#0A1628', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, background 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#F0AB00'; e.target.style.background = 'rgba(255,255,255,0.85)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,61,165,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)' }}
          />
        </div>

        <div style={{ marginBottom:28 }}>
          <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#003DA5', marginBottom:7 }}>
            Contraseña
          </label>
          <input
            type="password"
            value={form.pass}
            onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Contraseña"
            style={{ width:'100%', padding:'12px 16px', border:'1.5px solid rgba(0,61,165,0.2)', borderRadius:12, fontFamily:"'DM Sans',sans-serif", fontSize:15, background:'rgba(255,255,255,0.6)', color:'#0A1628', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, background 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#F0AB00'; e.target.style.background = 'rgba(255,255,255,0.85)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,61,165,0.2)'; e.target.style.background = 'rgba(255,255,255,0.6)' }}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', padding:'14px',
          background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #003DA5, #009FDA)',
          color:'white', border:'none', borderRadius:14, cursor: loading ? 'default' : 'pointer',
          fontFamily:"'DM Sans',sans-serif", fontSize:16, fontWeight:700, letterSpacing:0.5,
          boxShadow: loading ? 'none' : '0 6px 24px rgba(0,61,165,0.5)',
          transition:'all 0.2s',
        }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? 'Verificando...' : 'Ingresar →'}
        </button>
      </div>
    </div>
  )
}