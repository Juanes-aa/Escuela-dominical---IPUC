import { useRef, useState } from 'react'

export default function MaestroCumpleCard({ maestro, onClose }) {
  const cardRef    = useRef(null)
  const [downloading, setDownloading] = useState(false)

  const nombre       = maestro?.nombre || 'Nombre'
  const primerNombre = nombre.split(' ')[0]
  const foto         = maestro?.foto_url || null
  const iniciales    = nombre.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await document.fonts.ready
      const { default: html2canvas } = await import(
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js'
      )
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, useCORS: true, allowTaint: false,
        backgroundColor: null, logging: false,
      })
      const link = document.createElement('a')
      link.download = `cumple-maestro-${nombre}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error(err)
      alert('Error al generar la imagen. Intenta de nuevo.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700;900&family=Great+Vibes&family=Nunito:wght@600;700;800;900&display=swap');
      `}</style>

      {/* ══════════ CARD ══════════ */}
      <div ref={cardRef} style={{
        width: 400,
        minHeight: 680,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        background: 'linear-gradient(160deg, #fde8e4 0%, #f9d5cc 30%, #fce4dc 60%, #fde8e4 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 28,
        fontFamily: "'Nunito', sans-serif",
      }}>

        {/* Confetti decorativo */}
        {[
          { top:'8%',  left:'4%',  txt:'✨', sz:18, op:0.7 },
          { top:'6%',  left:'72%', txt:'✨', sz:14, op:0.6 },
          { top:'18%', left:'8%',  txt:'🎊', sz:16, op:0.5 },
          { top:'22%', left:'80%', txt:'🎉', sz:14, op:0.5 },
          { top:'60%', left:'3%',  txt:'✨', sz:12, op:0.5 },
          { top:'70%', left:'85%', txt:'✨', sz:14, op:0.6 },
          { top:'80%', left:'5%',  txt:'🎊', sz:13, op:0.45 },
        ].map((d, i) => (
          <div key={i} style={{
            position:'absolute', top:d.top, left:d.left,
            fontSize:d.sz, opacity:d.op, pointerEvents:'none', userSelect:'none',
          }}>{d.txt}</div>
        ))}

        {/* Banderines rose gold */}
        <div style={{
          position:'absolute', top:0, left:0, right:0,
          height:52, display:'flex', alignItems:'flex-start',
          justifyContent:'center', overflow:'hidden', zIndex:2,
          gap:1,
        }}>
          {Array.from({length:14}).map((_, i) => (
            <div key={i} style={{
              width:0, height:0,
              borderLeft:'18px solid transparent',
              borderRight:'18px solid transparent',
              borderTop:`38px solid ${i % 2 === 0 ? '#c9856a' : '#e8b4a0'}`,
              opacity:0.85, flexShrink:0,
            }} />
          ))}
        </div>
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:6,
          background:'rgba(160,80,60,0.3)', zIndex:3,
        }} />

        {/* Bloque "Feliz Cumple" + polaroid agrupados */}
        <div style={{ marginTop:44, zIndex:4, display:'flex', flexDirection:'column', alignItems:'center' }}>

          {/* "Feliz" pegado encima de "Cumple" */}
          <div style={{
            fontFamily:"'Great Vibes', cursive",
            fontSize:40, color:'#7a3528',
            textShadow:'1px 1px 0 rgba(255,255,255,0.5)',
            lineHeight:1, marginBottom:'-6px',
          }}>Feliz</div>

          {/* "Cumple" flotando sobre la foto */}
          <div style={{
            fontFamily:"'Dancing Script', cursive",
            fontSize:64, fontWeight:900, color:'#9b3d2b',
            textShadow:'2px 3px 0 rgba(255,255,255,0.7), 0 0 28px rgba(255,255,255,0.9)',
            lineHeight:0.85, marginBottom:'-28px',
            zIndex:6, position:'relative',
          }}>Cumple</div>

          {/* Foto estilo polaroid */}
          <div style={{
            zIndex:5,
            transform:'rotate(-3deg)',
            background:'white',
            padding:'10px 10px 36px 10px',
            boxShadow:'4px 6px 22px rgba(120,50,40,0.28), 0 2px 8px rgba(0,0,0,0.15)',
            width:260, flexShrink:0,
          }}>
            <div style={{
              width:240, height:290, overflow:'hidden',
              background:'#f5ebe6',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {foto ? (
                <img src={foto} alt={nombre} crossOrigin="anonymous"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }} />
              ) : (
                <div style={{
                  fontSize:80, color:'#c9856a', fontWeight:900,
                  fontFamily:"'Nunito', sans-serif",
                }}>{iniciales}</div>
              )}
            </div>
          </div>
        </div>

        {/* Globos esquina inferior derecha */}
        <div style={{
          position:'absolute', bottom:'-10px', right:'-10px',
          zIndex:3, lineHeight:1, userSelect:'none',
          display:'flex', flexDirection:'column', alignItems:'flex-end',
        }}>
          <div style={{ fontSize:48, transform:'rotate(-10deg)', marginBottom:'-8px', marginRight:'18px' }}>🎈</div>
          <div style={{ display:'flex', gap:2 }}>
            <div style={{ fontSize:52, transform:'rotate(6deg)' }}>🎈</div>
            <div style={{ fontSize:44, transform:'rotate(-5deg)', marginTop:6 }}>🎈</div>
          </div>
        </div>

        {/* Nombre */}
        <div style={{
          marginTop:14, zIndex:4, textAlign:'center',
          fontFamily:"'Dancing Script', cursive",
          fontSize:44, fontWeight:900, color:'#7a3528',
          lineHeight:1.1,
        }}>{primerNombre}</div>

        {/* Mensaje */}
        <div style={{
          zIndex:4, marginTop:10,
          width:'100%', maxWidth:340,
          padding:'0 20px',
          boxSizing:'border-box',
          textAlign:'center',
          fontSize:13, lineHeight:1.7,
          color:'#5a2a20',
          fontWeight:700,
        }}>
          Que Dios bendiga y guarde tu vida y la de tu familia. Esperamos que todos los anhelos de tu corazón se cumplan conforme a la voluntad que Él Señor tiene contigo. Tu trabajo es una muestra de su bondad.❤️🎂
          <br /><br />
          Gracias por hacer parte de este equipo y por la alegría que nos regalas🥹✨
        </div>

        {/* Firma */}
        <div style={{
          zIndex:4, marginTop:12,
          fontSize:13, fontWeight:800,
          color:'#9b3d2b',
          letterSpacing:0.3,
        }}>
          Con amor: Escuela Dominical 🎂
        </div>

      </div>

      {/* Botones */}
      <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:20 }}>
        <button onClick={onClose} style={{
          padding:'10px 24px', borderRadius:10,
          border:'1.5px solid rgba(155,61,43,0.25)',
          background:'rgba(155,61,43,0.05)', color:'#7a3528',
          fontSize:14, fontWeight:700, cursor:'pointer',
          fontFamily:"'Nunito', sans-serif",
        }}>Cerrar</button>

        <button onClick={handleDownload} disabled={downloading} style={{
          padding:'10px 28px', borderRadius:10, border:'none',
          background: downloading ? '#ccc' : 'linear-gradient(135deg,#c9856a,#9b3d2b)',
          color:'white', fontSize:14, fontWeight:700,
          cursor: downloading ? 'not-allowed' : 'pointer',
          boxShadow: downloading ? 'none' : '0 4px 14px rgba(155,61,43,0.4)',
          fontFamily:"'Nunito', sans-serif",
          transition:'all 0.2s',
        }}>
          {downloading ? '⏳ Generando...' : '⬇️ Descargar imagen'}
        </button>
      </div>
    </div>
  )
}
