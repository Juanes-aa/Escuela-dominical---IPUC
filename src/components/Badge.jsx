export default function Badge({ children, variant = 'default' }) {
  const styles = {
    default:   { background: '#F0F7FF',  color: '#003DA5' },
    // Aliases cortos (uso interno)
    Pequeños:  { background: '#FFF7ED',  color: '#C2410C' },
    Firmes:     { background: '#E8F5FF',  color: '#0070C0' },
    Guardianes:     { background: '#FEF9C3',  color: '#92400E' },
    // Nombres reales de los grupos
    'Pequeños Navegantes':   { background: '#FFF7ED', color: '#C2410C' },
    'Firmes en el Puerto':   { background: '#E8F5FF', color: '#0070C0' },
    'Guardianes del Puerto': { background: '#FEF9C3', color: '#92400E' },
    success:   { background: '#D1FAE5',  color: '#065F46' },
    danger:    { background: '#FEE2E2',  color: '#991B1B' },
    warning:   { background: '#FEF9C3',  color: '#92400E' },
    gold:      { background: 'rgba(240,171,0,0.15)', color: '#92400E' },
    blue:      { background: 'rgba(0,159,218,0.12)', color: '#003DA5' },
  }
  const s = styles[variant] ?? styles.default
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, ...s,
    }}>{children}</span>
  )
}