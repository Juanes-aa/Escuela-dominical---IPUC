import { supabase } from './supabase'

// Normaliza texto: minúsculas, sin tildes, sin espacios extras
const norm = txt =>
  (txt || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

// Construye el username a partir del nombre completo
// Ej: "Ana María García López" → "ana garcia"
export const buildUsername = nombre => {
  const partes = (nombre || '').trim().split(/\s+/)
  const primerNombre   = norm(partes[0] || '')
  const primerApellido = norm(partes[1] || '')  // en nombres colombianos suele ser el segundo token
  return `${primerNombre} ${primerApellido}`.trim()
}

export const login = async (username, password) => {
  // Trae todos los miembros y busca coincidencia
  const { data: miembros, error } = await supabase
    .from('miembros')
    .select('id, nombre, rol, documento')

  if (error) return { ok: false, message: 'Error al conectar con la base de datos' }

  const inputUser = norm(username)
  const inputPass = (password || '').trim()

  const miembro = miembros.find(m => {
    const partes         = (m.nombre || '').trim().split(/\s+/)
    const primerNombre   = norm(partes[0] || '')
    // Si tiene 4 partes: Nombre1 Nombre2 Apellido1 Apellido2 → tomamos partes[2]
    // Si tiene 3 partes: Nombre1 Nombre2 Apellido1 → tomamos partes[2]
    // Si tiene 2 partes: Nombre1 Apellido1 → tomamos partes[1]
    const primerApellido = norm(partes.length >= 3 ? partes[2] : partes[1] || '')
    const userMiembro    = `${primerNombre} ${primerApellido}`.trim()
    const docMiembro     = (m.documento || '').trim()

    return userMiembro === inputUser && docMiembro === inputPass
  })

  if (miembro) {
    const session = {
      id:     miembro.id,
      nombre: miembro.nombre,
      rol:    miembro.rol,
    }
    sessionStorage.setItem('ipuc_user', JSON.stringify(session))
    return { ok: true, user: session }
  }

  return { ok: false, message: 'Usuario o contraseña incorrectos' }
}

export const logout = () => sessionStorage.removeItem('ipuc_user')

export const getSession = () => {
  try { return JSON.parse(sessionStorage.getItem('ipuc_user')) } catch { return null }
}