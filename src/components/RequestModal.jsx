import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'

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
      const { error: err } = await supabase.from('requests').insert({
        user_id: user?.id || null,
        user_email: user?.email || '',
        user_name: profile?.display_name || user?.email || '',
        type,
        message: message.trim()
      })
      if (err) throw err
      setSent(true)
    } catch {
      setError('Erro ao enviar. Tente novamente.')
    }
    setSending(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pl-modal" style={{ maxWidth:'480px', margin:'0 auto' }} onClick={e => e.stopPropagation()}>
        <div className="pl-modal-hdr">
          <div className="pl-modal-title">{cfg.icon} {cfg.label}</div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign:'center', padding:'32px 0' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ fontSize:16, fontWeight:700, color:'#1a1a2e', marginBottom:6 }}>Enviado com sucesso!</div>
            <div style={{ fontSize:13, color:'#888', marginBottom:24 }}>Sua mensagem foi recebida. Responderemos em breve.</div>
            <button onClick={onClose} style={{ background:'#1a1a2e', color:'#fff', border:'none', borderRadius:12, padding:'12px 28px', fontWeight:700, fontSize:14, cursor:'pointer' }}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={cfg.placeholder}
              required
              style={{ width:'100%', minHeight:120, padding:12, border:'1px solid #E0DDD6', borderRadius:12, fontSize:14, outline:'none', resize:'vertical', fontFamily:'inherit', lineHeight:1.5, marginBottom:12, background:'#F8F7F4' }}
            />
            {error && <div style={{ color:'#c0392b', fontSize:13, marginBottom:10 }}>{error}</div>}
            <button type="submit" disabled={sending || !message.trim()} style={{ width:'100%', padding:13, background:sending?'#AAA':'#1a1a2e', color:'#fff', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:sending?'not-allowed':'pointer' }}>
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
