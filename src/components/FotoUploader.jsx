import { useState, useRef, useEffect } from 'react'

const C = { navy: '#003DA5', blue: '#009FDA' }

export default function FotoUploader({ value, onChange, label = 'Foto del maestro/a' }) {
  const inputRef   = useRef(null)
  const [preview,  setPreview]  = useState(value || '')
  const [dragging, setDragging] = useState(false)
  const [urlMode,  setUrlMode]  = useState(false)

  useEffect(() => { setPreview(value || '') }, [value])

  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => { setPreview(e.target.result); onChange(e.target.result) }
    reader.readAsDataURL(file)
  }

  const handleDrop = e => {
    e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0])
  }

  const handleRemove = e => {
    e.stopPropagation()
    setPreview(''); onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <style>{`
        .foto-dropzone {
          flex-direction: row;
          padding: 14px 20px;
        }
        .foto-dropzone-avatar {
          width: 64px; height: 64px;
        }
        @media (max-width: 480px) {
          .foto-dropzone {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
            padding: 18px 14px !important;
          }
          .foto-dropzone-avatar {
            width: 80px !important; height: 80px !important;
          }
        }
      `}</style>

      {/* Label */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <label style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:C.navy }}>
          {label}
        </label>
        <span style={{ fontSize:10, color:'#aaa', fontWeight:600, background:'rgba(0,0,0,0.05)', padding:'2px 8px', borderRadius:10, letterSpacing:0.5, textTransform:'uppercase' }}>
          opcional
        </span>
      </div>

      {preview ? (
        /* ── CON FOTO ── */
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
          <div style={{
            position:'relative', width:110, height:110,
            borderRadius:18, overflow:'hidden',
            border:'3px solid rgba(0,61,165,0.2)',
            boxShadow:'0 4px 16px rgba(0,61,165,0.15)',
          }}>
            <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <button type="button" onClick={handleRemove} title="Quitar foto" style={{
              position:'absolute', top:6, right:6,
              width:22, height:22, borderRadius:'50%',
              background:'rgba(0,0,0,0.6)', color:'white',
              border:'none', cursor:'pointer', fontSize:11,
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700,
            }}>✕</button>
          </div>
          <button type="button" onClick={() => inputRef.current?.click()} style={{
            padding:'7px 18px', background:'rgba(0,61,165,0.07)', color:C.navy,
            border:'1px solid rgba(0,61,165,0.2)', borderRadius:8,
            fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
          }}>🔄 Cambiar foto</button>
          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => handleFile(e.target.files[0])} />
        </div>
      ) : (
        /* ── SIN FOTO: drop zone ── */
        <div
          className="foto-dropzone"
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            display:'flex', alignItems:'center', gap:16,
            border:`2px dashed ${dragging ? C.blue : '#D6EEFA'}`,
            borderRadius:14,
            background: dragging ? 'rgba(0,159,218,0.05)' : '#F8FBFF',
            cursor:'pointer', transition:'all 0.15s',
          }}
        >
          {/* Avatar placeholder */}
          <div className="foto-dropzone-avatar" style={{
            flexShrink:0, borderRadius:14,
            background:'rgba(0,61,165,0.06)',
            border:'2px dashed rgba(0,61,165,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:28,
          }}>👤</div>

          {/* Texto + botón */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:'#555', fontWeight:500, marginBottom:8 }}>
              Arrastra una foto aquí o
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click() }} style={{
              padding:'7px 18px',
              background:`linear-gradient(135deg, ${C.navy}, ${C.blue})`,
              color:'white', border:'none', borderRadius:8,
              fontSize:12, fontWeight:700, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif",
              boxShadow:'0 3px 10px rgba(0,61,165,0.3)',
            }}>Seleccionar imagen</button>
          </div>

          <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}

      {/* Toggle URL manual */}
      <button type="button" onClick={() => setUrlMode(v => !v)} style={{
        marginTop:8, background:'none', border:'none', color:C.blue,
        fontSize:11, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
        padding:0, fontWeight:600, textDecoration:'underline', display:'block',
      }}>
        {urlMode ? '▲ Ocultar URL manual' : '🔗 O pegar URL de imagen'}
      </button>

      {urlMode && (
        <input
          value={preview.startsWith('data:') ? '' : preview}
          onChange={e => { setPreview(e.target.value); onChange(e.target.value) }}
          placeholder="https://... (URL de Supabase Storage u otro)"
          style={{
            marginTop:6, width:'100%', boxSizing:'border-box',
            padding:'10px 14px', border:'2px solid #D6EEFA', borderRadius:10,
            fontSize:14, fontFamily:"'DM Sans',sans-serif",
            background:'#F8FBFF', color:'#0A1628', outline:'none',
            transition:'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = C.blue}
          onBlur={e => e.target.style.borderColor = '#D6EEFA'}
        />
      )}
    </div>
  )
}