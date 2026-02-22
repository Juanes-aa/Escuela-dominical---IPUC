import { useState, useEffect } from 'react'
import FormField, { Input, Select } from './FormField'
import FotoUploader from './FotoUploader'

const C = { navy: '#003DA5', blue: '#009FDA' }

const ROLES = ['Líder', 'Sublíder', 'Secretario/a', 'Tesorero/a', 'Vocal']
const EMPTY = { nombre: '', rol: 'Líder', documento: '', celular: '', email: '', foto_url: '', notas: '' }

export default function MiembroForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => initial ? { ...EMPTY, ...initial } : { ...EMPTY })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  useEffect(() => {
    setF(initial ? { ...EMPTY, ...initial } : { ...EMPTY })
  }, [initial?.id])

  const handleSave = () => {
    if (!f.nombre.trim()) { alert('El nombre es obligatorio'); return }
    onSave(f)
  }

  return (
    <div>
      <style>{`
        .miembro-form-grid { grid-template-columns: 1fr 1fr; }
        .miembro-form-btns { justify-content: flex-end; flex-direction: row; }
        @media (max-width: 540px) {
          .miembro-form-grid { grid-template-columns: 1fr !important; }
          .miembro-form-grid > * { grid-column: 1 / -1 !important; }
          .miembro-form-btns { flex-direction: column-reverse !important; }
          .miembro-form-btns button { width: 100% !important; }
        }
      `}</style>

      <div className="miembro-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

        <FotoUploader value={f.foto_url} onChange={v => set('foto_url', v)} label="Foto del miembro" />

        <FormField label="Nombre completo" full>
          <Input value={f.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre completo del miembro" />
        </FormField>

        <FormField label="Rol">
          <Select value={f.rol} onChange={e => set('rol', e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </Select>
        </FormField>

        <FormField label="Documento de identidad">
          <Input value={f.documento} onChange={e => set('documento', e.target.value)} placeholder="Número de cédula" />
        </FormField>

        <FormField label="Celular">
          <Input value={f.celular} onChange={e => set('celular', e.target.value)} placeholder="3XX XXX XXXX" />
        </FormField>

        <FormField label="Correo electrónico" full>
          <Input type="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
        </FormField>

        <FormField label="Notas" full>
          <textarea
            value={f.notas}
            onChange={e => set('notas', e.target.value)}
            placeholder="Información adicional..."
            style={{
              width:'100%', boxSizing:'border-box', padding:'10px 14px',
              border:'1.5px solid rgba(0,61,165,0.2)', borderRadius:10, fontSize:14,
              background:'rgba(255,255,255,0.8)', outline:'none', resize:'vertical', minHeight:72,
              fontFamily:"'DM Sans',sans-serif",
            }}
          />
        </FormField>

      </div>

      {/* Botones */}
      <div className="miembro-form-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
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