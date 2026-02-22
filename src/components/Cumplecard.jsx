import { useRef, useState, useEffect } from 'react'

// Convierte una URL de imagen a base64 para que html2canvas pueda renderizarla sin problemas de CORS
function toBase64(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export default function CumpleCard({ nino, onClose }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)
  const [personajesB64, setPersonajesB64] = useState(null)

  // Al montar, pre-convertir /personajes.png a base64
  useEffect(() => {
    toBase64('/personajes.png').then(setPersonajesB64)
  }, [])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await document.fonts.ready

      const { default: html2canvas } = await import(
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js'
      )

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `cumpleanos-${nino?.nombre || 'card'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Error al descargar:', err)
      alert('Hubo un error al generar la imagen. Intenta de nuevo.')
    } finally {
      setDownloading(false)
    }
  }

  const [tema, setTema] = useState('rosa')

  const TEMAS = {
    rosa: {
      bg: 'linear-gradient(180deg, #fde8e8 0%, #fcd5d5 40%, #fce4d6 70%, #fde8e8 100%)',
      titulo: '#e8405a',
      nombre: '#e8405a',
      mensaje: '#5a3030',
      firma: '#c0392b',
      florBg: 'linear-gradient(135deg,#f9c5c5,#fde0c0)',
      btnDl: 'linear-gradient(135deg,#e8405a,#f39c12)',
      btnShadow: 'rgba(232,64,90,0.4)',
      label: '🌸 Rosa',
      decos: ['🌸','🌸','🌸','🌸','🌸','🌸','🌸','🌸'],
      marcoDecos: ['🌸','🌸','🌸','🌸'],
    },
    azul: {
      bg: 'linear-gradient(180deg, #e8f4fd 0%, #d0e8f8 40%, #dceffe 70%, #e8f4fd 100%)',
      titulo: '#1565c0',
      nombre: '#1565c0',
      mensaje: '#1a3a5c',
      firma: '#003DA5',
      florBg: 'linear-gradient(135deg,#b3d4f5,#cce8ff)',
      btnDl: 'linear-gradient(135deg,#003DA5,#009FDA)',
      btnShadow: 'rgba(0,61,165,0.4)',
      label: '🌊 Azul',
      decos: ['⚽','🏀','⚽','🏆','⚽','🏀','🎯','⭐'],
      marcoDecos: ['⚽','🏀','🏆','⭐'],
    },
  }

  const t = TEMAS[tema]

  const nombre       = nino?.nombre || 'Nombre'
  const primerNombre = nombre.split(' ')[0]
  const foto         = nino?.foto_url || null
  const iniciales    = nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  const BANDERIN_COLORS = ['#e74c3c','#f39c12','#27ae60','#3498db','#9b59b6']

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700;900&family=Nunito:wght@700;800;900&display=swap');
      `}</style>

      {/* Selector de tema */}
      <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:16 }}>
        {Object.entries(TEMAS).map(([key, val]) => (
          <button key={key} onClick={() => setTema(key)} style={{
            padding:'8px 20px', borderRadius:10, cursor:'pointer',
            fontSize:13, fontWeight:700,
            border:`2px solid ${tema===key ? val.titulo : 'rgba(0,0,0,0.15)'}`,
            background: tema===key ? val.titulo : 'rgba(255,255,255,0.8)',
            color: tema===key ? 'white' : '#444',
            transition:'all 0.2s',
          }}>{val.label}</button>
        ))}
      </div>

      {/* ══════════ CARD ══════════ */}
      <div ref={cardRef} style={{
        width: 480,
        minHeight: 720,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 28,
        fontFamily: "'Nunito', sans-serif",
        background: t.bg,
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 24,
      }}>

        {/* Decoración de fondo */}
        {[
          {top:'5%',  left:'2%',   size:70, op:0.5},
          {top:'12%', left:'18%',  size:50, op:0.35},
          {top:'0%',  right:'3%',  size:65, op:0.45},
          {top:'15%', right:'12%', size:45, op:0.3},
          {top:'28%', left:'1%',   size:55, op:0.4},
          {top:'32%', right:'2%',  size:60, op:0.35},
          {top:'48%', left:'5%',   size:40, op:0.3},
          {top:'52%', right:'6%',  size:45, op:0.3},
        ].map((f, i) => (
          <div key={i} style={{
            position:'absolute', top:f.top,
            left: f.left ?? undefined, right: f.right ?? undefined,
            width:f.size, height:f.size,
            opacity:f.op, pointerEvents:'none',
            fontSize:f.size * 0.85,
            lineHeight:1, userSelect:'none',
          }}>{t.decos[i]}</div>
        ))}

        {/* Banderines */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:70,
          display:'flex', alignItems:'flex-start', justifyContent:'center',
          overflow:'hidden', zIndex:2,
        }}>
          {Array.from({length:12}).map((_, i) => (
            <div key={i} style={{
              width:0, height:0,
              borderLeft:'22px solid transparent',
              borderRight:'22px solid transparent',
              borderTop:`44px solid ${BANDERIN_COLORS[i % BANDERIN_COLORS.length]}`,
              margin:'0 2px', opacity:0.9, flexShrink:0,
            }} />
          ))}
        </div>
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:8,
          background:'rgba(80,40,20,0.25)', zIndex:3,
        }} />

        {/* Wrapper relativo para título flotando sobre la foto */}
        <div style={{ position:'relative', marginTop:68, zIndex:4 }}>

          {/* Título absoluto encima de la foto */}
          <div style={{
            position:'absolute',
            top:-44, left:0, right:0,
            textAlign:'center',
            zIndex:6, pointerEvents:'none',
          }}>
            <span style={{
              fontFamily:"'Dancing Script', cursive",
              fontSize:46, fontWeight:900,
              color:t.titulo,
              textShadow:'2px 2px 0 rgba(0,0,0,0.08), 0 0 24px rgba(255,255,255,0.9)',
              whiteSpace:'nowrap',
            }}>Feliz Cumpleaños</span>
          </div>

        {/* Marco foto */}
        <div style={{
          zIndex:4,
          width:290, height:320,
          borderRadius:16,
          border:'5px solid #fff',
          boxShadow:'0 4px 24px rgba(200,100,100,0.25), 0 0 0 2px rgba(232,64,90,0.15)',
          overflow:'hidden',
          background:t.florBg,
          position:'relative',
        }}>
          <div style={{ position:'absolute', top:4, left:4,   fontSize:36, opacity:0.35, userSelect:'none' }}>{t.marcoDecos[0]}</div>
          <div style={{ position:'absolute', top:4, right:4,  fontSize:30, opacity:0.3,  userSelect:'none' }}>{t.marcoDecos[1]}</div>
          <div style={{ position:'absolute', bottom:4, left:4,  fontSize:28, opacity:0.3, userSelect:'none' }}>{t.marcoDecos[2]}</div>
          <div style={{ position:'absolute', bottom:4, right:4, fontSize:34, opacity:0.35, userSelect:'none' }}>{t.marcoDecos[3]}</div>

          {foto ? (
            <img src={foto} alt={nombre} crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
          ) : (
            <div style={{
              width:'100%', height:'100%',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:90, color:'rgba(232,64,90,0.4)', fontWeight:900,
              fontFamily:"'Nunito', sans-serif",
            }}>{iniciales}</div>
          )}
        </div>{/* fin marco foto */}
        </div>{/* fin wrapper título+foto */}

        {/* Nombre */}
        <div style={{ marginTop:10, textAlign:'center', zIndex:4, position:'relative', width:'100%' }}>
          <div style={{ position:'absolute', left:32, top:-6, fontSize:42, opacity:0.9, userSelect:'none' }}>💛</div>
          <div style={{
            fontFamily:"'Dancing Script', cursive",
            fontSize:52, fontWeight:900,
            color:t.nombre, lineHeight:1.1,
          }}>{primerNombre}</div>
        </div>

        {/* ── Mensaje con personajes ──
            La imagen usa personajesB64 (base64 pre-convertido al montar),
            html2canvas la renderiza sin ningún problema de CORS o rutas relativas.
        ── */}
        <div style={{
          marginTop:12, zIndex:4,
          position:'relative',
          width:'100%', maxWidth:400,
          padding:'16px 28px',
          boxSizing:'border-box',
        }}>
          {personajesB64 && (
            <img
              src={personajesB64}
              alt=""
              style={{
                position:'absolute',
                width:'260%',
                height:'260%',
                top:'50%', left:'50%',
                transform:'translate(-50%, -50%)',
                objectFit:'contain',
                opacity:0.2,
                pointerEvents:'none',
              }}
            />
          )}

          <div style={{
            position:'relative', zIndex:1,
            textAlign:'center',
            fontSize:15,
            color:t.mensaje,
            lineHeight:1.65,
            fontWeight:700,
            fontFamily:"'Nunito', sans-serif",
          }}>
            Hoy celebramos la vida que Dios te regaló y el propósito con el que te formó. Que en cada año aprendas a escuchar Su voz, a amar como Jesús y a brillar con la luz que Él puso en tu corazón.
          </div>
        </div>

        {/* Firma */}
        <div style={{
          zIndex:4, fontSize:16, fontWeight:900,
          color:t.firma, marginTop:4,
          fontFamily:"'Nunito', sans-serif",
          letterSpacing:0.3,
        }}>
          Con amor: Escuela Dominical.
        </div>

      </div>

      {/* Botones */}
      <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:20 }}>
        <button onClick={onClose} style={{
          padding:'10px 24px', borderRadius:10,
          border:'1.5px solid rgba(0,61,165,0.2)',
          background:'rgba(0,61,165,0.05)', color:'#003DA5',
          fontSize:14, fontWeight:700, cursor:'pointer',
          fontFamily:"'Nunito', sans-serif",
        }}>Cerrar</button>

        <button onClick={handleDownload} disabled={downloading} style={{
          padding:'10px 28px', borderRadius:10, border:'none',
          background: downloading ? '#ccc' : t.btnDl,
          color:'white', fontSize:14, fontWeight:700,
          cursor: downloading ? 'not-allowed' : 'pointer',
          boxShadow: downloading ? 'none' : `0 4px 14px ${t.btnShadow}`,
          fontFamily:"'Nunito', sans-serif",
          transition:'all 0.2s',
        }}>
          {downloading ? '⏳ Generando...' : '⬇️ Descargar imagen'}
        </button>
      </div>
    </div>
  )
}