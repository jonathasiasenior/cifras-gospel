// Chord library: guitar voicings (6 strings: E A D G B e, low→high)
// frets: -1=muted, 0=open, 1-12=fret number
// barre: { fret, from (string index 0=low E), to }

export const guitarChords = {
  'C':    { frets:[-1,3,2,0,1,0], fingers:[0,3,2,0,1,0] },
  'C#':   { frets:[-1,4,3,1,2,1], fingers:[0,4,3,1,2,1], barre:{fret:1,from:2,to:5} },
  'Db':   { frets:[-1,4,3,1,2,1], fingers:[0,4,3,1,2,1], barre:{fret:1,from:2,to:5} },
  'D':    { frets:[-1,-1,0,2,3,2], fingers:[0,0,0,1,3,2] },
  'D#':   { frets:[-1,-1,1,3,4,3], fingers:[0,0,1,2,3,4] },
  'Eb':   { frets:[-1,-1,1,3,4,3], fingers:[0,0,1,2,3,4] },
  'E':    { frets:[0,2,2,1,0,0], fingers:[0,2,3,1,0,0] },
  'F':    { frets:[1,3,3,2,1,1], fingers:[1,3,4,2,1,1], barre:{fret:1,from:0,to:5} },
  'F#':   { frets:[2,4,4,3,2,2], fingers:[1,3,4,2,1,1], barre:{fret:2,from:0,to:5} },
  'Gb':   { frets:[2,4,4,3,2,2], fingers:[1,3,4,2,1,1], barre:{fret:2,from:0,to:5} },
  'G':    { frets:[3,2,0,0,0,3], fingers:[2,1,0,0,0,4] },
  'G#':   { frets:[4,6,6,5,4,4], fingers:[1,3,4,2,1,1], barre:{fret:4,from:0,to:5} },
  'Ab':   { frets:[4,6,6,5,4,4], fingers:[1,3,4,2,1,1], barre:{fret:4,from:0,to:5} },
  'A':    { frets:[-1,0,2,2,2,0], fingers:[0,0,2,3,4,0] },
  'A#':   { frets:[-1,1,3,3,3,1], fingers:[0,1,2,3,4,1], barre:{fret:1,from:1,to:5} },
  'Bb':   { frets:[-1,1,3,3,3,1], fingers:[0,1,2,3,4,1], barre:{fret:1,from:1,to:5} },
  'B':    { frets:[-1,2,4,4,4,2], fingers:[0,1,2,3,4,1], barre:{fret:2,from:1,to:5} },
  // Minors
  'Cm':   { frets:[-1,3,5,5,4,3], fingers:[0,1,3,4,2,1], barre:{fret:3,from:1,to:5} },
  'C#m':  { frets:[-1,4,6,6,5,4], fingers:[0,1,3,4,2,1], barre:{fret:4,from:1,to:5} },
  'Dbm':  { frets:[-1,4,6,6,5,4], fingers:[0,1,3,4,2,1], barre:{fret:4,from:1,to:5} },
  'Dm':   { frets:[-1,-1,0,2,3,1], fingers:[0,0,0,2,3,1] },
  'D#m':  { frets:[-1,-1,1,3,4,2], fingers:[0,0,1,3,4,2] },
  'Ebm':  { frets:[-1,-1,1,3,4,2], fingers:[0,0,1,3,4,2] },
  'Em':   { frets:[0,2,2,0,0,0], fingers:[0,2,3,0,0,0] },
  'Fm':   { frets:[1,3,3,1,1,1], fingers:[1,3,4,1,1,1], barre:{fret:1,from:0,to:5} },
  'F#m':  { frets:[2,4,4,2,2,2], fingers:[1,3,4,1,1,1], barre:{fret:2,from:0,to:5} },
  'Gbm':  { frets:[2,4,4,2,2,2], fingers:[1,3,4,1,1,1], barre:{fret:2,from:0,to:5} },
  'Gm':   { frets:[3,5,5,3,3,3], fingers:[1,3,4,1,1,1], barre:{fret:3,from:0,to:5} },
  'G#m':  { frets:[4,6,6,4,4,4], fingers:[1,3,4,1,1,1], barre:{fret:4,from:0,to:5} },
  'Abm':  { frets:[4,6,6,4,4,4], fingers:[1,3,4,1,1,1], barre:{fret:4,from:0,to:5} },
  'Am':   { frets:[-1,0,2,2,1,0], fingers:[0,0,2,3,1,0] },
  'A#m':  { frets:[-1,1,3,3,2,1], fingers:[0,1,3,4,2,1], barre:{fret:1,from:1,to:5} },
  'Bbm':  { frets:[-1,1,3,3,2,1], fingers:[0,1,3,4,2,1], barre:{fret:1,from:1,to:5} },
  'Bm':   { frets:[-1,2,4,4,3,2], fingers:[0,1,3,4,2,1], barre:{fret:2,from:1,to:5} },
  // Dominant 7ths
  'C7':   { frets:[-1,3,2,3,1,0], fingers:[0,3,2,4,1,0] },
  'D7':   { frets:[-1,-1,0,2,1,2], fingers:[0,0,0,2,1,3] },
  'E7':   { frets:[0,2,0,1,0,0], fingers:[0,2,0,1,0,0] },
  'F7':   { frets:[1,3,1,2,1,1], fingers:[1,3,1,2,1,1], barre:{fret:1,from:0,to:5} },
  'G7':   { frets:[3,2,0,0,0,1], fingers:[3,2,0,0,0,1] },
  'A7':   { frets:[-1,0,2,0,2,0], fingers:[0,0,2,0,3,0] },
  'B7':   { frets:[-1,2,1,2,0,2], fingers:[0,2,1,3,0,4] },
  'C#7':  { frets:[-1,4,3,4,2,4], fingers:[0,3,2,4,1,1], barre:{fret:2,from:2,to:5} },
  'Bb7':  { frets:[-1,1,3,1,3,1], fingers:[0,1,3,1,4,1], barre:{fret:1,from:1,to:5} },
  // Minor 7ths
  'Am7':  { frets:[-1,0,2,0,1,0], fingers:[0,0,2,0,1,0] },
  'Em7':  { frets:[0,2,0,0,0,0], fingers:[0,2,0,0,0,0] },
  'Dm7':  { frets:[-1,-1,0,2,1,1], fingers:[0,0,0,3,1,2] },
  'Bm7':  { frets:[-1,2,4,2,3,2], fingers:[0,1,3,1,2,1], barre:{fret:2,from:1,to:5} },
  'F#m7': { frets:[2,4,2,2,2,2], fingers:[1,4,1,1,1,1], barre:{fret:2,from:0,to:5} },
  'C#m7': { frets:[-1,4,6,4,5,4], fingers:[0,1,3,1,2,1], barre:{fret:4,from:1,to:5} },
  'Gm7':  { frets:[3,5,3,3,3,3], fingers:[1,3,1,1,1,1], barre:{fret:3,from:0,to:5} },
  'Cm7':  { frets:[-1,3,5,3,4,3], fingers:[0,1,3,1,2,1], barre:{fret:3,from:1,to:5} },
  'Fm7':  { frets:[1,3,1,1,1,1], fingers:[1,3,1,1,1,1], barre:{fret:1,from:0,to:5} },
  // Major 7ths
  'Cmaj7':{ frets:[-1,3,2,0,0,0], fingers:[0,3,2,0,0,0] },
  'Dmaj7':{ frets:[-1,-1,0,2,2,2], fingers:[0,0,0,1,2,3] },
  'Emaj7':{ frets:[0,2,1,1,0,0], fingers:[0,3,1,2,0,0] },
  'Fmaj7':{ frets:[-1,-1,3,2,1,0], fingers:[0,0,4,3,2,1] },
  'Gmaj7':{ frets:[3,2,0,0,0,2], fingers:[3,2,0,0,0,1] },
  'Amaj7':{ frets:[-1,0,2,1,2,0], fingers:[0,0,3,1,4,0] },
  'Bmaj7':{ frets:[-1,2,4,3,4,2], fingers:[0,1,3,2,4,1], barre:{fret:2,from:1,to:5} },
  'F#maj7':{ frets:[2,4,3,3,2,2], fingers:[1,3,2,3,1,1], barre:{fret:2,from:0,to:5} },
  // Sus chords
  'Csus4':{ frets:[-1,3,3,0,1,1], fingers:[0,3,4,0,1,2] },
  'Dsus4':{ frets:[-1,-1,0,2,3,3], fingers:[0,0,0,1,2,3] },
  'Esus4':{ frets:[0,2,2,2,0,0], fingers:[0,1,2,3,0,0] },
  'Gsus4':{ frets:[3,3,0,0,1,3], fingers:[2,3,0,0,1,4] },
  'Asus4':{ frets:[-1,0,2,2,3,0], fingers:[0,0,1,2,4,0] },
  'Bsus4':{ frets:[-1,2,4,4,5,2], fingers:[0,1,2,3,4,1], barre:{fret:2,from:1,to:5} },
  'Fsus4':{ frets:[1,3,3,3,1,1], fingers:[1,2,3,4,1,1], barre:{fret:1,from:0,to:5} },
  // Add9
  'Cadd9':{ frets:[-1,3,2,0,3,0], fingers:[0,3,2,0,4,0] },
  'Dadd9':{ frets:[-1,-1,0,2,3,0], fingers:[0,0,0,1,3,0] },
  'Gadd9':{ frets:[3,2,0,2,0,3], fingers:[3,2,0,1,0,4] },
  'Aadd9':{ frets:[-1,0,2,4,2,0], fingers:[0,0,1,4,2,0] },
  'Eadd9':{ frets:[0,2,2,1,0,2], fingers:[0,2,3,1,0,4] },
  // Diminished
  'Bdim':  { frets:[-1,2,3,1,3,-1], fingers:[0,1,2,0,3,0] },
  'Fdim':  { frets:[-1,-1,3,1,0,1], fingers:[0,0,3,1,0,2] },
  'Cdim':  { frets:[-1,3,4,2,4,-1], fingers:[0,2,3,1,4,0] },
  'Adim':  { frets:[-1,0,1,2,1,-1], fingers:[0,0,1,3,2,0] },
  'Ddim':  { frets:[-1,-1,0,1,0,1], fingers:[0,0,0,2,0,1] },
  'Edim':  { frets:[0,1,2,0,2,-1], fingers:[0,1,2,0,3,0] },
  'G#dim':{ frets:[4,5,6,4,6,-1], fingers:[1,2,3,1,4,0] },
  // Slash chords
  'G/B':  { frets:[-1,2,0,0,0,3], fingers:[0,1,0,0,0,2] },
  'D/F#': { frets:[2,-1,0,2,3,2], fingers:[1,0,0,2,4,3] },
  'A/C#': { frets:[-1,4,2,2,2,0], fingers:[0,4,1,2,3,0] },
  'E/G#': { frets:[4,-1,2,1,0,0], fingers:[4,0,2,1,0,0] },
  'C/E':  { frets:[0,3,2,0,1,0], fingers:[0,3,2,0,1,0] },
  'F/A':  { frets:[-1,0,3,2,1,1], fingers:[0,0,4,3,1,2] },
  'G/F#': { frets:[2,2,0,0,0,3], fingers:[2,1,0,0,0,3] },
  'Am/E': { frets:[0,0,2,2,1,0], fingers:[0,0,2,3,1,0] },
  'Bm/F#':{ frets:[2,2,4,4,3,2], fingers:[1,1,3,4,2,1], barre:{fret:2,from:0,to:5} },
  'D/A':  { frets:[-1,0,0,2,3,2], fingers:[0,0,0,1,3,2] },
  'A5':   { frets:[-1,0,2,2,-1,-1], fingers:[0,0,1,2,0,0] },
  'D5':   { frets:[-1,-1,0,2,3,-1], fingers:[0,0,0,1,3,0] },
  'E5':   { frets:[0,2,2,-1,-1,-1], fingers:[0,1,2,0,0,0] },
  'G5':   { frets:[3,5,5,-1,-1,-1], fingers:[1,2,3,0,0,0] },
  'A9':   { frets:[-1,0,2,4,2,0], fingers:[0,0,1,4,2,0] },
  'D9':   { frets:[-1,5,4,5,3,-1], fingers:[0,2,1,3,1,0] },
  'G9':   { frets:[3,2,0,2,0,1], fingers:[3,2,0,1,0,1] },
  'E9':   { frets:[0,2,0,1,0,2], fingers:[0,2,0,1,0,3] },
  'A9/C#':{ frets:[-1,4,2,4,2,0], fingers:[0,3,1,4,2,0] },
  'F#5':  { frets:[2,4,4,-1,-1,-1], fingers:[1,2,3,0,0,0] },
  'G#5':  { frets:[4,6,6,-1,-1,-1], fingers:[1,2,3,0,0,0] },
}

