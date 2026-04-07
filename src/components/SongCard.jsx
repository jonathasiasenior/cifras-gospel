import React, { useState, useRef, useEffect } from 'react'
import { transposeRoot, transposeKey, transposeCifraText, expandLabel, expandSections } from '../hooks/useChords'
import { usePad } from '../hooks/usePad'

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
    // section headers like [Verso], [Refrão]
    if (/^\[.+\]$/.test(trimmed)) {
      return `<span class="trad-section">${line}</span>\n`
    }
    // chord lines
    const tokens = trimmed.split(/\s+/)
    const chordCount = tokens.filter(t => /^[A-G][b#]?/.test(t)).length
    if (chordCount / tokens.length >= 0.5) {
      return `<span class="trad-chord">${line}</span>\n`
    }
    return line + '\n'
  }).join('')
}

export default function SongCard({ song, songIdx, fontScale, onAddToPlaylist }) {
  const [transpose, setTranspose] = useState(0)
  const [view, setView] = useState('compact') // compact | full
  const [scrolling, setScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const scrollRef = useRef(null)
  const rafRef = useRef(null)

  const currentKey = transposeKey(song.key || 'C', transpose)
  const sections = expandSections(song.sections || [])
  const { playing: padPlaying, toggle: togglePad } = usePad(currentKey)

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
          <button className="btn-icon btn-pl-add" onClick={() => onAddToPlaylist(songIdx)} title="Adicionar à playlist">+</button>
        </div>
      </div>

      <div className="view-toggle">
        <button className={`vtb${view === 'compact' ? ' active' : ''}`} onClick={() => setView('compact')}>Acordes</button>
        <button className={`vtb${view === 'full' ? ' active' : ''}`} onClick={() => setView('full')}>Cifra</button>
      </div>

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

      {view === 'full' && (
        <div className="song-full" style={{ '--font-scale': fontScale }}>
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
          </div>
          {song.fullCifra ? (
            <pre
              className="full-pre"
              dangerouslySetInnerHTML={{
                __html: renderTraditional(song.fullCifra, transpose, false)
              }}
            />
          ) : (
            <div style={{ color: '#AAA', fontSize: '13px', padding: '12px' }}>Cifra completa não disponível</div>
          )}
        </div>
      )}
    </div>
  )
}
