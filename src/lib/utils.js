import { GRUPO_CONFIG } from '../data/ninos'

export const getInitials = (name = '') => {
  if (!name || typeof name !== 'string') return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'
}

export const calcAge = (dob) => {
  if (!dob) return null
  try {
    const d = new Date(dob)
    // Verificar que la fecha es válida
    if (isNaN(d.getTime())) return null
    const now = new Date()
    let y = now.getFullYear() - d.getFullYear()
    if (
      now.getMonth() - d.getMonth() < 0 ||
      (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())
    ) y--
    return y >= 0 ? y : null
  } catch {
    return null
  }
}

export const grupoBadgeClass = (grupo) =>
  GRUPO_CONFIG[grupo]?.badge ?? 'bg-gray-100 text-gray-600'

export const grupoEmoji = (grupo) =>
  GRUPO_CONFIG[grupo]?.emoji ?? '📌'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}