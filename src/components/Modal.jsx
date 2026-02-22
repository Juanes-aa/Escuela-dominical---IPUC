import { useEffect } from 'react'

export default function Modal({ title, onClose, children, maxWidth = 520 }) {
  useEffect(() => {
    const esc = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div
      className="animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 9999,
        overflowY: 'auto',
        paddingTop: 80,
        paddingBottom: 24,
        paddingLeft: 12,
        paddingRight: 12,
      }}
    >
      <style>{`
        @media (max-width: 480px) {
          .modal-inner {
            padding: 18px 16px !important;
            border-radius: 16px !important;
          }
          .modal-title {
            font-size: 15px !important;
          }
        }
      `}</style>

      <div
        className="animate-scaleIn modal-inner"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '24px 28px',
          width: '100%',
          maxWidth,
          margin: '0 auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, paddingBottom: 14,
          borderBottom: '2px solid #F0AB00',
          gap: 12,
        }}>
          <h2 className="modal-title" style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 800,
            color: '#003DA5', margin: 0,
            lineHeight: 1.3,
            minWidth: 0,          /* permite que el texto haga wrap */
            wordBreak: 'break-word',
          }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'rgba(0,61,165,0.07)', border: '1px solid rgba(0,61,165,0.12)',
            fontSize: 15, cursor: 'pointer', color: '#888',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', lineHeight: 1,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,61,165,0.12)'; e.currentTarget.style.color = '#003DA5' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,61,165,0.07)'; e.currentTarget.style.color = '#888' }}
          >✕</button>
        </div>

        {children}
      </div>
    </div>
  )
}