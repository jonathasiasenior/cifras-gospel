import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function AdminPage({ onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setUsers(data || [])
    setLoading(false)
  }

  async function createUser(e) {
    e.preventDefault()
    setCreating(true)
    setMsg('')

    const { data: { session } } = await supabase.auth.getSession()

    const resp = await supabase.functions.invoke('create-user', {
      body: { email: newEmail, password: newPassword, display_name: newName || newEmail.split('@')[0] }
    })

    if (resp.error || resp.data?.error) {
      setMsg('Erro: ' + (resp.data?.error || resp.error?.message))
    } else {
      setMsg(`✓ Usuário ${newEmail} criado com sucesso!`)
      setNewEmail(''); setNewPassword(''); setNewName('')
      setTimeout(loadUsers, 800)
    }
    setCreating(false)
  }

  async function removeUser(userId, email) {
    if (!confirm(`Remover acesso de ${email}?`)) return
    await supabase.from('profiles').delete().eq('id', userId)
    setUsers(u => u.filter(p => p.id !== userId))
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 700,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '480px',
        padding: '24px', maxHeight: '85vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1a1a2e' }}>⚙️ Gerenciar Usuários</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        <div style={{ background: '#F8F7F4', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            Cadastrar Novo Usuário
          </h3>
          <form onSubmit={createUser}>
            <input
              type="text" placeholder="Nome (opcional)" value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0DDD6', borderRadius: '10px', fontSize: '14px', marginBottom: '8px', outline: 'none', background: '#fff' }}
            />
            <input
              type="email" placeholder="Email *" value={newEmail} required
              onChange={e => setNewEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0DDD6', borderRadius: '10px', fontSize: '14px', marginBottom: '8px', outline: 'none', background: '#fff' }}
            />
            <input
              type="password" placeholder="Senha (mín. 6 caracteres) *" value={newPassword} required minLength={6}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E0DDD6', borderRadius: '10px', fontSize: '14px', marginBottom: '12px', outline: 'none', background: '#fff' }}
            />
            {msg && (
              <div style={{
                fontSize: '13px', color: msg.startsWith('Erro') ? '#c0392b' : '#27ae60',
                marginBottom: '10px', padding: '10px 12px',
                background: msg.startsWith('Erro') ? '#FFF0F0' : '#F0FFF4',
                borderRadius: '8px'
              }}>{msg}</div>
            )}
            <button type="submit" disabled={creating} style={{
              width: '100%', padding: '12px', background: creating ? '#AAA' : '#1a1a2e',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px',
              fontWeight: '700', cursor: creating ? 'not-allowed' : 'pointer'
            }}>
              {creating ? 'Cadastrando…' : '+ Cadastrar Usuário'}
            </button>
          </form>
        </div>

        <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Usuários ({users.length})
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#AAA', fontSize: '14px' }}>Carregando…</div>
        ) : users.map(u => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', background: '#F8F7F4', borderRadius: '10px', marginBottom: '6px'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {u.display_name || u.email}
                {u.role === 'admin' && (
                  <span style={{ fontSize: '9px', background: '#f0c040', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>ADMIN</span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>{u.email}</div>
            </div>
            {u.role !== 'admin' && (
              <button onClick={() => removeUser(u.id, u.email)} style={{
                background: '#FFE8E8', border: 'none', color: '#c0392b',
                borderRadius: '8px', padding: '6px 12px', fontSize: '12px',
                cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap'
              }}>
                Remover
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
