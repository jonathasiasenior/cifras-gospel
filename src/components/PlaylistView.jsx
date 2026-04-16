import React, { useState } from 'react'
import SongDetail from './SongDetail'

export default function PlaylistView({ playlist, songs, fontScale, onBack, onAddToPlaylist, onMove, onRemove, onBlockedAction }) {
  const [openSong, setOpenSong] = useState(null)

  if (!playlist) return null

  function sharePlaylistWhatsApp() {
    const list = playlist.songs.map((idx, i) => {
      const s = songs[idx]
      return s ? `${i+1}. ${s.title} — ${s.artist} (${s.key})` : ''
    }).filter(Boolean).join('\n')
    const text = `📋 *Playlist: ${playlist.name}*\n\n${list}\n\nCompartilhado pelo CIFREI App`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div>
      <div className="pl-view-hdr">
        <button className="btn-back" onClick={onBack}>←</button>
        <span className="pl-view-title">{playlist.name}</span>
        <span className="pl-view-count">{playlist.songs.length} músicas</span>
        <button onClick={sharePlaylistWhatsApp} style={{ background:'#25D366', border:'none', borderRadius:10, padding:'6px 10px', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', marginLeft:6, flexShrink:0 }}>
          📲 WhatsApp
        </button>
      </div>
      {playlist.songs.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 24px', color:'#AAA', fontSize:14 }}>
          Nenhuma música nesta playlist.
        </div>
      ) : playlist.songs.map((songIdx, pos) => {
        const song = songs[songIdx]
        if (!song) return null
        return (
          <div key={songIdx + '-' + pos}>
            <div className="pl-song-item" style={{ cursor:'pointer' }} onClick={() => setOpenSong({ song, songIdx })}>
              <span className="pl-song-order">{pos + 1}</span>
              <div className="pl-song-info">
                <div className="pl-song-title">{song.title}</div>
                <div className="pl-song-artist">{song.artist} · {song.key}</div>
              </div>
              <div className="pl-song-acts" onClick={e => e.stopPropagation()}>
                <button className="btn-pl-mv" onClick={() => onMove(playlist.id, pos, -1)} disabled={pos === 0}>↑</button>
                <button className="btn-pl-mv" onClick={() => onMove(playlist.id, pos, 1)} disabled={pos === playlist.songs.length - 1}>↓</button>
                <button className="btn-pl-rm" onClick={() => onRemove(playlist.id, pos)}>✕</button>
              </div>
            </div>
          </div>
        )
      })}

      {openSong && (
        <SongDetail
          song={openSong.song}
          songIdx={openSong.songIdx}
          onClose={() => setOpenSong(null)}
          onAddToPlaylist={idx => { onAddToPlaylist?.(idx); setOpenSong(null) }}
          onBlockedAction={onBlockedAction}
        />
      )}
    </div>
  )
}
