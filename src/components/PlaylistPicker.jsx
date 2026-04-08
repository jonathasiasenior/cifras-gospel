import React from 'react'
import { useAuth } from '../hooks/useAuth'

export default function PlaylistPicker({ playlists, songIdx, onToggle, onCreate, onClose, onBlockedAction }) {
  const { profile } = useAuth()
  const isApproved = profile?.role === 'admin' || profile?.approved === true

  function handleCreate() {
    if (!isApproved) { onClose(); onBlockedAction?.(); return }
    const name = prompt('Nome:')
    if (name?.trim()) onCreate(name)
    onClose()
  }

  return (
    <div className="picker-overlay" onClick={onClose}>
      <div className="pl-picker" onClick={e => e.stopPropagation()}>
        <div className="picker-title">Adicionar à playlist</div>
        {playlists.length === 0 && (
          <div style={{ color: '#AAA', fontSize: '13px', marginBottom: '8px' }}>Nenhuma playlist criada.</div>
        )}
        {playlists.map(pl => {
          const inPl = pl.songs.includes(songIdx)
          return (
            <div
              key={pl.id}
              className={`picker-item${inPl ? ' in-pl' : ''}`}
              onClick={() => { onToggle(pl.id, songIdx); onClose() }}
            >
              {inPl ? '✓ ' : ''}{pl.name}
              <span style={{ float: 'right', fontSize: '11px', color: '#AAA' }}>{pl.songs.length} músicas</span>
            </div>
          )
        })}
        <button className="btn-new-pl-picker" onClick={handleCreate}>+ Nova Playlist</button>
      </div>
    </div>
  )
}
