import React from 'react'
import SongCard from './SongCard'

export default function PlaylistView({ playlist, songs, fontScale, onBack, onAddToPlaylist, onMove, onRemove }) {
  if (!playlist) return null

  return (
    <div>
      <div className="pl-view-hdr">
        <button className="btn-back" onClick={onBack}>←</button>
        <span className="pl-view-title">{playlist.name}</span>
        <span className="pl-view-count">{playlist.songs.length} músicas</span>
      </div>
      {playlist.songs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#AAA', fontSize: '14px' }}>
          Nenhuma música nesta playlist.
        </div>
      ) : playlist.songs.map((songIdx, pos) => {
        const song = songs[songIdx]
        if (!song) return null
        return (
          <div key={songIdx + '-' + pos}>
            <div className="pl-song-item">
              <span className="pl-song-order">{pos + 1}</span>
              <div className="pl-song-info">
                <div className="pl-song-title">{song.title}</div>
                <div className="pl-song-artist">{song.artist}</div>
              </div>
              <div className="pl-song-acts">
                <button className="btn-pl-mv" onClick={() => onMove(playlist.id, pos, -1)} disabled={pos === 0}>↑</button>
                <button className="btn-pl-mv" onClick={() => onMove(playlist.id, pos, 1)} disabled={pos === playlist.songs.length - 1}>↓</button>
                <button className="btn-pl-rm" onClick={() => onRemove(playlist.id, pos)}>✕</button>
              </div>
            </div>
            <SongCard
              song={song}
              songIdx={songIdx}
              fontScale={fontScale}
              onAddToPlaylist={onAddToPlaylist}
            />
          </div>
        )
      })}
    </div>
  )
}