// Ukulele chords (GCEA tuning: G4 C4 E4 A4)
export const ukuleleChords = {
  'C':    { frets:[0,0,0,3] },
  'D':    { frets:[2,2,2,0] },
  'E':    { frets:[4,4,4,2] },
  'F':    { frets:[2,0,1,0] },
  'G':    { frets:[0,2,3,2] },
  'A':    { frets:[2,1,0,0] },
  'B':    { frets:[4,3,2,2] },
  'Am':   { frets:[2,0,0,0] },
  'Em':   { frets:[0,4,3,2] },
  'Dm':   { frets:[2,2,1,0] },
  'Bm':   { frets:[4,2,2,2] },
  'Fm':   { frets:[1,0,1,3] },
  'Gm':   { frets:[0,2,3,1] },
  'Cm':   { frets:[0,3,3,3] },
  'F#m':  { frets:[2,1,2,0] },
  'C#m':  { frets:[1,4,4,4], barre:{fret:1,from:0,to:3} },
  'G7':   { frets:[0,2,1,2] },
  'C7':   { frets:[0,0,0,1] },
  'D7':   { frets:[2,2,2,3] },
  'A7':   { frets:[0,1,0,0] },
  'E7':   { frets:[1,2,0,2] },
  'F7':   { frets:[2,3,1,0] },
  'B7':   { frets:[2,3,2,2] },
  'Am7':  { frets:[0,0,0,0] },
  'Em7':  { frets:[0,2,0,2] },
  'Dm7':  { frets:[2,2,1,3] },
  'Cmaj7':{ frets:[0,0,0,2] },
  'Gmaj7':{ frets:[0,2,2,2] },
  'Amaj7':{ frets:[1,1,0,0] },
  'Fmaj7':{ frets:[2,4,1,0] },
  'Bm7':  { frets:[2,2,2,2], barre:{fret:2,from:0,to:3} },
  'F#m7': { frets:[2,4,2,4] },
  'Dsus4':{ frets:[2,2,3,0] },
  'Gsus4':{ frets:[0,2,3,3] },
  'Asus4':{ frets:[2,2,0,0] },
  'Esus4':{ frets:[2,4,4,2], barre:{fret:2,from:0,to:3} },
  'Cadd9':{ frets:[0,2,0,3] },
  'Gadd9':{ frets:[0,2,0,2] },
  'G/B':  { frets:[0,2,3,2] },
  'D/F#': { frets:[2,2,2,0] },
  'A/C#': { frets:[1,1,0,0] },
}

