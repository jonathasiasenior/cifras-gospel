import React from 'react'
import { getChordNotes } from '../data/chordLibrary'

// Shows a mini piano keyboard with highlighted keys
// noteIndices: array of note class indices 0=C,1=C#,2=D,3=D#,4=E,5=F,6=F#,7=G,8=G#,9=A,10=A#,11=B

const WHITE_KEYS = [0,2,4,5,7,9,11] // C D E F G A B
const BLACK_KEYS = [1,3,6,8,10]      // C# D# F# G# A#
// Black key positions within an octave (index among white keys, offset)
const BLACK_POS = { 1:0, 3:1, 6:3, 8:4, 10:5 }

export default function KeyboardDiagram({ chordName, compact = false }) {
  const notes = getChordNotes(chordName)
  const octaves = 2
  const wkW = compact ? 11 : 14
  const wkH = compact ? 44 : 55
  const bkW = compact ? 7 : 9
  const bkH = compact ? 28 : 35
  const totalWhiteKeys = WHITE_KEYS.length * octaves
  const totalW = totalWhiteKeys * wkW
  const nameSize = compact ? 9 : 11

  function isPressed(octave, noteClass) {
    return notes.includes(noteClass)
  }

  return (
    <svg width={totalW + 2} height={wkH + nameSize + 8} viewBox={`0 0 ${totalW+2} ${wkH + nameSize + 8}`} style={{ display:'block' }}>
      <text x={(totalW+2)/2} y={nameSize} textAnchor="middle" fontSize={nameSize} fontWeight="800" fill="#1a1a2e" fontFamily="system-ui,sans-serif">
        {chordName}
      </text>
      <g transform={`translate(1,${nameSize+4})`}>
        {/* White keys */}
        {Array.from({length:octaves}, (_,oct) =>
          WHITE_KEYS.map((noteClass, wi) => {
            const x = (oct * WHITE_KEYS.length + wi) * wkW
            const pressed = isPressed(oct, noteClass)
            return (
              <rect key={`w${oct}-${wi}`} x={x} y={0} width={wkW-1} height={wkH}
                fill={pressed ? '#f0c040' : '#fff'}
                stroke="#BBB" strokeWidth={0.8} rx={1}
              />
            )
          })
        )}
        {/* Black keys */}
        {Array.from({length:octaves}, (_,oct) =>
          Object.entries(BLACK_POS).map(([noteClass, whiteIdx]) => {
            const nc = parseInt(noteClass)
            const x = (oct * WHITE_KEYS.length + whiteIdx) * wkW + wkW * 0.6
            const pressed = isPressed(oct, nc)
            return (
              <rect key={`b${oct}-${nc}`} x={x} y={0} width={bkW} height={bkH}
                fill={pressed ? '#f0c040' : '#222'}
                stroke="none" rx={1}
              />
            )
          })
        )}
        {/* Dots on pressed white keys */}
        {Array.from({length:octaves}, (_,oct) =>
          WHITE_KEYS.map((noteClass, wi) => {
            if (!isPressed(oct, noteClass)) return null
            const x = (oct * WHITE_KEYS.length + wi) * wkW + (wkW-1)/2
            return (
              <circle key={`wd${oct}-${wi}`} cx={x} cy={wkH - 7} r={compact ? 3 : 4}
                fill="#1a1a2e" opacity={0.7}/>
            )
          })
        )}
        {/* Dots on pressed black keys */}
        {Array.from({length:octaves}, (_,oct) =>
          Object.entries(BLACK_POS).map(([noteClass, whiteIdx]) => {
            const nc = parseInt(noteClass)
            if (!isPressed(oct, nc)) return null
            const x = (oct * WHITE_KEYS.length + whiteIdx) * wkW + wkW * 0.6 + bkW/2
            return (
              <circle key={`bd${oct}-${nc}`} cx={x} cy={bkH - 6} r={compact ? 3 : 4}
                fill="#fff" opacity={0.9}/>
            )
          })
        )}
      </g>
    </svg>
  )
}
