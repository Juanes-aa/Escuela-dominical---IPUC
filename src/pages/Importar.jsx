import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { GRUPOS, MESES } from '../data/ninos'

const C = { blue: '#009FDA', navy: '#003DA5', yellow: '#F0AB00' }

const glass = {
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 4px 24px rgba(0,30,100,0.1)',
}

const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

const normalize = (str = '') => str?.toString().trim()

function parseFecha(raw) {
  if (!raw) return null
  if (raw instanceof Date && !isNaN(raw)) return raw.toISOString().split('T')[0]
  if (typeof raw === 'number') {
    const date = XLSX.SSF.parse_date_code(raw)
    if (date) return `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`
  }
  if (typeof raw === 'string') {
    // DD/MM/YYYY o D/M/YYYY (formato colombiano)
    const m = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (m) {
      const [, d, mo, y] = m
      if (parseInt(y) > 1900)
        return `${y}-${mo.padStart(2,'0')}-${d.padStart(2,'0')}`
    }
  }
  const parsed = new Date(raw)
  if (!isNaN(parsed)) return parsed.toISOString().split('T')[0]
  return null
}

function mesDesdeFecha(fechaISO) {
  if (!fechaISO) return null
  return MESES_ES[parseInt(fechaISO.split('-')[1], 10) - 1] ?? null
}

const canonizarClase = (clase = '') => {
  const n = clase.toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim()
  if (n.includes('peque') || n.includes('naveg')) return 'Pequeños Navegantes'
  if (n.includes('firme')) return 'Firmes en el Puerto'
  if (n.includes('guardian')) return 'Guardianes del Puerto'
  // Usar el primer número del rango (ej: "7-9 años" → 7)
  const primer = parseInt((n.match(/\d+/) || [])[0])
  if (!isNaN(primer)) {
    if (primer <= 6)  return 'Pequeños Navegantes'
    if (primer <= 9)  return 'Firmes en el Puerto'
    return 'Guardianes del Puerto'
  }
  for (const g of GRUPOS) {
    if (g.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'') === n) return g
  }
  return clase || 'Pequeños Navegantes'
}

// ── Niños ──────────────────────────────────────────────────────────────────
function mapNino(row) {
  const rawFecha = row['Fecha nacimiento'] ?? row['fecha_nacimiento'] ?? null
  const fechaISO = parseFecha(rawFecha)
  const mesExcel = normalize(row['Mes Cumple'] ?? row['mes_cumple'] ?? '').toLowerCase()
  const mes_cumple = (mesExcel && MESES_ES.includes(mesExcel)) ? mesExcel : (mesDesdeFecha(fechaISO) ?? '')
  return {
    item:                normalize(row['ITEM'] ?? row['Item'] ?? 0),
    grupo:               normalize(row['Grupo de  Clase'] ?? row['Grupo de Clase'] ?? row['grupo'] ?? 'Pequeños Navegantes'),
    nombre:              normalize(row['Nombre completo'] ?? row['nombre'] ?? ''),
    mes_cumple,
    fecha_nacimiento:    fechaISO,
    alergias:            normalize(row['Alergias/ enfermedades/ condiciones'] ?? row['alergias'] ?? 'Ninguna'),
    eps:                 normalize(row['EPS'] ?? row['eps'] ?? ''),
    direccion:           normalize(row['Dirección'] ?? row['direccion'] ?? ''),
    acudiente:           normalize(row['Acudiente'] ?? row['acudiente'] ?? ''),
    parentesco:          normalize(row['Parentesco'] ?? row['parentesco'] ?? ''),
    acudiente_bautizado: normalize(row['Acudiente bautizado'] ?? row['acudiente_bautizado'] ?? 'No'),
    celular:             normalize(row['Celular'] ?? row['celular'] ?? ''),
    autorizacion_imagen: normalize(row['Autorización Uso de Imagen'] ?? row['autorizacion_imagen'] ?? 'No'),
    foto_url: '',
  }
}

const COLUMNAS_NINOS = [
  'ITEM', 'Grupo de  Clase', 'Nombre completo', 'Mes Cumple', 'Fecha nacimiento',
  'Alergias/ enfermedades/ condiciones', 'EPS', 'Dirección', 'Acudiente',
  'Parentesco', 'Acudiente bautizado', 'Celular', 'Autorización Uso de Imagen',
]

