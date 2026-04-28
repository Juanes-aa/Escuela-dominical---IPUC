import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────
// 🔧 REEMPLAZA ESTOS VALORES con los de tu proyecto Supabase
//    Ve a: supabase.com → tu proyecto → Settings → API
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://glojpitgjaehcgxaqndj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsb2pwaXRnamFlaGNneGFxbmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NjcxNTAsImV4cCI6MjA4NzA0MzE1MH0.mIa_pofzilCUk51OHiqM7JssM8QmUh77fSB5Y8P_W5c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
