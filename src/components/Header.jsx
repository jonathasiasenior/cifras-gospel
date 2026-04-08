import React, { useState } from 'react'

const KEYS = ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B',
              'Cm','C#m','Dbm','Dm','D#m','Ebm','Em','Fm','F#m','Gbm','Gm','G#m','Abm','Am','A#m','Bbm','Bm']

export default function Header({
  total, search, onSearch, filterKey, onFilterKey, onFontChange,
  onPlaylistOpen, user, isAdmin, isApproved, onAdmin, onSignOut, onLogin,
  onRequestMusic, onFeedback, onAtendimento
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  function menuAction(fn) {
    setMenuOpen(false)
    fn()
  }

  return (
    <>
      <div className="hdr">
        <div className="hdr-top">
          <div className="logo">
            <span className="logo-icon">🎸</span>
            CIFREI
          </div>
          <div className="hdr-right">
            <span className="badge-count">{total} músicas</span>
            {isApproved && (
              <>
                <div className="font-ctrl-hdr">
                  <button className="font-btn-hdr" onClick={() => onFontChange(-0.1)}>A−</button>
                  <button className="font-btn-hdr" onClick={() => onFontChange(0.1)}>A+</button>
                </div>
                <button className="btn-pl-hdr" onClick={onPlaylistOpen}>♫ Playlists</button>
              </>
            )}
            {isAdmin && (
              <button className="btn-pl-hdr" onClick={onAdmin} style={{ color: '#f0c040' }}>⚙️</button>
            )}
            {!isApproved && (
              <button
                onClick={onLogin}
                style={{
                  background: '#f0c040', border: 'none', color: '#1a1a2e',
                  fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                  borderRadius: '20px', padding: '7px 14px', whiteSpace: 'nowrap'
                }}
              >
                🔑 Entrar
              </button>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              style={{ background: 'rgba(255,255,255,.1)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', borderRadius: '8px', padding: '5px 9px', lineHeight: 1 }}
              title="Menu"
            >
              ☰
            </button>
          </div>
        </div>
        <div className="hdr-bar">
          <div className="search-box">
            <span className="s-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar música ou artista…"
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && (
              <button className="s-clear" onClick={() => onSearch('')}>✕</button>
            )}
          </div>
          <div className="key-sel">
            <select value={filterKey} onChange={e => onFilterKey(e.target.value)}>
              <option value="">Tom</option>
              {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="key-arr">▾</span>
          </div>
        </div>
      </div>

      {/* Menu drawer */}
      {menuOpen && (
        <div className="menu-drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div className="menu-drawer-title">🎸 Menu</div>

            {!isApproved ? (
              /* ── Público / não logado ── */
              <>
                <div style={{ padding: '8px 4px 16px', color: '#888', fontSize: '13px', lineHeight: 1.5 }}>
                  Você está no <strong>modo demonstração</strong>.<br />
                  Faça login para acessar +970 músicas.
                </div>

                <a
                  className="menu-item-row"
                  href={'https://wa.me/5511971345013?text=' + encodeURIComponent('Olá! Quero ter acesso completo ao CIFREI.')}
                  target="_blank" rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <span className="menu-item-icon">💬</span>
                  <div>
                    <div className="menu-item-label">Quero acesso completo</div>
                    <div className="menu-item-sub">Fale conosco pelo WhatsApp</div>
                  </div>
                </a>

                <div style={{ borderTop: '1px solid #F0EEE8', margin: '8px 0' }} />

                <button className="menu-item-row" onClick={() => menuAction(onLogin)}>
                  <span className="menu-item-icon">🔑</span>
                  <div>
                    <div className="menu-item-label">Entrar</div>
                    <div className="menu-item-sub">Já tem acesso? Faça login aqui</div>
                  </div>
                </button>
              </>
            ) : (
              /* ── Logado ── */
              <>
                {!isAdmin && (
                  <>
                    <button className="menu-item-row" onClick={() => menuAction(onRequestMusic)}>
                      <span className="menu-item-icon">🎵</span>
                      <div>
                        <div className="menu-item-label">Pedir Nova Música</div>
                        <div className="menu-item-sub">Solicite uma cifra que não encontrou</div>
                      </div>
                    </button>

                    <button className="menu-item-row" onClick={() => menuAction(onFeedback)}>
                      <span className="menu-item-icon">💬</span>
                      <div>
                        <div className="menu-item-label">Feedback</div>
                        <div className="menu-item-sub">Nos diga o que achou do CIFREI</div>
                      </div>
                    </button>

                    <button className="menu-item-row" onClick={() => menuAction(onAtendimento)}>
                      <span className="menu-item-icon">🎧</span>
                      <div>
                        <div className="menu-item-label">Atendimento</div>
                        <div className="menu-item-sub">Precisa de ajuda? Fale conosco</div>
                      </div>
                    </button>

                    <div style={{ borderTop: '1px solid #F0EEE8', margin: '8px 0' }} />
                  </>
                )}

                <button className="menu-item-row" onClick={() => { setMenuOpen(false); onSignOut() }}>
                  <span className="menu-item-icon">⏏️</span>
                  <div>
                    <div className="menu-item-label">Sair</div>
                    <div className="menu-item-sub">{user?.email || ''}</div>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
