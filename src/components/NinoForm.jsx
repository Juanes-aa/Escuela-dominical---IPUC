import { useState, useEffect, useRef } from 'react'
import FormField, { Input, Select, Textarea } from './FormField'
import { MESES, GRUPOS } from '../data/ninos'

const EMPTY = {
  grupo: 'Pequeños Navegantes', nombre: '', mes_cumple: 'enero', fecha_nacimiento: '',
  alergias: 'Ninguna', eps: '', direccion: '', acudiente: '', parentesco: 'Mamá/Papá',
  acudiente_bautizado: 'Sí', celular: '', autorizacion_imagen: 'Sí', foto_url: ''
}

const C = { navy: '#003DA5', blue: '#009FDA', yellow: '#F0AB00' }

function FotoUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(value || '')
  const [dragging, setDragging] = useState(false)
  const [urlMode, setUrlMode] = useState(false)

  useEffect(() => { setPreview(value || '') }, [value])

  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => { setPreview(e.target.result); onChange(e.target.result) }
    reader.readAsDataURL(file)
  }

  const handleDrop = e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  const handleRemove = () => { setPreview(''); onChange(''); if (inputRef.current) inputRef.current.value = '' }

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <label style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:C.navy }}>
          Foto del niño/a
        </label>
        <span style={{ fontSize:10, color:'#aaa', fontWeight:600, background:'rgba(0,0,0,0.05)', padding:'2px 8px', borderRadius:10, letterSpacing:0.5, textTransform:'uppercase' }}>
          opcional
        </span>
      </div>

      {/* En móvil: apilado vertical; en desktop: lado a lado */}
      <div className="foto-uploader-layout" style={{ display:'flex', gap:16, alignItems:'flex-start' }}>

        {/* Preview */}
        <div style={{
          width:88, height:88, flexShrink:0,
          borderRadius:14, overflow:'hidden',
          border: preview ? '2px solid rgba(0,61,165,0.25)' : '2px dashed #D6EEFA',
          background: preview ? 'transparent' : '#F8FBFF',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          {preview ? (
            <>
              <img src={preview} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <button type="button" onClick={handleRemove} title="Quitar foto" style={{
                position:'absolute', top:4, right:4, width:20, height:20, borderRadius:'50%',
                background:'rgba(0,0,0,0.55)', color:'white', border:'none', cursor:'pointer',
                fontSize:11, display:'flex', alignItems:'center', justifyContent:'center',
              }}>✕</button>
            </>
          ) : <span style={{ fontSize:30 }}>👤</span>}
        </div>

        {/* Drop zone */}
        <div style={{ flex:1 }}>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border:`2px dashed ${dragging ? C.blue : '#D6EEFA'}`,
              borderRadius:12, padding:'16px 14px',
              background: dragging ? 'rgba(0,159,218,0.05)' : '#F8FBFF',
              textAlign:'center', transition:'all 0.15s', cursor:'pointer',
            }}
          >
            <div style={{ fontSize:22, marginBottom:4 }}>🖼️</div>
            <div style={{ fontSize:12, color:'#666', fontWeight:500, marginBottom:8 }}>
              Arrastra una foto aquí o
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); inputRef.current?.click() }} style={{
              padding:'7px 16px', background:`linear-gradient(135deg, ${C.navy}, ${C.blue})`,
              color:'white', border:'none', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer',
              boxShadow:'0 3px 10px rgba(0,61,165,0.3)',
            }}>
              Seleccionar imagen
            </button>
            <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>

          <button type="button" onClick={() => setUrlMode(v => !v)} style={{
            marginTop:8, background:'none', border:'none', color:C.blue,
            fontSize:11, cursor:'pointer', padding:0, fontWeight:600, textDecoration:'underline',
          }}>
            {urlMode ? '▲ Ocultar URL manual' : '🔗 O pegar URL de imagen'}
          </button>

          {urlMode && (
            <input
              value={preview.startsWith('data:') ? '' : preview}
              onChange={e => { setPreview(e.target.value); onChange(e.target.value) }}
              placeholder="https://..."
              style={{
                marginTop:6, width:'100%', boxSizing:'border-box', padding:'10px 14px',
                border:'2px solid #D6EEFA', borderRadius:10, fontSize:14,
                background:'#F8FBFF', color:'#0A1628', outline:'none',
              }}
              onFocus={e => e.target.style.borderColor = C.blue}
              onBlur={e => e.target.style.borderColor = '#D6EEFA'}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function NinoForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => initial ? { ...EMPTY, ...initial } : { ...EMPTY })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  useEffect(() => { setF(initial ? { ...EMPTY, ...initial } : { ...EMPTY }) }, [initial?.id])

  const handleSave = () => {
    if (!f.nombre.trim()) { alert('El nombre es obligatorio'); return }
    onSave(f)
  }

  return (
    <div>
      <style>{`
        .nino-form-grid { grid-template-columns: 1fr 1fr; }
        .nino-form-btns { justify-content: flex-end; flex-direction: row; }
        @media (max-width: 540px) {
          .nino-form-grid { grid-template-columns: 1fr !important; }
          .nino-form-grid > * { grid-column: 1 / -1 !important; }
          .foto-uploader-layout { flex-direction: column; align-items: stretch; }
          .foto-uploader-layout > div:first-child { width: 100% !important; height: 140px !important; }
          .nino-form-btns { flex-direction: column-reverse !important; }
          .nino-form-btns button { width: 100% !important; text-align: center; }
        }
      `}</style>

      <div className="nino-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

        <FotoUploader value={f.foto_url} onChange={v => set('foto_url', v)} />

        <FormField label="Nombre completo" full>
          <Input value={f.nombre} onChange={e => set('nombre', e.target.value)}
            placeholder="Nombres y apellidos completos"
            onKeyDown={e => e.key === 'Enter' && handleSave()} />
        </FormField>

        <FormField label="Grupo de clase">
          <Select value={f.grupo} onChange={e => set('grupo', e.target.value)}>
            {GRUPOS.map(g => <option key={g} value={g}>{g}</option>)}
          </Select>
        </FormField>

        <FormField label="Mes de cumpleaños">
          <Select value={f.mes_cumple} onChange={e => set('mes_cumple', e.target.value)}>
            {MESES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
          </Select>
        </FormField>

        <FormField label="Fecha de nacimiento">
          <Input type="date" value={f.fecha_nacimiento} onChange={e => set('fecha_nacimiento', e.target.value)} />
        </FormField>

        <FormField label="EPS">
          <Input value={f.eps} onChange={e => set('eps', e.target.value)} placeholder="Nombre de la EPS" />
        </FormField>

        <FormField label="Celular del acudiente">
          <Input value={f.celular} onChange={e => set('celular', e.target.value)} placeholder="3XX XXX XXXX" />
        </FormField>

        <FormField label="Dirección" full>
          <Input value={f.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Dirección de residencia" />
        </FormField>

        <FormField label="Alergias / Enfermedades / Condiciones" full>
          <Textarea value={f.alergias} onChange={e => set('alergias', e.target.value)} placeholder="Ninguna" rows={2} />
        </FormField>

        <FormField label="Acudiente">
          <Input value={f.acudiente} onChange={e => set('acudiente', e.target.value)} placeholder="Nombre completo del acudiente" />
        </FormField>

        <FormField label="Parentesco">
          <Select value={f.parentesco} onChange={e => set('parentesco', e.target.value)}>
            {['Mamá/Papá','Abuela/Abuelo','Tío/Tía','Hermana','Hermano','Otro'].map(p =>
              <option key={p} value={p}>{p}</option>
            )}
          </Select>
        </FormField>

        <FormField label="Acudiente bautizado">
          <Select value={f.acudiente_bautizado} onChange={e => set('acudiente_bautizado', e.target.value)}>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </Select>
        </FormField>

        <FormField label="Autorización uso de imagen">
          <Select value={f.autorizacion_imagen} onChange={e => set('autorizacion_imagen', e.target.value)}>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </Select>
        </FormField>

      </div>

      {/* Botones */}
      <div className="nino-form-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
        <button onClick={onClose} style={{
          padding:'10px 22px', background:'rgba(0,61,165,0.07)', color:C.navy,
          border:'1px solid rgba(0,61,165,0.2)', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, cursor:'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.13)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,61,165,0.07)'}
        >Cancelar</button>
        <button onClick={handleSave} style={{
          padding:'10px 26px', background:`linear-gradient(135deg, ${C.navy}, ${C.blue})`,
          color:'white', border:'none', borderRadius:10,
          fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:'pointer',
          boxShadow:'0 4px 14px rgba(0,61,165,0.35)', transition:'transform 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >💾 Guardar</button>
      </div>
    </div>
  )
}