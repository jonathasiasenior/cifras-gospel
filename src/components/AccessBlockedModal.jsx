import React from 'react'

const WPP_NUMBER = '5511971345013'
const WPP_MSG = encodeURIComponent('Olá! Gostaria de solicitar acesso ao CIFREI.')

export default function AccessBlockedModal({ onClose }) {
  return (
    <div className="blocked-modal-overlay" onClick={onClose}>
      <div className="blocked-modal" onClick={e => e.stopPropagation()}>
        <div className="blocked-icon">🔒</div>
        <div className="blocked-title">Recurso bloqueado</div>
        <div className="blocked-desc">
          Para usar os recursos do CIFREI — PAD, playlists, edição de cifras e mais — você precisa solicitar acesso ao administrador.
          <br /><br />
          Entre em contato pelo WhatsApp para liberar seu acesso.
        </div>
        <a
          href={`https://wa.me/${WPP_NUMBER}?text=${WPP_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wpp"
        >
          <span style={{ fontSize: '22px' }}>💬</span>
          Solicitar acesso via WhatsApp
        </a>
        <button className="btn-close-blocked" onClick={onClose}>Fechar</button>
      </div>
    </div>
  )
}
