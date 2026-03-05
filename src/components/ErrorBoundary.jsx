import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          color: '#e8e8f0',
          fontFamily: 'system-ui, sans-serif',
          padding: 40,
        }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: '#7070a0', marginBottom: 20 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
              style={{
                background: '#00e5a0',
                color: '#0a0a0f',
                border: 'none',
                borderRadius: 8,
                padding: '12px 28px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
