import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxcGtodXl2ZXl1cnJuY3JxZ3RrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTU4OTM2OCwiZXhwIjoyMDkxMTY1MzY4fQ._5jGk86vxBeUmpyC7VLdUI8aeSmaK9vkUfg8hWuFj-A'
const PROJECT_URL = 'https://hqpkhuyveyurrncrqgtk.supabase.co'

const TYPES = {
  music:      { label: 'Pedir Nova Música', icon: '🎵', placeholder: 'Qual música você quer? Informe nome e artista…' },
  feedback:   { label: 'Feedback',          icon: '💬', placeholder: 'Deixe seu feedback sobre o CIFREI…' },
  atendimento:{ label: 'Atendimento',       icon: '🎧', placeholder: 'Descreva como podemos te ajudar…' }
}

export default function RequestModal({ type, onClose }) {
  const { user, profile } = useAuth()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const cfg = TYPES[type]

  async function handleSend(e) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(`${PROJECT_URL}/rest/v1/requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE}`,
          'apikey': SERVICE_ROLE,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user?.id || null,
          user_email: user?.email || '',
          user_name: profile?.display_name || user?.email || '',
          type,
          message: message.trim()
        })
      })
      if (res.ok || res.status === 201) {
        setSent(true)
      } else {
        const text = await res.text()
        setError('Erro ao enviar. Tente novamente.')
        console.error('Request insert error:', text)
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    }
    setSending(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pl-modal" style={{ maxWidth: '480px', margin: '0 auto' }} onClick={e => e.stopPropagation()}>
        <div className="pl-modal-hdr">
          <div className="pl-modal-title">{cfg.icon} {cfg.label}</div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '6px' }}>Enviado com sucesso!</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Sua mensagem foi recebida. Responderemos em breve.</div>
            <button onClick={onClose} style={{
              background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '12px',
              padding: '12px 28px', fontWeight: '700', fontSize: '14px', cursor: 'pointer'
            }}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={cfg.placeholder}
              required
              style={{
                width: '100%', minHeight: '120px', padding: '12px', border: '1px solid #E0DDD6',
                borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'vertical',
                fontFamily: 'inherit', lineHeight: '1.5', marginBottom: '12px', background: '#F8F7F4'
              }}
            />
            {error && (
              <div style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>{error}</div>
            )}
            <button type="submit" disabled={sending || !message.trim()} style={{
              width: '100%', padding: '13px', background: sending ? '#AAA' : '#1a1a2e',
              color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px',
              fontWeight: '700', cursor: sending ? 'not-allowed' : 'pointer'
            }}>
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
