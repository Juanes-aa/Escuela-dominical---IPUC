import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// 🔧 REEMPLAZA ESTOS VALORES con los de tu proyecto Supabase
//    Ve a: supabase.com → tu proyecto → Settings → API
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://glojpitgjaehcgxaqndj.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mmLV7wK9Chl0oo5pA6Rk5Q_QrMHs5mF'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
