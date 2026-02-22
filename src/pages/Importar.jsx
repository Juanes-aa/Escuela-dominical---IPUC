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

  // Si Excel ya lo interpreta como Date (con cellDates: true)
  if (raw instanceof Date && !isNaN(raw)) {
    return raw.toISOString().split('T')[0]
  }

  // Si viene como número serial de Excel (e.g. 44927)
  if (typeof raw === 'number') {
    const date = XLSX.SSF.parse_date_code(raw)
    if (date) {
      const y = date.y
      const m = String(date.m).padStart(2, '0')
      const d = String(date.d).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }

  // Si viene como string
  const parsed = new Date(raw)
  if (!isNaN(parsed)) {
    return parsed.toISOString().split('T')[0]
  }

  return null
}

// Deriva el mes en español a partir de una fecha ISO "YYYY-MM-DD"
function mesDesdeFecha(fechaISO) {
  if (!fechaISO) return null
  const mes = parseInt(fechaISO.split('-')[1], 10) - 1
  return MESES_ES[mes] ?? null
}

function mapRow(row) {
  const rawFecha = row['Fecha nacimiento'] ?? row['fecha_nacimiento'] ?? null
  const fechaISO = parseFecha(rawFecha)

  // Intentar leer el campo "Mes Cumple" del Excel
  const mesExcel = normalize(row['Mes Cumple'] ?? row['mes_cumple'] ?? '').toLowerCase()

  // Usar el mes del Excel si es válido, si no derivarlo de la fecha, si no dejar vacío
  const mes_cumple = (mesExcel && mesExcel !== '' && MESES_ES.includes(mesExcel))
    ? mesExcel
    : (mesDesdeFecha(fechaISO) ?? '')

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

const COLUMNAS = [
  'ITEM', 'Grupo de  Clase', 'Nombre completo', 'Mes Cumple', 'Fecha nacimiento',
  'Alergias/ enfermedades/ condiciones', 'EPS', 'Dirección', 'Acudiente',
  'Parentesco', 'Acudiente bautizado', 'Celular', 'Autorización Uso de Imagen',
]

export default function Importar({ addNino }) {
  const [preview,  setPreview]  = useState([])
  const [status,   setStatus]   = useState('')
  const [error,    setError]    = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const processFile = (file) => {
    if (!file) return
    setError(''); setStatus('Leyendo archivo...')
    const reader = new FileReader()
    reader.onload = (ev) => {
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

  const handleFile    = e => processFile(e.target.files[0])
  const handleDrop    = e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }
  const handleDrag    = e => { e.preventDefault(); setDragging(true) }
  const handleDragOut = () => setDragging(false)

  const handleImport = async () => {
    setStatus('Importando...')
    setError('')

    let exitosos = 0
    let errores = []

    for (const row of preview) {
      const { error } = await addNino(row)
      if (error) {
        errores.push(`${row.nombre}: ${error.message}`)
      } else {
        exitosos++
      }
    }

    if (errores.length > 0) {
      setError(errores.join('\n'))
    }

    setStatus(`🎉 ${exitosos} niños importados correctamente.`)

    if (exitosos > 0) {
      setPreview([])
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 26, fontWeight: 800, color: C.navy, margin: '0 0 2px' }}>
          📥 Importar desde Excel
        </h1>
        <p style={{ color: '#555', fontSize: 13, margin: 0 }}>Carga masiva de niños desde archivo .xlsx</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ── Zona de carga ── */}
          <div style={{ ...glass, borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: C.navy, margin: '0 0 16px' }}>
              📂 Seleccionar archivo Excel
            </h2>

            <div
              onClick={() => fileRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDrag}
              onDragLeave={handleDragOut}
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
              <div style={{ fontSize: 12, color: '#888' }}>
                Formatos: .xlsx · .xls — La primera fila debe tener los encabezados
              </div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} />
            </div>

            {/* Mensajes */}
            {status && !error && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, fontSize: 14, color: '#065F46', display: 'flex', gap: 8, alignItems: 'center' }}>
                ✅ {status}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontSize: 14, color: '#991B1B', display: 'flex', gap: 8, alignItems: 'center' }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* ── Vista previa ── */}
          {preview.length > 0 && (
            <div style={{ ...glass, borderRadius: 18, overflow: 'hidden' }}>
              {/* Header de preview */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F0AB00', background: 'rgba(0,61,165,0.05)' }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, color: C.navy }}>
                    👁️ Vista previa — {preview.length} registros
                  </div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Revisa los datos antes de confirmar</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setPreview([]); if (fileRef.current) fileRef.current.value = '' }} style={{
                    padding: '9px 16px', background: 'rgba(239,68,68,0.08)', color: '#991B1B',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>✕ Cancelar</button>
                  <button onClick={handleImport} style={{
                    padding: '9px 20px', background: 'linear-gradient(135deg,#003DA5,#009FDA)',
                    color: 'white', border: 'none', borderRadius: 10,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,61,165,0.35)',
                  }}>✅ Confirmar e importar</button>
                </div>
              </div>

              {/* Tabla de preview */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,61,165,0.06)' }}>
                      {['#', 'Nombre', 'Grupo', 'Cumpleaños', 'Acudiente', 'Celular'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, borderBottom: '1px solid rgba(0,61,165,0.1)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 30).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(0,61,165,0.06)', transition: 'background 0.12s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,61,165,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '9px 14px', fontSize: 12, color: '#bbb' }}>{r.item || i + 1}</td>
                        <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: '#1A1628' }}>{r.nombre}</td>
                        <td style={{ padding: '9px 14px', fontSize: 12, color: '#555' }}>{r.grupo}</td>
                        <td style={{ padding: '9px 14px', fontSize: 12, color: '#555', textTransform: 'capitalize' }}>{r.mes_cumple || '—'}</td>
                        <td style={{ padding: '9px 14px', fontSize: 12, color: '#555' }}>{r.acudiente}</td>
                        <td style={{ padding: '9px 14px', fontSize: 12, color: '#555' }}>{r.celular}</td>
                      </tr>
                    ))}
                    {preview.length > 30 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '12px 14px', textAlign: 'center', color: '#aaa', fontSize: 12, fontStyle: 'italic' }}>
                          ... y {preview.length - 30} registros más
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Panel lateral — Columnas esperadas ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...glass, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, marginBottom: 14 }}>
              📋 Columnas del Excel
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {COLUMNAS.map((col, i) => (
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

          {/* Tips */}
          <div style={{ ...glass, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.navy, marginBottom: 12 }}>
              💡 Tips
            </div>
            {[
              'La primera fila debe tener los encabezados exactos',
              'El mes de cumpleaños se deriva automáticamente de la fecha de nacimiento si el campo "Mes Cumple" está vacío',
              'La fecha de nacimiento puede estar en formato de fecha de Excel o YYYY-MM-DD',
              'Los grupos deben coincidir con: Pequeños Navegantes, Firmes en el Puerto o Guardianes del Puerto',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 9, fontSize: 12, color: '#555' }}>
                <span style={{ color: C.yellow, flexShrink: 0, fontWeight: 800 }}>→</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}