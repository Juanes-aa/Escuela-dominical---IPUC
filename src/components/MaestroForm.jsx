import { useState, useEffect } from 'react'
import FormField, { Input, Select } from './FormField'
import FotoUploader from './FotoUploader'
import { GRUPOS } from '../data/ninos'

const C = { navy: '#003DA5', blue: '#009FDA' }

const ROLES = ['Maestra', 'Maestro', 'Coordinadora', 'Coordinador', 'Auxiliar']
const EMPTY = { nombre: '', rol: 'Maestra', clase: 'Pequeños Navegantes', celular: '', email: '', foto_url: '' }

export default function MaestroForm({ initial, onSave, onClose }) {
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
        .maestro-form-grid { grid-template-columns: 1fr 1fr; }
        .maestro-form-btns { justify-content: flex-end; flex-direction: row; }
        @media (max-width: 540px) {
          .maestro-form-grid { grid-template-columns: 1fr !important; }
          .maestro-form-grid > * { grid-column: 1 / -1 !important; }
          .maestro-form-btns { flex-direction: column-reverse !important; }
          .maestro-form-btns button { width: 100% !important; }
        }
      `}</style>

      <div className="maestro-form-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

        <FotoUploader value={f.foto_url} onChange={v => set('foto_url', v)} label="Foto del maestro/a" />

        <FormField label="Nombre completo" full>
          <Input value={f.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Nombre completo del maestro/a" />
        </FormField>

        <FormField label="Rol">
          <Select value={f.rol} onChange={e => set('rol', e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </Select>
        </FormField>

        <FormField label="Clase asignada">
          <Select value={f.clase} onChange={e => set('clase', e.target.value)}>
            {[...GRUPOS, 'Todas'].map(g => <option key={g}>{g}</option>)}
          </Select>
        </FormField>

        <FormField label="Celular">
          <Input value={f.celular} onChange={e => set('celular', e.target.value)} placeholder="3XX XXX XXXX" />
        </FormField>

        <FormField label="Correo electrónico" full>
          <Input type="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="correo@ejemplo.com" />
        </FormField>

      </div>

      {/* Botones */}
      <div className="maestro-form-btns" style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:24, paddingTop:16, borderTop:'1px solid rgba(0,61,165,0.1)' }}>
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