// ── Maestros ───────────────────────────────────────────────────────────────
function mapMaestro(row) {
  const cargo = normalize(row['Cargo'] ?? row['cargo'] ?? 'Maestro')
  const rawFecha = row['Fecha Cumpleaños'] ?? row['Fecha Cumpleanos'] ?? row['fecha_nacimiento'] ?? null
  return {
    nombre:           normalize(row['Nombre y apellido'] ?? row['Nombre completo'] ?? row['nombre'] ?? ''),
    rol:              cargo,
    clase:            canonizarClase(row['Clase'] ?? row['clase'] ?? ''),
    celular:          normalize(row['Celular'] ?? row['celular'] ?? ''),
    email:            normalize(row['Email'] ?? row['email'] ?? row['Correo'] ?? ''),
    foto_url:         '',
    fecha_nacimiento: parseFecha(rawFecha) ?? '',
  }
}

const COLUMNAS_MAESTROS = [
  'Item', 'Clase', 'Cargo', 'Nombre y apellido', 'Celular',
  'Mes Cumple', 'Fecha Cumpleaños', 'Dirección',
  'Bautizado con el E.S', 'Bautizado en agua', 'Foto',
]

// ── Componente de zona de carga + preview ──────────────────────────────────
function ImportPanel({ tipo, addFn, mapRow, columnas, previewCols, tips }) {
  const [preview,  setPreview]  = useState([])
  const [status,   setStatus]   = useState('')
  const [error,    setError]    = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const processFile = file => {
    if (!file) return
    setError(''); setStatus('Leyendo archivo...')
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const wb   = XLSX.read(ev.target.result, { type: 'binary', cellDates: true })
        const ws   = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const rows = data.map(mapRow).filter(r => r.nombre)
        setPreview(rows)
        setStatus(`${rows.length} registros encontrados. Revisa la vista previa antes de importar.`)
      } catch (err) {
        setError('Error al leer el archivo: ' + err.message)
        setStatus('')
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleImport = async () => {
    setStatus('Importando...'); setError('')
    let exitosos = 0, errores = []
    for (const row of preview) {
      const { error } = await addFn(row)
      if (error) errores.push(`${row.nombre}: ${error.message}`)
      else exitosos++
    }
    if (errores.length) setError(errores.join('\n'))
    setStatus(`🎉 ${exitosos} ${tipo} importados correctamente.`)
    if (exitosos > 0) { setPreview([]); if (fileRef.current) fileRef.current.value = '' }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Zona de carga */}
        <div style={{ ...glass, borderRadius: 18, padding: 24 }}>
          <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: C.navy, margin: '0 0 16px' }}>
            📂 Seleccionar archivo Excel
          </h2>
          <div
            onClick={() => fileRef.current.click()}
            onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            style={{
              border: `2px dashed ${dragging ? C.yellow : 'rgba(0,61,165,0.25)'}`,
              borderRadius: 14, padding: '44px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? 'rgba(240,171,0,0.06)' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!dragging) { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = 'rgba(0,159,218,0.05)' } }}
            onMouseLeave={e => { if (!dragging) { e.currentTarget.style.borderColor = 'rgba(0,61,165,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.4)' } }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>📊</div>
            <div style={{ fontWeight: 700, color: C.navy, fontSize: 15, marginBottom: 6 }}>
              {dragging ? '¡Suelta el archivo aquí!' : 'Haz clic o arrastra tu archivo'}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>Formatos: .xlsx · .xls — La primera fila debe tener los encabezados</div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={e => processFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>

          {status && !error && (
            <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, fontSize: 14, color: '#065F46' }}>
              ✅ {status}
            </div>
          )}
          {error && (
            <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 14, color: '#991B1B', whiteSpace: 'pre-line' }}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Vista previa */}
        {preview.length > 0 && (
          <div style={{ ...glass, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F0AB00', background: 'rgba(0,61,165,0.05)' }}>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: C.navy }}>
                  👁️ Vista previa — {preview.length} registros
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Revisa los datos antes de confirmar</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setPreview([]); if (fileRef.current) fileRef.current.value = '' }} style={{
                  padding: '9px 16px', background: 'rgba(239,68,68,0.08)', color: '#991B1B',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
                  fontFamily:"'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>✕ Cancelar</button>
                <button onClick={handleImport} style={{
                  padding: '9px 20px', background: 'linear-gradient(135deg,#003DA5,#009FDA)',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontFamily:"'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,61,165,0.35)',
                }}>✅ Confirmar e importar</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,61,165,0.06)' }}>
                    {previewCols.map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, borderBottom: '1px solid rgba(0,61,165,0.1)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 30).map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,61,165,0.06)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {previewCols.map(col => {
                        const key = col === '#' ? 'item' : col === 'Nombre' ? 'nombre' : col === 'Grupo/Clase' ? (r.grupo ?? r.clase) : col === 'Cumpleaños' ? 'mes_cumple' : col === 'Acudiente' ? 'acudiente' : col === 'Celular' ? 'celular' : col === 'Rol' ? 'rol' : col === 'Clase' ? 'clase' : col
                        const val = col === '#' ? (r.item || i+1) : col === 'Nombre' ? r.nombre : col === 'Grupo/Clase' ? (r.grupo ?? r.clase) : col === 'Cumpleaños' ? (r.mes_cumple || '—') : col === 'Acudiente' ? r.acudiente : col === 'Celular' ? r.celular : col === 'Rol' ? r.rol : col === 'Clase' ? r.clase : r[col] ?? '—'
                        return <td key={col} style={{ padding: '9px 14px', fontSize: col === '#' ? 12 : 13, fontWeight: col === 'Nombre' ? 600 : 400, color: col === '#' ? '#bbb' : '#555', textTransform: col === 'Cumpleaños' ? 'capitalize' : 'none' }}>{val}</td>
                      })}
                    </tr>
                  ))}
                  {preview.length > 30 && (
                    <tr><td colSpan={previewCols.length} style={{ padding: '12px 14px', textAlign: 'center', color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>
                      ... y {preview.length - 30} registros más
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Panel lateral */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ ...glass, borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, marginBottom: 14 }}>
            📋 Columnas del Excel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {columnas.map((col, i) => (
              <div key={col} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 8,
                background: i % 2 === 0 ? 'rgba(0,61,165,0.05)' : 'rgba(0,159,218,0.04)',
                border: '1px solid rgba(0,61,165,0.08)',
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.blue, minWidth: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#333', wordBreak: 'break-all' }}>{col}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...glass, borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, marginBottom: 12 }}>
            💡 Tips
          </div>
          {tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 9, fontSize: 12, color: '#555' }}>
              <span style={{ color: C.yellow, flexShrink: 0, fontWeight: 800 }}>→</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────────────
export default function Importar({ addNino, addMaestro }) {
  const [tab, setTab] = useState('ninos')

  const tabBtn = (id, label) => (
    <button onClick={() => setTab(id)} style={{
      padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
      fontFamily:"'DM Sans',sans-serif", fontSize: 14, fontWeight: 700,
      background: tab === id ? `linear-gradient(135deg, ${C.navy}, ${C.blue})` : 'rgba(0,61,165,0.07)',
      color: tab === id ? 'white' : C.navy,
      boxShadow: tab === id ? '0 4px 14px rgba(0,61,165,0.3)' : 'none',
      transition: 'all 0.18s',
    }}>{label}</button>
  )

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily:"'DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: C.navy, margin: '0 0 2px' }}>
          📥 Importar desde Excel
        </h1>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Carga masiva desde archivo .xlsx</p>
      </div>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
        {tabBtn('ninos',    '👨‍👧‍👦 Niños')}
        {tabBtn('maestros', '👩‍🏫 Maestros')}
      </div>

      {tab === 'ninos' && (
        <ImportPanel
          tipo="niños"
          addFn={addNino}
          mapRow={mapNino}
          columnas={COLUMNAS_NINOS}
          previewCols={['#', 'Nombre', 'Grupo/Clase', 'Cumpleaños', 'Acudiente', 'Celular']}
          tips={[
            'La primera fila debe tener los encabezados exactos',
            'El mes de cumpleaños se deriva automáticamente de la fecha si el campo "Mes Cumple" está vacío',
            'La fecha de nacimiento puede estar en formato de Excel o YYYY-MM-DD',
            'Los grupos deben coincidir con: Pequeños Navegantes, Firmes en el Puerto o Guardianes del Puerto',
          ]}
        />
      )}

      {tab === 'maestros' && (
        <ImportPanel
          tipo="maestros"
          addFn={addMaestro}
          mapRow={mapMaestro}
          columnas={COLUMNAS_MAESTROS}
          previewCols={['#', 'Nombre', 'Rol', 'Clase', 'Celular']}
          tips={[
            'La primera fila debe tener los encabezados exactos',
            '"Clase" se mapea automáticamente a Pequeños Navegantes, Firmes en el Puerto o Guardianes del Puerto',
            '"Cargo" se usa como rol del maestro (Maestro, Maestra, Coordinador…)',
            'Los campos Dirección, Bautizado y Foto se omiten en la importación',
          ]}
        />
      )}
    </div>
  )
}
