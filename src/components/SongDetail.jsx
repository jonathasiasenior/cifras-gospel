import React, { useState, useRef, useEffect } from 'react'
import { transposeRoot, transposeKey, transposeCifraText, expandLabel, expandSections } from '../hooks/useChords'
import { usePad } from '../hooks/usePad'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../supabase'
import { extractChords } from '../data/chordLibrary'
import ChordsPanel from './ChordsPanel'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

const INSTRUMENTS = [
  { id:'keyboard', label:'🎹 Teclado' },
  { id:'guitar',   label:'🎸 Violão/Guitarra' },
  { id:'ukulele',  label:'🪕 Ukulele' },
  { id:'cavaco',   label:'🎸 Cavaco' },
  { id:'viola',    label:'🎸 Viola Caipira' },
]

function chordSize(chord) {
  if (chord.length <= 3) return ''
  if (chord.length <= 6) return 'sm'
  return 'xs'
}

function renderTraditional(text, st, annotations) {
  const transposed = transposeCifraText(text, st, false)
  return transposed.split('\n').map((line, i) => {
    const trimmed = line.trim()
    const annot = annotations.find(a => a.line_idx === i)
    if (!trimmed) return '\n'
    if (/^\[.+\]$/.test(trimmed)) return `<span class="trad-section">${line}</span>\n`
    const tokens = trimmed.split(/\s+/)
    const chordCount = tokens.filter(t => /^[A-G][#b]?/.test(t)).length
    let cls = chordCount / tokens.length >= 0.5 ? 'trad-chord' : 'trad-lyric'
    let annotMark = annot ? `<span class="annot-mark" data-line="${i}" title="${annot.text}">📌 ${annot.text}</span>` : ''
    return `<span class="${cls}" data-line="${i}">${line}</span>${annotMark}\n`
  }).join('')
}

export default function SongDetail({ song, songIdx, onClose, onAddToPlaylist, onBlockedAction }) {
  const { user, profile } = useAuth()
  const isApproved = profile?.role === 'admin' || profile?.approved === true || !!user

  const [transpose, setTranspose] = useState(0)
  const [view, setView] = useState('traditional')
  const [instrument, setInstrument] = useState('keyboard')
  const [showChords, setShowChords] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [scrollSpeed, setScrollSpeed] = useState(3)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [savedEdit, setSavedEdit] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [annotations, setAnnotations] = useState([])
  const [annotMode, setAnnotMode] = useState(false)
  const [annotInput, setAnnotInput] = useState({ visible:false, lineIdx:null, text:'' })
  const rafRef = useRef(null)

  const currentKey = transposeKey(song.key || 'C', transpose)
  const sections = expandSections(song.sections || [])
  const { playing: padPlaying, toggle: togglePadRaw, padAvailable } = usePad(currentKey)
  const cifraContent = savedEdit || song.fullCifra || ''
  const uniqueChords = extractChords(cifraContent)

  useEffect(() => {
    if (!user) return
    supabase.from('song_edits').select('edited_cifra').eq('user_id', user.id).eq('song_idx', songIdx).single()
      .then(({ data }) => { if (data) setSavedEdit(data.edited_cifra) })
    loadAnnotations()
  }, [user, songIdx])

  async function loadAnnotations() {
    if (!user) return
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/song_annotations?user_id=eq.${user.id}&song_idx=eq.${songIdx}&select=*`,
        { headers: { 'Authorization': `Bearer ${SUPABASE_ANON}`, 'apikey': SUPABASE_ANON } }
      )
      if (res.ok) setAnnotations(await res.json())
    } catch { /* table may not exist yet */ }
  }

  useEffect(() => {
    if (scrolling) {
      const step = () => { window.scrollBy(0, scrollSpeed * 0.4); rafRef.current = requestAnimationFrame(step) }
      rafRef.current = requestAnimationFrame(step)
    } else cancelAnimationFrame(rafRef.current)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrolling, scrollSpeed])

  function doTranspose(delta) { setTranspose(t => ((t + delta) % 12 + 12) % 12) }

  function handleFeature(action) {
    if (!isApproved) { onBlockedAction?.(); return }
    action()
  }

  async function saveEdit() {
    if (!user) return
    setSavingEdit(true)
    const { error } = await supabase.from('song_edits').upsert({
      user_id: user.id, song_idx: songIdx, song_title: song.title,
      edited_cifra: editText, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,song_idx' })
    if (!error) { setSavedEdit(editText); setEditing(false) }
    setSavingEdit(false)
  }

  function handleCifraClick(e) {
    if (!annotMode || !isApproved) return
    // Try to find a specific line, fallback to -1 (general note)
    const span = e.target.closest('[data-line]')
    const lineIdx = span ? parseInt(span.dataset.line) : -1
    setAnnotInput({ visible:true, lineIdx, text:'' })
  }

  async function saveAnnotation() {
    if (!user || annotInput.lineIdx === null || !annotInput.text.trim()) return
    const body = { user_id: user.id, song_idx: songIdx, line_idx: annotInput.lineIdx, text: annotInput.text.trim(), song_title: song.title }
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/song_annotations`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON}`, 'apikey': SUPABASE_ANON, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(body)
      })
      setAnnotInput({ visible:false, lineIdx:null, text:'' })
      loadAnnotations()
    } catch { alert('Erro ao salvar anotação. A tabela song_annotations pode não existir ainda.') }
  }

  async function deleteAnnotation(id) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/song_annotations?id=eq.${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${SUPABASE_ANON}`, 'apikey': SUPABASE_ANON }
      })
      loadAnnotations()
    } catch {}
  }

  function shareWhatsApp() {
    const key = currentKey
    const text = `🎵 *${song.title}* — ${song.artist}\n🎼 Tom: ${key}\n\nCifra compartilhada pelo CIFREI App`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="detail-overlay" onClick={e => { if(e.target.classList.contains('detail-overlay')) onClose() }}>
      <div className="detail-modal">
        {/* Header */}
        <div className="detail-hdr">
          <button onClick={onClose} className="btn-back" style={{ padding:'0 8px 0 0' }}>←</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="song-title" style={{ fontSize:16 }}>{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
          <div style={{ display:'flex', gap:5, flexShrink:0 }}>
            {/* Transpose */}
            <div className="transposer">
              <button className="btn-t" onClick={() => doTranspose(-1)}>−</button>
              <span className="key-badge">{currentKey}</span>
              <button className="btn-t" onClick={() => doTranspose(1)}>+</button>
            </div>
            {/* PAD */}
            {padAvailable ? (
              <button onClick={() => handleFeature(togglePadRaw)} className="btn-pad" style={{ background: padPlaying?'#1a1a2e':'#F0EEE8', color: padPlaying?'#f0c040':'#666', boxShadow: padPlaying?'0 0 0 2px #f0c040':'none' }}>
                {padPlaying?'⏸':'▶'} PAD
              </button>
            ) : null}
            {/* Add playlist */}
            <button className="btn-icon btn-pl-add" onClick={() => handleFeature(() => onAddToPlaylist(songIdx))} title="Adicionar à playlist">+</button>
          </div>
        </div>

        {/* Action bar */}
        <div className="detail-actions">
          <button className={`act-btn${annotMode?' act-btn-active':''}`} onClick={() => handleFeature(() => setAnnotMode(m=>!m))} title="Modo anotação">
            📌 {annotMode ? 'Anotando…' : 'Anotar'}
          </button>
          <button className="act-btn" onClick={() => handleFeature(() => setShowChords(s=>!s))} title="Ver acordes">
            🎵 Ver acordes
          </button>
          <button className="act-btn" onClick={shareWhatsApp} title="Compartilhar no WhatsApp">
            📲 WhatsApp
          </button>
          {isApproved && (
            <button className="act-btn" onClick={() => { setEditText(cifraContent); setEditing(true) }} title="Editar cifra">
              ✏️ Editar{savedEdit?' ●':''}
            </button>
          )}
        </div>

        {annotMode && (
          <div style={{ background:'#fff8e1', padding:'8px 12px', fontSize:'12px', color:'#8B6914', borderBottom:'1px solid #ffe082' }}>
            📌 Modo anotação ativo — clique em qualquer parte da cifra para adicionar uma nota
          </div>
        )}

        {/* Chords panel */}
        {showChords && (
          <ChordsPanel
            chords={uniqueChords}
            instrument={instrument}
            onInstrumentChange={setInstrument}
            onClose={() => setShowChords(false)}
          />
        )}

        {/* Annotation input */}
        {annotInput.visible && (
          <div className="annot-input-overlay">
            <div className="annot-input-box">
              <div style={{ fontSize:13, fontWeight:700, marginBottom:8, color:'#1a1a2e' }}>📌 Adicionar anotação</div>
              <textarea
                autoFocus
                value={annotInput.text}
                onChange={e => setAnnotInput(a => ({...a, text:e.target.value}))}
                placeholder="Escreva sua anotação…"
                style={{ width:'100%', height:80, padding:8, border:'1px solid #DDD', borderRadius:8, fontSize:13, resize:'none', outline:'none' }}
              />
              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <button onClick={saveAnnotation} style={{ flex:1, background:'#1a1a2e', color:'#fff', border:'none', borderRadius:8, padding:'9px', fontWeight:700, cursor:'pointer', fontSize:13 }}>Salvar</button>
                <button onClick={() => setAnnotInput({visible:false,lineIdx:null,text:''})} style={{ background:'#F0EEE8', border:'none', borderRadius:8, padding:'9px 14px', fontWeight:700, cursor:'pointer', color:'#666', fontSize:13 }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Annotations list */}
        {annotations.length > 0 && (
          <div style={{ padding:'8px 12px', background:'#FFF8E1', borderBottom:'1px solid #FFE082' }}>
            <div style={{ fontSize:11, fontWeight:800, color:'#8B6914', marginBottom:4, textTransform:'uppercase', letterSpacing:.5 }}>Suas anotações</div>
            {annotations.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'flex-start', gap:6, marginBottom:4 }}>
                <span style={{ fontSize:12, color:'#666', flex:1 }}>📌 {a.text}</span>
                <button onClick={() => deleteAnnotation(a.id)} style={{ background:'none', border:'none', color:'#EE4444', fontSize:14, cursor:'pointer', lineHeight:1, padding:'0 2px' }}>×</button>
              </div>
            ))}
          </div>
        )}

        {/* View toggle */}
        <div className="view-toggle" style={{ padding:'0 12px' }}>
          <button className={`vtb${view==='traditional'?' active':''}`} onClick={() => setView('traditional')}>Tradicional</button>
          <button className={`vtb${view==='compact'?' active':''}`} onClick={() => handleFeature(() => setView('compact'))}>Compactada</button>
        </div>

        {/* TRADICIONAL view */}
        {view === 'traditional' && (
          <div className="song-full" onClick={annotMode && !editing ? handleCifraClick : undefined}
            style={{ cursor: annotMode && !editing ? 'crosshair' : 'auto' }}>
            {!editing && (
              <div className="scroll-ctrl" onClick={e => e.stopPropagation()}>
                <button className={`scroll-play${scrolling?' active':''}`} onClick={() => setScrolling(s=>!s)}>
                  {scrolling ? '⏹ Parar' : '▶ Auto-scroll'}
                </button>
                <div className="scroll-spd">
                  <button className="spd-btn" onClick={() => setScrollSpeed(s=>Math.max(1,s-1))}>−</button>
                  <span className="spd-val">{scrollSpeed}</span>
                  <button className="spd-btn" onClick={() => setScrollSpeed(s=>Math.min(10,s+1))}>+</button>
                </div>
              </div>
            )}
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }} onClick={e=>e.stopPropagation()}>
                <textarea value={editText} onChange={e=>setEditText(e.target.value)}
                  style={{ width:'100%', minHeight:300, fontFamily:"'Courier New',monospace", fontSize:13, lineHeight:1.7, padding:10, border:'1px solid #e0ddd6', borderRadius:10, resize:'vertical', outline:'none', color:'#333', background:'#F8F7F4' }}/>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={saveEdit} disabled={savingEdit} style={{ flex:1, padding:10, background:'#1a1a2e', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14 }}>
                    {savingEdit?'Salvando…':'💾 Salvar versão editada'}
                  </button>
                  <button onClick={() => setEditing(false)} style={{ padding:'10px 16px', background:'#F0EEE8', color:'#666', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:14 }}>Cancelar</button>
                </div>
              </div>
            ) : cifraContent ? (
              <pre className="full-pre"
                dangerouslySetInnerHTML={{ __html: renderTraditional(cifraContent, transpose, annotations) }}
              />
            ) : (
              <div style={{ color:'#AAA', fontSize:13, padding:12 }}>Cifra completa não disponível</div>
            )}
          </div>
        )}

        {/* COMPACT view */}
        {view === 'compact' && (
          <div className="song-body">
            {sections.length === 0 ? (
              <div style={{ padding:12, color:'#AAA', fontSize:13 }}>Sem acordes disponíveis</div>
            ) : sections.map((sec, i) => {
              const chords = (sec.chords||[]).map(line =>
                transpose !== 0
                  ? line.replace(/([A-G][#b]?)((?:maj|min|m|M|aug|dim|sus|add|dom)?(?:\d+)?(?:\/[A-G][#b]?)?)/g,
                      (_, root, qual) => transposeRoot(root, transpose, false) + qual)
                  : line
              )
              return (
                <div className="sec" key={i}>
                  {sec.label && <div className="sec-label">{expandLabel(sec.label)}</div>}
                  {sec.hint && <div className="sec-hint">{sec.hint}</div>}
                  {chords.map((chord, j) => <div key={j} className={`cl ${chordSize(chord)}`}>{chord}</div>)}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
