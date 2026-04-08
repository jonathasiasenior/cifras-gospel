import React from 'react'

const WPP = 'https://wa.me/5511971345013?text=' + encodeURIComponent('Olá! Quero ter acesso completo ao CIFREI com +900 músicas.')

export default function DemoBanner() {
  return (
    <div className="demo-banner">
      <div className="demo-banner-top">
        <span className="demo-badge">🔒 MODO DEMONSTRAÇÃO</span>
        <span className="demo-count">3 de 970 músicas</span>
      </div>
      <p className="demo-headline">
        Você está ouvindo <strong>3 músicas gratuitas</strong>.<br />
        Desbloqueie tudo com acesso vitalício.
      </p>
      <div className="demo-features">
        <span>✅ +970 músicas</span>
        <span>✅ Cifra Compactada</span>
        <span>✅ PADs contínuos</span>
        <span>✅ Filtro por tonalidade</span>
        <span>✅ Playlists ilimitadas</span>
        <span>✅ Editar cifras</span>
      </div>
      <div className="demo-price">
        Por apenas <strong>R$49,90</strong> — pagamento único, sem mensalidade
      </div>
      <a className="demo-cta" href={WPP} target="_blank" rel="noreferrer">
        💬 Quero acesso completo
      </a>
    </div>
  )
}
