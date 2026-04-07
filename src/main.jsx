import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContext, useAuthProvider } from './hooks/useAuth'
import App from './App'
import LoginPage from './components/LoginPage'
import './index.css'

function Root() {
  const auth = useAuthProvider()

  if (auth.loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Verificando acesso…
      </div>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      {auth.user ? <App /> : <LoginPage />}
    </AuthContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
