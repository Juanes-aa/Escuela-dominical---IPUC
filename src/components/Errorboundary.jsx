import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 32, textAlign: 'center',
          color: '#991B1B', fontFamily: "'DM Sans', sans-serif",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
            Error al cargar el perfil
          </div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
            {this.state.error?.message || 'Error inesperado'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
              background: '#003DA5', color: 'white', border: 'none',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
            }}
          >
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}