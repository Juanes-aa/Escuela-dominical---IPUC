export default function Setup() {
  const sql = `-- ============================================================
-- SCRIPT SQL - Escuela Dominical IPUC Calasanz
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Tabla de niños
CREATE TABLE ninos (
  id                   SERIAL PRIMARY KEY,
  item                 INTEGER,
  grupo                TEXT NOT NULL,
  nombre               TEXT NOT NULL,
  mes_cumple           TEXT,
  fecha_nacimiento     DATE,
  alergias             TEXT DEFAULT 'Ninguna',
  eps                  TEXT,
  direccion            TEXT,
  acudiente            TEXT,
  parentesco           TEXT,
  acudiente_bautizado  TEXT DEFAULT 'No',
  celular              TEXT,
  autorizacion_imagen  TEXT DEFAULT 'No',
  foto_url             TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de maestros
CREATE TABLE maestros (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  rol         TEXT,
  clase       TEXT,
  celular     TEXT,
  email       TEXT,
  foto_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de asistencia
CREATE TABLE asistencia (
  id        SERIAL PRIMARY KEY,
  nino_id   INTEGER REFERENCES ninos(id) ON DELETE CASCADE,
  fecha     DATE NOT NULL,
  presente  BOOLEAN DEFAULT FALSE,
  UNIQUE(nino_id, fecha)
);

-- Habilitar Row Level Security
ALTER TABLE ninos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE maestros   ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencia ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (solo usuarios autenticados)
CREATE POLICY "auth_ninos"      ON ninos      FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_maestros"   ON maestros   FOR ALL TO authenticated USING (true);
CREATE POLICY "auth_asistencia" ON asistencia FOR ALL TO authenticated USING (true);

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos', 'fotos', true);

CREATE POLICY "public_fotos" ON storage.objects
FOR SELECT USING (bucket_id = 'fotos');

CREATE POLICY "auth_upload_fotos" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'fotos');`

  const steps = [
    { n:'1', icon:'🌐', title:'Crear cuenta en Supabase', desc:'Ve a supabase.com → "Start for free" → Crea un nuevo proyecto. Nombre sugerido: ipuc-calasanz' },
    { n:'2', icon:'🔑', title:'Copiar credenciales', desc:'En tu proyecto: Settings → API → copia el "Project URL" y el "anon public key"' },
    { n:'3', icon:'✏️', title:'Configurar el archivo', desc:'Abre src/lib/supabase.js y reemplaza SUPABASE_URL y SUPABASE_KEY con tus valores reales' },
    { n:'4', icon:'🗄️', title:'Crear las tablas', desc:'En Supabase → SQL Editor → New query → Pega el script SQL de abajo → Run' },
    { n:'5', icon:'📸', title:'Subir las fotos', desc:'En Supabase → Storage → ya tienes el bucket "fotos" creado. Sube las imágenes de Google Drive' },
    { n:'6', icon:'🚀', title:'Publicar en internet', desc:'Corre: npm run build. Sube la carpeta "dist" a Vercel.com o Netlify.com (gratis). ¡Listo!' },
  ]

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:30,color:'#003DA5',margin:'0 0 4px'}}>⚙️ Configuración</h1>
        <p style={{color:'#aaa',fontSize:14,margin:0}}>Guía para activar la base de datos real en la nube</p>
      </div>

      <div style={{background:'white',borderRadius:16,padding:28,boxShadow:'0 2px 16px rgba(26,20,16,0.07)',marginBottom:20}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:'#003DA5',marginBottom:20}}>🚀 Pasos para producción</h2>
        {steps.map((s,i) => (
          <div key={s.n} className="animate-fadeUp" style={{display:'flex',gap:16,marginBottom:18,padding:16,background:'#F8FBFF',borderRadius:12,animationDelay:`${i*0.07}s`}}>
            <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#003DA5,#009FDA)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800,fontSize:16,flexShrink:0}}>
              {s.n}
            </div>
            <div>
              <div style={{fontWeight:700,color:'#1A1410',marginBottom:4,fontSize:15}}>{s.icon} {s.title}</div>
              <div style={{fontSize:13,color:'#666',lineHeight:1.5}}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{background:'white',borderRadius:16,padding:24,boxShadow:'0 2px 16px rgba(26,20,16,0.07)',marginBottom:20}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#003DA5',margin:0}}>🗄️ Script SQL completo</h2>
          <button onClick={()=>{navigator.clipboard.writeText(sql);alert('¡Copiado!')}} style={{padding:'8px 16px',background:'#F0F7FF',color:'#003DA5',border:'2px solid #D6EEFA',borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:'pointer'}}>
            📋 Copiar
          </button>
        </div>
        <pre style={{background:'#001025',color:'#F0AB00',borderRadius:10,padding:20,fontSize:12,overflow:'auto',lineHeight:1.7,margin:0,fontFamily:"'Fira Code',monospace"}}>
          {sql}
        </pre>
      </div>

      <div style={{background:'linear-gradient(135deg,rgba(200,151,58,0.1),rgba(90,122,92,0.1))',borderRadius:16,padding:24,border:'2px solid rgba(200,151,58,0.2)'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:'#003DA5',marginBottom:10}}>🔐 Credenciales actuales (demo)</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[['admin','calasanz2025'],['coordinadora','ipuc1234']].map(([u,p])=>(
            <div key={u} style={{background:'white',borderRadius:10,padding:'12px 16px'}}>
              <div style={{fontSize:12,color:'#aaa',marginBottom:4}}>Usuario / Contraseña</div>
              <code style={{fontSize:14,color:'#003DA5',fontWeight:700}}>{u}</code>
              <span style={{color:'#ccc',margin:'0 8px'}}>/</span>
              <code style={{fontSize:14,color:'#009FDA',fontWeight:700}}>{p}</code>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:'#888',marginTop:12,margin:'12px 0 0'}}>
          ⚠️ Para producción real, utiliza Supabase Auth con correos electrónicos y contraseñas seguras. Edita <code style={{background:'#EEE',padding:'1px 5px',borderRadius:4}}>src/lib/auth.js</code> para conectar con Supabase.
        </p>
      </div>
    </div>
  )
}
