import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContext, useAuthProvider } from './hooks/useAuth'
import App from './App'
import ChangePasswordPage from './components/ChangePasswordPage'
import LandingPage from './components/LandingPage'
import './index.css'

// Wake Lock — keeps screen awake on mobile when app is open
let wakeLock = null
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    document.addEventListener('visibilitychange', async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen').catch(() => null)
      }
    })
  } catch { /* silently ignore */ }
}
requestWakeLock()

function Root() {
  const auth = useAuthProvider()

  if (auth.loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Carregando…
      </div>
    )
  }

  if (!auth.user) return (
    <AuthContext.Provider value={auth}>
      <LandingPage />
    </AuthContext.Provider>
  )

  return (
    <AuthContext.Provider value={auth}>
      {auth.mustChangePassword
        ? <ChangePasswordPage onDone={() => window.location.reload()} />
        : <App />
      }
    </AuthContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
