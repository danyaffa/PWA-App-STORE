import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null, retryCount: 0 }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidMount() {
    // Signal to main.jsx that React mounted successfully
    this.props.onMount?.()
  }

  handleRetry = () => {
    this.setState(prev => ({ error: null, retryCount: prev.retryCount + 1 }))
  }

  handleClearAndReload = async () => {
    try {
      // Clear all caches
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map(k => caches.delete(k)))
      }
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map(r => r.unregister()))
      }
    } catch { /* ignore cleanup errors */ }
    window.location.href = '/'
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
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {this.state.retryCount < 2 && (
                <button
                  onClick={this.handleRetry}
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
                  Try Again
                </button>
              )}
              <button
                onClick={this.handleClearAndReload}
                style={{
                  background: this.state.retryCount >= 2 ? '#00e5a0' : 'transparent',
                  color: this.state.retryCount >= 2 ? '#0a0a0f' : '#7070a0',
                  border: this.state.retryCount >= 2 ? 'none' : '1px solid #2a2a3a',
                  borderRadius: 8,
                  padding: '12px 28px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear Cache &amp; Reload
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
