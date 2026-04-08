import React, { useState, useEffect, useMemo, useRef } from 'react'
import Header from './components/Header'
import SongCard from './components/SongCard'
import PlaylistModal from './components/PlaylistModal'
import PlaylistPicker from './components/PlaylistPicker'
import PlaylistView from './components/PlaylistView'
import AdminPage from './components/AdminPage'
import AccessBlockedModal from './components/AccessBlockedModal'
import RequestModal from './components/RequestModal'
import { groupByKey, normalizeStr } from './hooks/useChords'
import { usePlaylists } from './hooks/usePlaylists'
import { useAuth } from './hooks/useAuth'
import { supabase } from './supabase'

const KEY_ORDER = [
  'C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B',
  'Cm','C#m','Dbm','Dm','D#m','Ebm','Em','Fm','F#m','Gbm','Gm','G#m','Abm','Am','A#m','Bbm','Bm'
]

export default function App() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterKey, setFilterKey] = useState('')
  const [fontScale, setFontScale] = useState(1)
  const [showPlModal, setShowPlModal] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [pickerSongIdx, setPickerSongIdx] = useState(null)
  const [activePlId, setActivePlId] = useState(null)
  const [toast, setToast] = useState('')
  const [showBlocked, setShowBlocked] = useState(false)
  const [requestType, setRequestType] = useState(null) // 'music'|'feedback'|'atendimento'
  const toastTimer = useRef(null)

  const { playlists, create, rename, remove, toggleSong, moveSong, removeSong } = usePlaylists(user?.id)

  // Load songs
  useEffect(() => {
    fetch('/songs.json')
      .then(r => r.json())
      .then(data => { setSongs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Load user preferences
  useEffect(() => {
    if (!user) return
    supabase.from('user_preferences').select('font_scale').eq('user_id', user.id).single()
      .then(({ data }) => { if (data?.font_scale) setFontScale(data.font_scale) })
  }, [user])

  // Save font scale preference
  useEffect(() => {
    if (!user) return
    const t = setTimeout(() => {
      supabase.from('user_preferences')
        .upsert({ user_id: user.id, font_scale: fontScale }, { onConflict: 'user_id' })
    }, 800)
    return () => clearTimeout(t)
  }, [fontScale, user])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale)
  }, [fontScale])

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1600)
  }

  function handleFontChange(delta) {
    setFontScale(s => Math.min(2, Math.max(0.5, +(s + delta).toFixed(1))))
  }

  function handleAddToPlaylist(songIdx) {
    setPickerSongIdx(songIdx)
  }

  async function handlePickerToggle(plId, songIdx) {
    const added = await toggleSong(plId, songIdx)
    showToast(added ? 'Adicionada!' : 'Removida')
  }

  async function handlePickerCreate(name) {
    await create(name)
    showToast('Playlist criada!')
  }

  const activePl = playlists.find(p => p.id === activePlId)

  // Search
  const searchResults = useMemo(() => {
    const q = normalizeStr(search.trim())
    if (!q) return null
    return songs
      .map((s, i) => ({ ...s, _idx: i }))
      .filter(s => normalizeStr(s.title).includes(q) || normalizeStr(s.artist).includes(q))
      .slice(0, 60)
  }, [search, songs])

  // Grouped by key
  const grouped = useMemo(() => {
    let list = songs
    if (filterKey) list = songs.filter(s => s.key === filterKey)
    const g = groupByKey(list)
    return Object.keys(g)
      .sort((a, b) => {
        const ai = KEY_ORDER.indexOf(a), bi = KEY_ORDER.indexOf(b)
        return (ai >= 0 ? ai : 99) - (bi >= 0 ? bi : 99)
      })
      .map(key => ({ key, songs: g[key] }))
  }, [songs, filterKey])

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Carregando cifras…
      </div>
    )
  }

  return (
    <>
      <Header
        total={songs.length}
        search={search}
        onSearch={setSearch}
        filterKey={filterKey}
        onFilterKey={k => { setFilterKey(k); setSearch(''); setActivePlId(null) }}
        onFontChange={handleFontChange}
        onPlaylistOpen={() => setShowPlModal(true)}
        user={profile}
        isAdmin={isAdmin}
        onAdmin={() => setShowAdmin(true)}
        onSignOut={signOut}
        onRequestMusic={() => setRequestType('music')}
        onFeedback={() => setRequestType('feedback')}
        onAtendimento={() => setRequestType('atendimento')}
      />

      {/* Playlist view */}
      {activePlId && !search && (
        <PlaylistView
          playlist={activePl}
          songs={songs}
          fontScale={fontScale}
          onBack={() => setActivePlId(null)}
          onAddToPlaylist={handleAddToPlaylist}
                  onBlockedAction={() => setShowBlocked(true)}
          onMove={moveSong}
          onRemove={removeSong}
        />
      )}

      {/* Search results */}
      {search && !activePlId && (
        <div className="search-results">
          {searchResults.length === 0 ? (
            <div className="search-empty">Nenhuma música encontrada</div>
          ) : (
            <>
              <div className="search-meta">{searchResults.length} resultado(s)</div>
              {searchResults.map(s => (
                <SongCard
                  key={s._idx}
                  song={s}
                  songIdx={s._idx}
                  fontScale={fontScale}
                  onAddToPlaylist={handleAddToPlaylist}
                  onBlockedAction={() => setShowBlocked(true)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Main list grouped by key */}
      {!search && !activePlId && grouped.map(({ key, songs: keySongs }) => (
        <div className="key-section" key={key} id={`key-${key}`}>
          <div className="key-header">
            <span className="kh-note">🎵 {key}</span>
            <span className="kh-count">{keySongs.length}</span>
          </div>
          {keySongs.map(s => {
            const idx = songs.indexOf(s)
            return (
              <SongCard
                key={idx}
                song={s}
                songIdx={idx}
                fontScale={fontScale}
                onAddToPlaylist={handleAddToPlaylist}
                  onBlockedAction={() => setShowBlocked(true)}
              />
            )
          })}
        </div>
      ))}

      {/* Playlist modal */}
      {showPlModal && (
        <PlaylistModal
          playlists={playlists}
          songs={songs}
          onClose={() => setShowPlModal(false)}
          onCreate={create}
          onRename={rename}
          onDelete={remove}
          onView={id => { setActivePlId(id); setSearch(''); setShowPlModal(false) }}
        />
      )}

      {/* Playlist picker */}
      {pickerSongIdx !== null && (
        <PlaylistPicker
          playlists={playlists}
          songIdx={pickerSongIdx}
          onToggle={handlePickerToggle}
          onCreate={handlePickerCreate}
          onClose={() => setPickerSongIdx(null)}
        />
      )}

      {/* Admin panel */}
      {showAdmin && isAdmin && <AdminPage onClose={() => setShowAdmin(false)} />}

      {/* Access blocked modal */}
      {showBlocked && <AccessBlockedModal onClose={() => setShowBlocked(false)} />}

      {/* Request modals */}
      {requestType && <RequestModal type={requestType} onClose={() => setRequestType(null)} />}

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  )
}