// Cavaco chords (DGBD tuning: D G B D)
export const cavacoChords = {
  'G':    { frets:[0,0,0,0] },      // D G B D = G major
  'D':    { frets:[0,2,3,0] },      // D A D D → play D A D
  'A':    { frets:[-1,2,2,2] },     // A C# E
  'E':    { frets:[2,1,0,2] },      // E G# B E
  'C':    { frets:[5,5,5,5], barre:{fret:5,from:0,to:3} },  // C E G C
  'F':    { frets:[3,5,6,3] },      // F C F A (approx)
  'B':    { frets:[9,9,9,9], barre:{fret:9,from:0,to:3} },
  'Am':   { frets:[0,2,1,0] },      // E A C E → Am
  'Em':   { frets:[2,0,0,2] },      // E G B E
  'Dm':   { frets:[0,3,3,1] },      // D A D F
  'Bm':   { frets:[7,7,7,7], barre:{fret:7,from:0,to:3} },
  'Gm':   { frets:[0,0,3,0] },
  'Cm':   { frets:[5,5,4,5], barre:{fret:4,from:0,to:3} },
  'F#m':  { frets:[4,4,4,4], barre:{fret:4,from:0,to:3} },
  'G7':   { frets:[0,0,0,1] },
  'D7':   { frets:[0,2,1,0] },
  'A7':   { frets:[-1,2,2,0] },
  'E7':   { frets:[2,1,0,0] },
  'C7':   { frets:[5,5,4,5], barre:{fret:5,from:0,to:3} },
  'Am7':  { frets:[0,2,1,3] },
  'Em7':  { frets:[2,0,3,2] },
  'Dm7':  { frets:[0,3,1,1] },
  'Cmaj7':{ frets:[4,5,5,5], barre:{fret:4,from:0,to:3} },
  'Gmaj7':{ frets:[0,0,0,2] },
  'Dsus4':{ frets:[0,2,0,0] },
  'Gsus4':{ frets:[0,0,1,0] },
  'Asus4':{ frets:[-1,2,3,2] },
}

