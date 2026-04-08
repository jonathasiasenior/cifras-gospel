import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginModal({ onClose }) {
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
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email ou senha incorretos.' : err.message)
      setLoading(false)
    } else {
      // Login success — reload to get fresh state
      window.location.reload()
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)',
        zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '20px', padding: '32px 28px',
          width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,.4)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '6px' }}>🎸</div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e', marginBottom: '4px' }}>Entrar no CIFREI</h2>
          <p style={{ fontSize: '13px', color: '#999' }}>Acesso completo a +970 músicas</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '5px' }}>
            EMAIL
          </label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com" required autoFocus
            style={{
              width: '100%', padding: '11px 13px', border: '2px solid #E8E6E0',
              borderRadius: '11px', fontSize: '14px', outline: 'none',
              marginBottom: '14px', boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#1a1a2e'}
            onBlur={e => e.target.style.borderColor = '#E8E6E0'}
          />
          <label style={{ fontSize: '11px', fontWeight: '700', color: '#666', display: 'block', marginBottom: '5px' }}>
            SENHA
          </label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required
            style={{
              width: '100%', padding: '11px 13px', border: '2px solid #E8E6E0',
              borderRadius: '11px', fontSize: '14px', outline: 'none',
              marginBottom: '16px', boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#1a1a2e'}
            onBlur={e => e.target.style.borderColor = '#E8E6E0'}
          />

          {error && (
            <div style={{
              background: '#FFF0F0', border: '1px solid #FFD0D0', color: '#c0392b',
              borderRadius: '10px', padding: '9px 12px', fontSize: '13px', marginBottom: '14px'
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? '#999' : '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: '12px',
            fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <button onClick={onClose} style={{
          width: '100%', marginTop: '10px', padding: '10px',
          background: 'none', border: 'none', color: '#AAA',
          fontSize: '13px', cursor: 'pointer'
        }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}
