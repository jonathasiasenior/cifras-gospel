const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT_MAP = { 'Db':'C#','Eb':'D#','Fb':'E','Gb':'F#','Ab':'G#','Bb':'A#','Cb':'B' }
const TO_FLAT = { 'C#':'Db','D#':'Eb','F#':'Gb','G#':'Ab','A#':'Bb' }
const CHORD_RE = /([A-G][b#]?)((?:maj|min|m|M|aug|dim|sus|add|dom|mmaj)?(?:\d+)?(?:\/[A-G][b#]?)?)/g

function normRoot(r) { return FLAT_MAP[r] || r }

export function transposeRoot(root, st, flat = false) {
  const n = CHROMATIC.indexOf(normRoot(root))
  if (n === -1) return root
  const r = CHROMATIC[((n + st) % 12 + 12) % 12]
  return (flat && TO_FLAT[r]) ? TO_FLAT[r] : r
}

export function transposeKey(key, st) {
  const minor = key.length > 1 && key.slice(-1) === 'm'
  const root = minor ? key.slice(0, -1) : key
  return transposeRoot(root, st, false) + (minor ? 'm' : '')
}

export function transposeLine(line, st, flat = false) {
  if (st === 0) return line
  return line.replace(CHORD_RE, (_, root, qual) => transposeRoot(root, st, flat) + qual)
}

export function transposeCifraText(text, st, flat = false) {
  if (st === 0) return text
  return text.split('\n').map(line => {
    const trimmed = line.trim()
    if (!trimmed) return line
    // detect chord lines (majority tokens are chords)
    const tokens = trimmed.split(/\s+/)
    const chordCount = tokens.filter(t => /^[A-G][b#]?/.test(t)).length
    if (chordCount / tokens.length >= 0.5) {
      return transposeLine(line, st, flat)
    }
    return line
  }).join('\n')
}

const KEY_ORDER = [
  'C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab','A','A#','Bb','B',
  'Cm','C#m','Dbm','Dm','D#m','Ebm','Em','Fm','F#m','Gbm','Gm','G#m','Abm','Am','A#m','Bbm','Bm'
]
export function keyIndex(k) {
  const i = KEY_ORDER.indexOf(k)
  return i >= 0 ? i : 99
}

export function groupByKey(songs) {
  const g = {}
  songs.forEach(s => {
    const k = s.key || '?'
    if (!g[k]) g[k] = []
    g[k].push(s)
  })
  return g
}

const LABEL_MAP = { INTRO:'Intro', RF:'Refrão', 'PRÉ-RF':'Pré-Refrão', PONTE:'Ponte', FN:'Final', MEDLEY:'Medley' }
export function expandLabel(l) {
  if (!l) return ''
  if (LABEL_MAP[l]) return LABEL_MAP[l]
  const m = l.match(/^P(\d+)$/)
  if (m) return 'Verso ' + m[1]
  return l.charAt(0) + l.slice(1).toLowerCase().replace(/-/g, ' ')
}

export function dedupeSections(sections) {
  const seenFP = new Set(), seenLabel = new Set(), out = []
  ;(sections || []).forEach(sec => {
    const fp = (sec.chords || []).join('|')
    const label = (sec.label || '').trim()
    if (fp && seenFP.has(fp)) return
    seenFP.add(fp)
    if (label && seenLabel.has(label)) return
    if (label) seenLabel.add(label)
    out.push(sec)
  })
  return out
}

export function expandSections(sections) {
  const MAX = 4
  const deduped = dedupeSections(sections)
  const out = []
  deduped.forEach(sec => {
    const ch = sec.chords || []
    if (ch.length === 0) return
    const chunks = []
    for (let i = 0; i < ch.length; i += MAX) chunks.push(ch.slice(i, i + MAX))
    chunks.forEach((chunk, ci) => {
      out.push({ label: ci === 0 ? sec.label : '', hint: ci === 0 ? sec.hint : '', chords: chunk })
    })
  })
  return out
}

export function normalizeStr(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
