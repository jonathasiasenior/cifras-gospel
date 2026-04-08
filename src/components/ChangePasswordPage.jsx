import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function ChangePasswordPage({ onDone }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (pw.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    if (pw !== pw2) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: pw })
    if (err) { setError(err.message); setLoading(false); return }
    // Mark as no longer needing password change
    await supabase.from('profiles')
      .update({ must_change_password: false })
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
    setLoading(false)
    onDone()
  }

  return (
    <div className="change-pw-wrap">
      <div className="change-pw-card">
        <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>🔐</div>
        <div className="change-pw-title">Crie sua senha</div>
        <div className="change-pw-sub">É seu primeiro acesso. Por segurança, defina uma senha pessoal antes de continuar.</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="password"
            placeholder="Nova senha (mín. 6 caracteres)"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            style={{ padding: '12px', border: '1px solid #E0DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={pw2}
            onChange={e => setPw2(e.target.value)}
            required
            style={{ padding: '12px', border: '1px solid #E0DDD6', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
          />
          {error && (
            <div style={{ fontSize: '13px', color: '#c0392b', background: '#FFF0F0', padding: '10px', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{
            padding: '13px', background: loading ? '#AAA' : '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px',
            fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px'
          }}>
            {loading ? 'Salvando…' : 'Definir senha e entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
