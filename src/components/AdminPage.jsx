import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcGtodXl2ZXl1cnJuY3JxZ3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU4OTM2OCwiZXhwIjoyMDkxMTY1MzY4fQ._5jGk86vxBeUmpyC7VLdUI8aeSmaK9vkUfg8hWuFj-A'
const PROJECT_URL = 'https://hqpkhuyveyurrncrqgtk.supabase.co'

const TAB_LABELS = [
  { key: 'users', label: '👥 Usuários' },
  { key: 'music', label: '🎵 Músicas' },
  { key: 'feedback', label: '💬 Feedbacks' },
  { key: 'atendimento', label: '🎧 Atendimento' },
]

const REQUEST_TYPE_LABEL = { music: 'Pedir Música', feedback: 'Feedback', atendimento: 'Atendimento' }

export default function AdminPage({ onClose }) {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [loadingU, setLoadingU] = useState(true)
  const [loadingR, setLoadingR] = useState(true)

  // Create user form
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState('')

  // Reset password
  const [resetId, setResetId] = useState(null)
  const [resetPw, setResetPw] = useState('')
  const [resetting, setResetting] = useState(false)

  useEffect(() => { loadUsers() }, [])
  useEffect(() => {
    if (tab === 'music' || tab === 'feedback' || tab === 'atendimento') loadRequests(tab)
  }, [tab])

  async function loadUsers() {
    setLoadingU(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setUsers(data || [])
    setLoadingU(false)
  }

  async function loadRequests(type) {
    setLoadingR(true)
    const { data } = await supabase.from('requests').select('*').eq('type', type).order('created_at', { ascending: false })
    setRequests(data || [])
    setLoadingR(false)
  }

  async function createUser(e) {
    e.preventDefault()
    setCreating(true)
    setMsg('')
    try {
      const res = await fetch(`${PROJECT_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE}`,
          'apikey': SERVICE_ROLE,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          email_confirm: true,
          user_metadata: { display_name: form.name }
        })
      })
      const data = await res.json()
      if (data.id) {
        // Use service role to update profile (bypasses RLS)
        await fetch(`${PROJECT_URL}/rest/v1/profiles?id=eq.${data.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE}`,
            'apikey': SERVICE_ROLE,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            display_name: form.name || form.email.split('@')[0],
            phone: form.phone,
            must_change_password: true
          })
        })
        setMsg(`✓ Usuário ${form.email} criado!`)
        setForm({ name: '', email: '', phone: '', password: '' })
        setTimeout(loadUsers, 800)
      } else {
        setMsg('Erro: ' + (data.message || data.error_description || JSON.stringify(data)))
      }
    } catch (err) {
      setMsg('Erro: ' + err.message)
    }
    setCreating(false)
  }

  async function toggleApprove(userId, current) {
    await fetch(`${PROJECT_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${SERVICE_ROLE}`, 'apikey': SERVICE_ROLE, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ approved: !current })
    })
    setUsers(u => u.map(p => p.id === userId ? { ...p, approved: !current } : p))
  }

  async function resetPassword(userId) {
    if (!resetPw || resetPw.length < 6) return
    setResetting(true)
    try {
      await fetch(`${PROJECT_URL}/auth/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE}`,
          'apikey': SERVICE_ROLE,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: resetPw })
      })
      await fetch(`${PROJECT_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${SERVICE_ROLE}`, 'apikey': SERVICE_ROLE, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ must_change_password: true })
      })
      setResetId(null)
      setResetPw('')
      setMsg('✓ Senha resetada. Usuário deverá trocar no próximo acesso.')
    } catch (err) {
      setMsg('Erro: ' + err.message)
    }
    setResetting(false)
  }

  async function removeUser(userId, email) {
    if (!confirm(`Remover acesso de ${email}?`)) return
    await fetch(`${PROJECT_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${SERVICE_ROLE}`, 'apikey': SERVICE_ROLE }
    })
    setUsers(u => u.filter(p => p.id !== userId))
  }

  async function markRequestDone(id) {
    await supabase.from('requests').update({ status: 'done' }).eq('id', id)
    setRequests(r => r.map(x => x.id === id ? { ...x, status: 'done' } : x))
  }

  const ipt = {
    width: '100%', padding: '10px 12px', border: '1px solid #E0DDD6',
    borderRadius: '10px', fontSize: '14px', marginBottom: '8px',
    outline: 'none', background: '#fff'
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 700, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0', flexShrink: 0 }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1a1a2e' }}>⚙️ Painel Admin</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '12px 20px', overflowX: 'auto', flexShrink: 0 }}>
          {TAB_LABELS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '7px 12px', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
              cursor: 'pointer', whiteSpace: 'nowrap',
              background: tab === t.key ? '#1a1a2e' : '#F0EEE8',
              color: tab === t.key ? '#fff' : '#666'
            }}>{t.label}</button>
          ))}
        </div>

        {msg && (
          <div style={{ margin: '0 20px', fontSize: '12px', color: msg.startsWith('Erro') ? '#c0392b' : '#27ae60', background: msg.startsWith('Erro') ? '#FFF0F0' : '#F0FFF4', padding: '8px 12px', borderRadius: '8px', marginBottom: '4px' }}>
            {msg}
          </div>
        )}

        <div style={{ overflowY: 'auto', padding: '0 20px 24px', flex: 1 }}>

          {/* USERS TAB */}
          {tab === 'users' && (
            <>
              <div style={{ background: '#F8F7F4', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  Cadastrar Novo Usuário
                </h3>
                <form onSubmit={createUser}>
                  <input type="text" placeholder="Nome completo *" value={form.name} required onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={ipt} />
                  <input type="email" placeholder="Email *" value={form.email} required onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={ipt} />
                  <input type="tel" placeholder="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={ipt} />
                  <input type="password" placeholder="Senha temporária (mín. 6) *" value={form.password} required minLength={6} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ ...ipt, marginBottom: '12px' }} />
                  <button type="submit" disabled={creating} style={{ width: '100%', padding: '11px', background: creating ? '#AAA' : '#1a1a2e', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: creating ? 'not-allowed' : 'pointer' }}>
                    {creating ? 'Cadastrando…' : '+ Cadastrar Usuário'}
                  </button>
                </form>
              </div>

              <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Usuários ({users.length})
              </h3>
              {loadingU ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#AAA', fontSize: '13px' }}>Carregando…</div>
              ) : users.map(u => (
                <div key={u.id}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 14px', background: '#F8F7F4', borderRadius: '10px', marginBottom: '4px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {u.display_name || u.email}
                        {u.role === 'admin' && <span style={{ fontSize: '9px', background: '#f0c040', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>ADMIN</span>}
                        {u.approved && <span style={{ fontSize: '9px', background: '#27ae60', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>ATIVO</span>}
                        {!u.approved && u.role !== 'admin' && <span style={{ fontSize: '9px', background: '#e74c3c', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>PENDENTE</span>}
                        {u.must_change_password && <span style={{ fontSize: '9px', background: '#e67e22', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: '800' }}>TROCA SENHA</span>}
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>{u.email}</div>
                      {u.phone && <div style={{ fontSize: '10px', color: '#999' }}>{u.phone}</div>}
                    </div>
                    {u.role !== 'admin' && (
                      <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginLeft: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button onClick={() => toggleApprove(u.id, u.approved)} style={{
                          background: u.approved ? '#FFF0E8' : '#E8FFF0', border: 'none', color: u.approved ? '#c0392b' : '#27ae60',
                          borderRadius: '8px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap'
                        }}>
                          {u.approved ? 'Revogar' : 'Aprovar'}
                        </button>
                        <button onClick={() => { setResetId(u.id); setResetPw('') }} style={{
                          background: '#F0EEE8', border: 'none', color: '#666',
                          borderRadius: '8px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: '700', whiteSpace: 'nowrap'
                        }}>
                          🔑 Senha
                        </button>
                        <button onClick={() => removeUser(u.id, u.email)} style={{
                          background: '#FFE8E8', border: 'none', color: '#c0392b',
                          borderRadius: '8px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: '700'
                        }}>
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Reset password inline form */}
                  {resetId === u.id && (
                    <div style={{ background: '#FFF8E8', border: '1px solid #f0c040', borderRadius: '10px', padding: '12px', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Nova senha temporária"
                        value={resetPw}
                        onChange={e => setResetPw(e.target.value)}
                        style={{ flex: 1, padding: '8px 10px', border: '1px solid #E0DDD6', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                      />
                      <button onClick={() => resetPassword(u.id)} disabled={resetting || resetPw.length < 6} style={{
                        padding: '8px 14px', background: '#1a1a2e', color: '#fff', border: 'none',
                        borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}>
                        {resetting ? '…' : 'Resetar'}
                      </button>
                      <button onClick={() => setResetId(null)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* REQUESTS TABS */}
          {(tab === 'music' || tab === 'feedback' || tab === 'atendimento') && (
            <>
              <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#999', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                {requests.length} {tab === 'music' ? 'solicitações' : tab === 'feedback' ? 'feedbacks' : 'atendimentos'}
              </h3>
              {loadingR ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#AAA' }}>Carregando…</div>
              ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#AAA', fontSize: '14px' }}>Nenhuma mensagem ainda</div>
              ) : requests.map(r => (
                <div key={r.id} style={{
                  background: r.status === 'done' ? '#F5F4F0' : '#fff',
                  border: `1px solid ${r.status === 'done' ? '#E0DDD6' : '#f0c040'}`,
                  borderRadius: '12px', padding: '12px 14px', marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a2e' }}>{r.user_name || r.user_email}</div>
                      <div style={{ fontSize: '10px', color: '#999' }}>{new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    {r.status !== 'done' && (
                      <button onClick={() => markRequestDone(r.id)} style={{
                        background: '#E8FFF0', color: '#27ae60', border: 'none',
                        borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                      }}>
                        ✓ Concluído
                      </button>
                    )}
                    {r.status === 'done' && (
                      <span style={{ fontSize: '10px', color: '#27ae60', fontWeight: '700' }}>✓ Concluído</span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: r.status === 'done' ? '#AAA' : '#333', lineHeight: '1.4' }}>{r.message}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
