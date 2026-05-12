import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useStore() {
  const [ninos,      setNinos]      = useState([])
  const [maestros,   setMaestros]   = useState([])
  const [miembros,   setMiembros]   = useState([])
  const [asistencia, setAsistencia] = useState({})
  const [loading,    setLoading]    = useState(true)

  // Ref para tener siempre el conteo actualizado sin depender del estado
  const ninosRef = useRef([])

  // ── Carga inicial ──────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [{ data: n }, { data: m }, { data: a }, { data: mb }] = await Promise.all([
        supabase.from('ninos').select('*').order('item', { ascending: true }),
        supabase.from('maestros').select('*').order('id', { ascending: true }),
        supabase.from('asistencia').select('*'),
        supabase.from('miembros').select('*').order('id', { ascending: true }),
      ])

      const ninosData = n ?? []
      ninosRef.current = ninosData
      setNinos(ninosData)
      setMaestros(m ?? [])
      setMiembros(mb ?? [])

      // Convertir filas de asistencia a { fecha: [nino_id, ...] }
      const asistMap = {}
      for (const row of (a ?? [])) {
        if (!asistMap[row.fecha]) asistMap[row.fecha] = []
        if (row.presente) asistMap[row.fecha].push(row.nino_id)
      }
      setAsistencia(asistMap)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // ── Subir foto al Storage (evita guardar base64 enorme en BD) ──
  const uploadFoto = async (dataUrl, filename) => {
    try {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const ext = blob.type.split('/')[1] || 'jpg'
      const safeName = filename
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
      const path = `ninos/${safeName}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('fotos').upload(path, blob, {
        contentType: blob.type, upsert: true,
      })
      if (error) return null
      const { data: { publicUrl } } = supabase.storage.from('fotos').getPublicUrl(path)
      return publicUrl
    } catch {
      return null
    }
  }

  // ── CRUD Niños ─────────────────────────────────────────────
  const addNino = async n => {
    const { _grupoCanon, ...nuevo } = { ...n, item: ninosRef.current.length + 1 }
    delete nuevo.id
    if (nuevo.foto_url?.startsWith('data:')) {
      const url = await uploadFoto(nuevo.foto_url, nuevo.nombre || 'nino')
      nuevo.foto_url = url || ''
    }
    const { data, error } = await supabase.from('ninos').insert(nuevo).select().single()
    if (error) {
      console.error('Error insertando niño:', error)
      return { data: null, error }
    }
    if (data) {
      ninosRef.current = [...ninosRef.current, data]
      setNinos([...ninosRef.current])
    }
    return { data, error: null }
  }

  const updateNino = async n => {
    const { _grupoCanon, ...payload } = n
    if (payload.foto_url?.startsWith('data:')) {
      const url = await uploadFoto(payload.foto_url, payload.nombre || `nino-${n.id}`)
      payload.foto_url = url || ''
    }
    const { data, error } = await supabase.from('ninos').update(payload).eq('id', payload.id).select().single()
    if (error) {
      console.error('Error actualizando niño:', error)
      return { error }
    }
    if (data) {
      ninosRef.current = ninosRef.current.map(x => x.id === n.id ? data : x)
      setNinos([...ninosRef.current])
    }
    return { error: null }
  }

  const deleteNino = async id => {
    const { error } = await supabase.from('ninos').delete().eq('id', id)
    if (!error) {
      ninosRef.current = ninosRef.current.filter(x => x.id !== id)
      setNinos([...ninosRef.current])
    }
  }

  // ── CRUD Maestros ──────────────────────────────────────────
  const addMaestro = async m => {
    const nuevo = { ...m }
    delete nuevo.id
    const { data, error } = await supabase.from('maestros').insert(nuevo).select().single()
    if (!error && data) setMaestros(prev => [...prev, data])
  }

  const updateMaestro = async m => {
    const { data, error } = await supabase.from('maestros').update(m).eq('id', m.id).select().single()
    if (!error && data) setMaestros(prev => prev.map(x => x.id === m.id ? data : x))
  }

  const deleteMaestro = async id => {
    const { error } = await supabase.from('maestros').delete().eq('id', id)
    if (!error) setMaestros(prev => prev.filter(x => x.id !== id))
  }

  // ── CRUD Miembros ──────────────────────────────────────────
  const addMiembro = async m => {
    const nuevo = { ...m }
    delete nuevo.id
    const { data, error } = await supabase.from('miembros').insert(nuevo).select().single()
    if (error) { console.error('Error insertando miembro:', error); return { data: null, error } }
    if (data) setMiembros(prev => [...prev, data])
    return { data, error: null }
  }

  const updateMiembro = async m => {
    const { data, error } = await supabase.from('miembros').update(m).eq('id', m.id).select().single()
    if (!error && data) setMiembros(prev => prev.map(x => x.id === m.id ? data : x))
  }

  const deleteMiembro = async id => {
    const { error } = await supabase.from('miembros').delete().eq('id', id)
    if (!error) setMiembros(prev => prev.filter(x => x.id !== id))
  }

  // ── Asistencia ─────────────────────────────────────────────
  const toggleAsistencia = async (fecha, ninoId) => {
    const presentes = asistencia[fecha] ?? []
    const yaPresente = presentes.includes(ninoId)

    const { data: existing } = await supabase
      .from('asistencia').select('id').eq('fecha', fecha).eq('nino_id', ninoId).single()

    if (existing) {
      await supabase.from('asistencia').update({ presente: !yaPresente }).eq('id', existing.id)
    } else {
      await supabase.from('asistencia').insert({ fecha, nino_id: ninoId, presente: true })
    }

    setAsistencia(prev => {
      const curr = prev[fecha] ?? []
      return {
        ...prev,
        [fecha]: yaPresente ? curr.filter(id => id !== ninoId) : [...curr, ninoId],
      }
    })
  }

  const setPresentesEnFecha = async (fecha, ids) => {
    await supabase.from('asistencia').delete().eq('fecha', fecha)
    if (ids.length > 0) {
      const rows = ids.map(nino_id => ({ fecha, nino_id, presente: true }))
      await supabase.from('asistencia').insert(rows)
    }
    setAsistencia(prev => ({ ...prev, [fecha]: ids }))
  }

  return {
    ninos, maestros, miembros, asistencia, loading,
    addNino, updateNino, deleteNino,
    addMaestro, updateMaestro, deleteMaestro,
    addMiembro, updateMiembro, deleteMiembro,
    toggleAsistencia, setPresentesEnFecha,
  }
}