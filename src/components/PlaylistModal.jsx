import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function PlaylistModal({ playlists, songs, onClose, onCreate, onRename, onDelete, onView, onBlockedAction }) {
  const [newName, setNewName] = useState('')
  const { user } = useAuth()
  const isApproved = !!user

  function handleCreate() {
    if (!isApproved) { onClose(); onBlockedAction?.(); return }
    const name = prompt('Nome da playlist:')
    if (name?.trim()) onCreate(name)
  }

  function handleRename(pl) {
    const name = prompt('Novo nome:', pl.name)
    if (name?.trim()) onRename(pl.id, name)
  }

  function handleDelete(pl) {
    if (confirm(`Excluir "${pl.name}"?`)) onDelete(pl.id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="pl-modal" onClick={e => e.stopPropagation()}>
        <div className="pl-modal-hdr">
          <span className="pl-modal-title">♫ Playlists</span>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>
        <button className="btn-new-pl" onClick={handleCreate}>+ Nova Playlist</button>
        {playlists.length === 0 ? (
          <div className="pl-empty">Nenhuma playlist ainda.<br/>Crie uma para organizar suas músicas.</div>
        ) : playlists.map(pl => (
          <div key={pl.id} className="pl-item" onClick={() => { onView(pl.id); onClose() }}>
            <div>
              <div className="pl-name">{pl.name}</div>
              <div className="pl-count">{pl.songs.length} músicas</div>
            </div>
            <div className="pl-item-actions" onClick={e => e.stopPropagation()}>
              <button className="btn-pl-act" onClick={() => handleRename(pl)} title="Renomear">✏️</button>
              <button className="btn-pl-act" onClick={() => handleDelete(pl)} title="Excluir">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
