import React from 'react'

const KEYS = ['C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B',
              'Cm','C#m','Dbm','Dm','D#m','Ebm','Em','Fm','F#m','Gbm','Gm','G#m','Abm','Am','A#m','Bbm','Bm']

export default function Header({ total, search, onSearch, filterKey, onFilterKey, onFontChange, onPlaylistOpen, user, isAdmin, onAdmin, onSignOut }) {
  return (
    <div className="hdr">
      <div className="hdr-top">
        <div className="logo">
          <span className="logo-icon">🎸</span>
          CIFREI
        </div>
        <div className="hdr-right">
          <span className="badge-count">{total} músicas</span>
          <div className="font-ctrl-hdr">
            <button className="font-btn-hdr" onClick={() => onFontChange(-0.1)}>A−</button>
            <button className="font-btn-hdr" onClick={() => onFontChange(0.1)}>A+</button>
          </div>
          <button className="btn-pl-hdr" onClick={onPlaylistOpen}>♫ Playlists</button>
          {isAdmin && (
            <button className="btn-pl-hdr" onClick={onAdmin} style={{ color: '#f0c040' }}>⚙️</button>
          )}
          <button
            onClick={onSignOut}
            title={`Sair (${user?.email || ''})`}
            style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: '18px', cursor: 'pointer', borderRadius: '8px', padding: '5px 8px', lineHeight: 1 }}
          >
            ⏏
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
  )
}
