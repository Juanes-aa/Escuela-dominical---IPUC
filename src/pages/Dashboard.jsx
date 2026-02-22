import Avatar from '../components/Avatar'
import { MESES, GRUPO_CONFIG } from '../data/ninos'
import { calcAge } from '../lib/utils'

const C = { blue:'#009FDA', navy:'#003DA5', yellow:'#F0AB00', dark:'#001F5B' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.6)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
  borderRadius: 18,
}

function StatCard({ val, label, icon, accent, delay = 0 }) {
  return (
    <div className="animate-fadeUp" style={{
      ...glass, padding: '16px 18px',
      borderTop: `3px solid ${accent}`,
      position: 'relative', overflow: 'hidden',
      animationDelay: `${delay}s`,
    }}>
      <div style={{ position:'absolute', right:12, top:10, fontSize:30, opacity:0.12 }}>{icon}</div>
      <div style={{ fontSize:30, fontWeight:800, color:accent, lineHeight:1, fontFamily:"'DM Sans',sans-serif" }}>{val}</div>
      <div style={{ fontSize:11, color:'#444', marginTop:5, fontWeight:600 }}>{label}</div>
    </div>
  )
}

function GlassCard({ title, children, maxHeight }) {
  return (
    <div style={{ ...glass, padding:20, overflow:'hidden' }}>
      <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:C.navy, margin:'0 0 14px' }}>{title}</h2>
      <div style={{ maxHeight, overflowY: maxHeight ? 'auto' : 'visible' }}>
        {children}
      </div>
    </div>
  )
}

export default function Dashboard({ ninos, maestros, asistencia, user }) {
  const now          = new Date()
  const mesActualIdx = now.getMonth()
  const mes          = MESES[mesActualIdx]

  const cumples = ninos
    .filter(n => n.fecha_nacimiento && new Date(n.fecha_nacimiento).getMonth() === mesActualIdx)
    .sort((a, b) => new Date(a.fecha_nacimiento).getDate() - new Date(b.fecha_nacimiento).getDate())

  const alertas      = ninos.filter(n => n.alergias && n.alergias !== 'Ninguna')
  const sinImagen    = ninos.filter(n => n.autorizacion_imagen === 'No')
  const ultimaFecha  = Object.keys(asistencia).sort().slice(-1)[0]
  const ultimosPresentes = ultimaFecha ? asistencia[ultimaFecha].length : 0

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
        <div>
          <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize:22, fontWeight:800, color:C.navy, margin:'0 0 2px', letterSpacing:-0.5 }}>
            Bienvenido/a
          </h1>
          <p style={{ color:'#555', fontSize:12, margin:0 }}>
            IPUC Calasanz · {now.toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>
        </div>
      </div>

      {/* Stats: 2 cols móvil → 4 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard val={ninos.length}                                              label="Total inscritos"              icon="👶" accent={C.navy}    delay={0}    />
        <StatCard val={ninos.filter(n=>n.grupo==='Pequeños Navegantes').length}   label="⛵ Pequeños Navegantes (3–5)" icon="⛵" accent="#F97316"   delay={0.06} />
        <StatCard val={ninos.filter(n=>n.grupo==='Firmes en el Puerto').length}   label="⚓ Firmes en el Puerto (6–8)" icon="⚓" accent={C.blue}    delay={0.12} />
        <StatCard val={ninos.filter(n=>n.grupo==='Guardianes del Puerto').length} label="🛡️ Guardianes del Puerto"    icon="🛡️" accent={C.yellow} delay={0.18} />
      </div>

      {/* Lema banner */}
      <div style={{
        ...glass,
        background:'rgba(0,30,100,0.65)',
        backdropFilter:'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
        border:'1px solid rgba(255,255,255,0.2)',
        borderRadius:14, padding:'12px 18px', marginBottom:20,
        display:'flex', alignItems:'center', gap:12,
      }}>
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:C.yellow, letterSpacing:1.5, textTransform:'uppercase' }}>Lema 2026</div>
          <div style={{ fontSize:14, color:'white', fontWeight:600 }}>Jesús mi puerto seguro</div>
        </div>
      </div>

      {/* Main grid: 1 col móvil → 2 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <GlassCard title={`🎂 Cumpleaños en ${mes} · ${cumples.length}`} maxHeight={280}>
          {cumples.length === 0
            ? <div style={{ textAlign:'center', padding:'24px 0', color:'#aaa', fontSize:13 }}>🎈 Sin cumpleaños este mes</div>
            : cumples.map(n => (
              <div key={n.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(0,61,165,0.07)' }}>
                <Avatar name={n.nombre} size={34} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{n.nombre}</div>
                  <div style={{ fontSize:11, color:'#888' }}>{n.grupo}{n.fecha_nacimiento ? ` · ${calcAge(n.fecha_nacimiento)} años` : ''}</div>
                </div>
                <span style={{ fontSize:18 }}>🎂</span>
              </div>
            ))
          }
        </GlassCard>

        <GlassCard title={`⚠️ Alertas médicas · ${alertas.length}`} maxHeight={280}>
          {alertas.map(n => (
            <div key={n.id} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(0,61,165,0.07)' }}>
              <span style={{ fontSize:18, flexShrink:0 }}>🏥</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{n.nombre}</div>
                <div style={{ fontSize:11, color:'#C05621', marginTop:1 }}>{n.alergias}</div>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard title="📊 Estadísticas generales">
          {[
            ['📸 Con autorización de imagen', ninos.filter(n=>n.autorizacion_imagen==='Sí').length, C.blue],
            ['🚫 Sin autorización de imagen', sinImagen.length, '#EF4444'],
            ['🙏 Acudiente bautizado',         ninos.filter(n=>n.acudiente_bautizado==='Sí').length, C.yellow],
            ['👨‍🏫 Maestros activos',            maestros.length, C.navy],
            ['✅ Presentes último domingo',     ultimosPresentes, '#10B981'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(0,61,165,0.07)' }}>
              <span style={{ fontSize:13, color:'#444' }}>{label}</span>
              <strong style={{ color, fontSize:20, fontWeight:800 }}>{val}</strong>
            </div>
          ))}
        </GlassCard>

        <GlassCard title="🚫 Sin autorización de imagen" maxHeight={260}>
          {sinImagen.length === 0
            ? <div style={{ textAlign:'center', padding:'24px 0', color:'#aaa', fontSize:13 }}>✅ Todos tienen autorización</div>
            : sinImagen.map(n => (
              <div key={n.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(0,61,165,0.07)' }}>
                <Avatar name={n.nombre} size={30} />
                <div>
                  <div style={{ fontSize:13, fontWeight:500 }}>{n.nombre}</div>
                  <div style={{ fontSize:11, color:'#aaa' }}>{n.grupo}</div>
                </div>
              </div>
            ))
          }
        </GlassCard>

      </div>
    </div>
  )
}