// Viola caipira (simplified — 5 courses as 5 strings: G D A E B low→high approx)
export const violaChords = {
  'G':    { frets:[0,0,0,0,0] },
  'D':    { frets:[0,0,0,2,3] },
  'A':    { frets:[0,0,2,2,2] },
  'E':    { frets:[0,2,2,1,0] },
  'Am':   { frets:[0,0,2,2,1] },
  'Em':   { frets:[0,0,2,0,0] },
  'Dm':   { frets:[0,0,0,2,3] },
  'C':    { frets:[3,2,0,0,0] },
  'F':    { frets:[3,3,2,1,1] },
  'Bm':   { frets:[2,2,4,4,3] },
  'G7':   { frets:[0,0,0,0,1] },
  'D7':   { frets:[0,0,0,2,1] },
  'A7':   { frets:[0,0,2,0,2] },
  'E7':   { frets:[0,2,0,1,0] },
}

// NOTE INTERVALS for keyboard display
const ROOTS = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 }

export function getChordNotes(chordName) {
  if (!chordName) return []
  // Handle slash chords
  const base = chordName.split('/')[0].trim()
  const rootM = base.match(/^([A-G][#b]?)/)
  if (!rootM) return []
  const root = rootM[1]
  const rootNote = ROOTS[root]
  if (rootNote === undefined) return []
  const quality = base.slice(root.length)

  let intervals = [0, 4, 7] // major default

  if (/^m(?!aj|a)/.test(quality)) {
    // minor base
    if (/maj7/.test(quality))       intervals = [0,3,7,11]
    else if (/7/.test(quality))     intervals = [0,3,7,10]
    else if (/6/.test(quality))     intervals = [0,3,7,9]
    else if (/9/.test(quality))     intervals = [0,3,7,10,14]
    else                            intervals = [0,3,7]
  } else if (/dim/.test(quality)) {
    if (/7/.test(quality))          intervals = [0,3,6,9]
    else                            intervals = [0,3,6]
  } else if (/aug/.test(quality)) { intervals = [0,4,8]
  } else if (/maj7/.test(quality)){ intervals = [0,4,7,11]
  } else if (/sus4/.test(quality)){ intervals = [0,5,7]
  } else if (/sus2/.test(quality)){ intervals = [0,2,7]
  } else if (/add9/.test(quality)){ intervals = [0,4,7,14]
  } else if (/6/.test(quality))  { intervals = [0,4,7,9]
  } else if (/9/.test(quality))  { intervals = [0,4,7,10,14]
  } else if (/7/.test(quality))  { intervals = [0,4,7,10]
  }

  return [...new Set(intervals.map(i => (rootNote + i) % 12))]
}

export function getChordVoicing(chord, instrument) {
  const base = chord.split('/')[0].trim()
  // Try exact match, then base chord
  if (instrument === 'guitar') return guitarChords[chord] || guitarChords[base] || null
  if (instrument === 'ukulele') return ukuleleChords[chord] || ukuleleChords[base] || null
  if (instrument === 'cavaco') return cavacoChords[chord] || cavacoChords[base] || null
  if (instrument === 'viola') return violaChords[chord] || violaChords[base] || null
  return null
}

// Extract unique chords from cifra text
export function extractChords(cifraText) {
  if (!cifraText) return []
  const CHORD_RE = /\b([A-G][#b]?(?:maj|min|m|M|aug|dim|sus|add|dom)?(?:\d+)?(?:\/[A-G][#b]?)?)\b/g
  const chords = new Set()
  for (const line of cifraText.split('\n')) {
    const tokens = line.trim().split(/\s+/)
    const matches = tokens.filter(t => /^[A-G][#b]?/.test(t)).length
    if (matches / Math.max(tokens.length, 1) >= 0.4) {
      const found = line.matchAll(CHORD_RE)
      for (const m of found) chords.add(m[1])
    }
  }
  return [...chords]
}
