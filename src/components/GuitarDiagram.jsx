import React from 'react'

// stringCount: 4 or 6
// frets: array of fret numbers (-1=muted, 0=open, 1+=pressed)
// barre: { fret, from, to } (string indices)
// fingers: array of finger numbers (optional)
export default function GuitarDiagram({ chordName, voicing, stringCount = 6, compact = false }) {
  if (!voicing) {
    return (
      <div style={{ textAlign:'center', fontSize:'10px', color:'#CCC', padding:'8px 4px' }}>
        {chordName}<br/>
        <span style={{ fontSize:'9px' }}>diagrama indisponível</span>
      </div>
    )
  }

  const { frets, barre } = voicing
  const W = compact ? 60 : 80
  const H = compact ? 75 : 100
  const STRINGS = stringCount
  const FRETS_SHOWN = 5
  const marginTop = compact ? 16 : 20
  const marginLeft = compact ? 10 : 12
  const marginRight = compact ? 10 : 12
  const gridW = W - marginLeft - marginRight
  const gridH = H - marginTop - (compact ? 8 : 10)
  const stringSpacing = gridW / (STRINGS - 1)
  const fretSpacing = gridH / FRETS_SHOWN
  const dotR = compact ? 4 : 5.5

  // Determine start fret
  const pressedFrets = frets.filter(f => f > 0)
  let startFret = 1
  if (pressedFrets.length > 0) {
    const minF = Math.min(...pressedFrets)
    startFret = minF <= 4 ? 1 : minF
  }
  if (barre) startFret = Math.min(startFret, barre.fret)

  const isNut = startFret === 1
  const nameSize = compact ? 9 : 11

  return (
    <svg width={W} height={H + nameSize + 4} viewBox={`0 0 ${W} ${H + nameSize + 4}`} style={{ display:'block' }}>
      {/* Chord name */}
      <text x={W/2} y={nameSize} textAnchor="middle" fontSize={nameSize} fontWeight="800" fill="#1a1a2e" fontFamily="system-ui,sans-serif">
        {chordName}
      </text>

      <g transform={`translate(0,${nameSize + 4})`}>
        {/* Nut or fret number */}
        {isNut ? (
          <rect x={marginLeft} y={marginTop - 3} width={gridW} height={3} fill="#1a1a2e" rx={1}/>
        ) : (
          <text x={marginLeft - 6} y={marginTop + fretSpacing/2} textAnchor="end" fontSize={8} fill="#888" fontFamily="system-ui">{startFret}fr</text>
        )}

        {/* Fret lines */}
        {Array.from({length: FRETS_SHOWN + 1}, (_,i) => (
          <line key={i} x1={marginLeft} y1={marginTop + i*fretSpacing} x2={marginLeft+gridW} y2={marginTop + i*fretSpacing}
            stroke={i===0 && !isNut ? '#CCC' : '#DDD'} strokeWidth={i===0 && isNut ? 0 : 0.8}/>
        ))}

        {/* String lines */}
        {Array.from({length: STRINGS}, (_,s) => (
          <line key={s} x1={marginLeft + s*stringSpacing} y1={marginTop} x2={marginLeft + s*stringSpacing} y2={marginTop + FRETS_SHOWN*fretSpacing}
            stroke="#BBB" strokeWidth={0.8}/>
        ))}

        {/* Barre */}
        {barre && barre.fret >= startFret && barre.fret < startFret + FRETS_SHOWN && (
          <rect
            x={marginLeft + barre.from * stringSpacing - dotR}
            y={marginTop + (barre.fret - startFret)*fretSpacing + fretSpacing/2 - dotR}
            width={(barre.to - barre.from) * stringSpacing + dotR*2}
            height={dotR*2}
            fill="#1a1a2e" rx={dotR}
          />
        )}

        {/* Open / muted markers above nut */}
        {frets.map((f, s) => {
          const cx = marginLeft + s * stringSpacing
          const cy = marginTop - 7
          if (f === -1) return (
            <text key={s} x={cx} y={cy + 3} textAnchor="middle" fontSize={compact ? 7 : 9} fill="#888" fontFamily="system-ui">×</text>
          )
          if (f === 0) return (
            <circle key={s} cx={cx} cy={cy} r={compact ? 2.5 : 3.5} fill="none" stroke="#888" strokeWidth={1}/>
          )
          return null
        })}

        {/* Finger dots */}
        {frets.map((f, s) => {
          if (f <= 0) return null
          const relFret = f - startFret + 1
          if (relFret < 1 || relFret > FRETS_SHOWN) return null
          const cx = marginLeft + s * stringSpacing
          const cy = marginTop + (relFret - 0.5) * fretSpacing
          // Don't draw dot if covered by barre start
          const coveredByBarre = barre && f === barre.fret && s >= barre.from && s <= barre.to
          const isBarreEdge = barre && f === barre.fret && (s === barre.from || s === barre.to)
          if (coveredByBarre && !isBarreEdge) return null
          return (
            <circle key={s} cx={cx} cy={cy} r={dotR} fill="#1a1a2e"/>
          )
        })}
      </g>
    </svg>
  )
}
