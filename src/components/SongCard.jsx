import React, { useState, useRef, useEffect } from 'react'
import { transposeRoot, transposeKey, transposeCifraText, expandLabel, expandSections } from '../hooks/useChords'
import { usePad } from '../hooks/usePad'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'

function chordSize(chord) {
  if (chord.length <= 3) return ''
  if (chord.length <= 6) return 'sm'
  return 'xs'
}

function renderTraditional(text, st, flat) {
  const transposed = transposeCifraText(text, st, flat)
  return transposed.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) return '\n'
    if (/^\[.+\]$/.test(trimmed)) {
      return `<span class="trad-section">${line}</span>\n`
    }
    const tokens = trimmed.split(/\s+/)
    const chordCount = tokens.filter(t => /^[A-G][b#]?/.test(t)).length
    if (chordCount / tokens.length >= 0.5) {
      return `<span class="trad-chord">${line}</span>\n`
    }
    return line + '\n'
  }).join('')
}

export default function SongCard({ song, songIdx, fontScale, onAddToPlaylist, onBlockedAction }) {
  const { user, profile } = useAuth()
  const isApproved = profile?.approved === true

  const [transpose, setTranspose] = useState(0)
  const [view, setView] = useState('traditional') // traditional | compact
  const [scrolling, setScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [savedEdit, setSavedEdit] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const scrollRef = useRef(null)
  const rafRef = useRef(null)

  const currentKey = transposeKey(song.key || 'C', transpose)
  const sections = expandSections(song.sections || [])
  const { playing: padPlaying, toggle: togglePadRaw } = usePad(currentKey)

  // Load any existing edit for this song
  useEffect(() => {
    if (!user || !isApproved) return
    supabase.from('song_edits')
      .select('edited_cifra')
      .eq('user_id', user.id)
      .eq('song_idx', songIdx)
      .single()
      .then(({ data }) => { if (data) setSavedEdit(data.edited_cifra) })
  }, [user, songIdx, isApproved])

  useEffect(() => {
    if (scrolling) {
      const step = () => {
        window.scrollBy(0, scrollSpeed * 0.4)
        rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    } else {
      cancelAnimationFrame(rafRef.current)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrolling, scrollSpeed])

  function doTranspose(delta) {
    setTranspose(t => ((t + delta) % 12 + 12) % 12)
  }

  function handleFeature(action) {
    if (!isApproved) { onBlockedAction?.(); return }
    action()
  }

  function togglePad() {
    handleFeature(togglePadRaw)
  }

  function startEdit() {
    if (!isApproved) { onBlockedAction?.(); return }
    const baseText = savedEdit || song.fullCifra || ''
    setEditText(baseText)
    setEditing(true)
  }

  async function saveEdit() {
    if (!user) return
    setSavingEdit(true)
    const { error } = await supabase.from('song_edits').upsert({
      user_id: user.id,
      song_idx: songIdx,
      song_title: song.title,
      edited_cifra: editText,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,song_idx' })
    if (!error) {
      setSavedEdit(editText)
      setEditing(false)
    }
    setSavingEdit(false)
  }

  const cifraContent = savedEdit || song.fullCifra

  return (
    <div className="song" ref={scrollRef}>
      <div className="song-head">
        <div className="song-info">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>
        </div>
        <div className="song-actions">
          <div className="transposer">
            <button className="btn-t" onClick={() => doTranspose(-1)}>−</button>
            <span className="key-badge">{currentKey}</span>
            <button className="btn-t" onClick={() => doTranspose(1)}>+</button>
          </div>
          <button
            onClick={togglePad}
            title={padPlaying ? 'Parar pad' : `Tocar pad (${currentKey})`}
            style={{
              background: padPlaying ? '#1a1a2e' : '#F0EEE8',
              border: 'none', borderRadius: '8px',
              padding: '0 10px', height: '30px',
              fontSize: '12px', fontWeight: '800',
              cursor: 'pointer', color: padPlaying ? '#f0c040' : '#666',
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all .2s', whiteSpace: 'nowrap',
              boxShadow: padPlaying ? '0 0 0 2px #f0c040' : 'none'
            }}
          >
            {padPlaying ? '⏸' : '▶'} PAD
          </button>
          <button className="btn-icon btn-pl-add" onClick={() => handleFeature(() => onAddToPlaylist(songIdx))} title="Adicionar à playlist">+</button>
        </div>
      </div>

      {/* Tabs: Tradicional first, Compactada second */}
      <div className="view-toggle">
        <button className={`vtb${view === 'traditional' ? ' active' : ''}`} onClick={() => setView('traditional')}>Tradicional</button>
        <button className={`vtb${view === 'compact' ? ' active' : ''}`} onClick={() => setView('compact')}>Compactada</button>
      </div>

      {/* TRADICIONAL view */}
      {view === 'traditional' && (
        <div className="song-full" style={{ '--font-scale': fontScale }}>
          {!editing && (
            <div className="scroll-ctrl">
              <button
                className={`scroll-play${scrolling ? ' active' : ''}`}
                onClick={() => setScrolling(s => !s)}
              >
                {scrolling ? '⏹ Parar' : '▶ Auto-scroll'}
              </button>
              <div className="scroll-spd">
                <button className="spd-btn" onClick={() => setScrollSpeed(s => Math.max(1, s - 1))}>−</button>
                <span className="spd-val">{scrollSpeed}</span>
                <button className="spd-btn" onClick={() => setScrollSpeed(s => Math.min(10, s + 1))}>+</button>
              </div>
              {isApproved && (
                <button onClick={startEdit} className="btn-edit-cifra" title="Editar cifra">
                  ✏️ Editar{savedEdit ? ' ●' : ''}
                </button>
              )}
            </div>
          )}

          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                style={{
                  width: '100%', minHeight: '300px', fontFamily: "'Courier New',monospace",
                  fontSize: '13px', lineHeight: '1.7', padding: '10px', border: '1px solid #e0ddd6',
                  borderRadius: '10px', resize: 'vertical', outline: 'none', color: '#333', background: '#F8F7F4'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={saveEdit} disabled={savingEdit} style={{
                  flex: 1, padding: '10px', background: '#1a1a2e', color: '#fff',
                  border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px'
                }}>
                  {savingEdit ? 'Salvando…' : '💾 Salvar em Músicas Editadas'}
                </button>
                <button onClick={() => setEditing(false)} style={{
                  padding: '10px 16px', background: '#F0EEE8', color: '#666',
                  border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px'
                }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : cifraContent ? (
            <pre
              className="full-pre"
              dangerouslySetInnerHTML={{ __html: renderTraditional(cifraContent, transpose, false) }}
            />
          ) : (
            <div style={{ color: '#AAA', fontSize: '13px', padding: '12px' }}>Cifra completa não disponível</div>
          )}
        </div>
      )}

      {/* COMPACTADA view */}
      {view === 'compact' && (
        <div className="song-body" style={{ '--font-scale': fontScale }}>
          {sections.length === 0 ? (
            <div style={{ padding: '12px', color: '#AAA', fontSize: '13px' }}>Sem acordes disponíveis</div>
          ) : sections.map((sec, i) => {
            const chords = (sec.chords || []).map(line =>
              transpose !== 0
                ? line.replace(/([A-G][b#]?)((?:maj|min|m|M|aug|dim|sus|add|dom|mmaj)?(?:\d+)?(?:\/[A-G][b#]?)?)/g,
                    (_, root, qual) => transposeRoot(root, transpose, false) + qual)
                : line
            )
            return (
              <div className="sec" key={i}>
                {sec.label && <div className="sec-label">{expandLabel(sec.label)}</div>}
                {sec.hint && <div className="sec-hint">{sec.hint}</div>}
                {chords.map((chord, j) => (
                  <div key={j} className={`cl ${chordSize(chord)}`}>{chord}</div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
