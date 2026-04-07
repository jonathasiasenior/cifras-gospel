import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const err = await signIn(email, password)
    if (err) setError(err.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : err.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '40px 32px',
        width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎸</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '4px' }}>
            Cifras Gospel
          </h1>
          <p style={{ fontSize: '13px', color: '#999' }}>Entre com sua conta para acessar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '6px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #E8E6E0',
                borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'border .2s'
              }}
              onFocus={e => e.target.style.borderColor = '#1a1a2e'}
              onBlur={e => e.target.style.borderColor = '#E8E6E0'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '6px' }}>
              SENHA
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '12px 14px', border: '2px solid #E8E6E0',
                borderRadius: '12px', fontSize: '14px', outline: 'none', transition: 'border .2s'
              }}
              onFocus={e => e.target.style.borderColor = '#1a1a2e'}
              onBlur={e => e.target.style.borderColor = '#E8E6E0'}
            />
          </div>

          {error && (
            <div style={{
              background: '#FFF0F0', border: '1px solid #FFD0D0', color: '#c0392b',
              borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', background: loading ? '#999' : '#1a1a2e',
              color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s'
            }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#BBB' }}>
          Acesso restrito. Fale com o administrador para criar uma conta.
        </p>
      </div>
    </div>
  )
}
