import React, { useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'

const TYPES = {
  music: { label: 'Pedir Nova Música', icon: '🎵', placeholder: 'Qual música você quer? Informe nome e artista…' },
  feedback: { label: 'Feedback', icon: '💬', placeholder: 'Deixe seu feedback sobre o CIFREI…' },
  atendimento: { label: 'Atendimento', icon: '🎧', placeholder: 'Descreva como podemos te ajudar…' }
}

export default function RequestModal({ type, onClose }) {
  const { user, profile } = useAuth()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const cfg = TYPES[type]

  async function handleSend(e) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    await supabase.from('requests').insert({
      user_id: user?.id || null,
      user_email: user?.email || profile?.email || '',
      user_name: profile?.display_name || profile?.email || '',
      type,
      message: message.trim()
    })
    setSent(true)
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
