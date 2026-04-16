import React from 'react'
import GuitarDiagram from './GuitarDiagram'
import KeyboardDiagram from './KeyboardDiagram'
import { getChordVoicing } from '../data/chordLibrary'

const INSTRUMENTS = [
  { id:'keyboard', label:'Teclado' },
  { id:'guitar',   label:'Violão/Guitarra' },
  { id:'ukulele',  label:'Ukulele' },
  { id:'cavaco',   label:'Cavaco' },
  { id:'viola',    label:'Viola Caipira' },
]

const STRING_COUNT = { guitar:6, ukulele:4, cavaco:4, viola:5 }

export default function ChordsPanel({ chords, instrument, onInstrumentChange, onClose }) {
  if (!chords || chords.length === 0) return (
    <div style={{ padding:'20px', textAlign:'center', color:'#AAA', fontSize:'13px' }}>
      Nenhum acorde encontrado
      <div><button onClick={onClose} style={{ marginTop:12, background:'none', border:'none', color:'#888', cursor:'pointer' }}>Fechar</button></div>
    </div>
  )

  return (
    <div className="chords-panel">
      <div className="chords-panel-hdr">
        <span style={{ fontSize:'14px', fontWeight:'800', color:'#1a1a2e' }}>Acordes da música</span>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', color:'#999', cursor:'pointer', lineHeight:1 }}>×</button>
      </div>

      {/* Instrument tabs */}
      <div className="instr-tabs">
        {INSTRUMENTS.map(ins => (
          <button key={ins.id} className={`instr-tab${instrument===ins.id?' active':''}`} onClick={() => onInstrumentChange(ins.id)}>
            {ins.label}
          </button>
        ))}
      </div>

      {/* Chord diagrams grid */}
      <div className="chord-grid">
        {chords.map(chord => {
          if (instrument === 'keyboard') {
            return (
              <div key={chord} className="chord-item">
                <KeyboardDiagram chordName={chord} compact />
              </div>
            )
          }
          const voicing = getChordVoicing(chord, instrument)
          return (
            <div key={chord} className="chord-item">
              <GuitarDiagram
                chordName={chord}
                voicing={voicing}
                stringCount={STRING_COUNT[instrument] || 6}
                compact
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
