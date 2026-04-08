import { useState, useEffect } from 'react'

const FLAT_MAP  = { Db:'Cs', Eb:'Ds', Fb:'E',  Gb:'Fs', Ab:'Gs', Bb:'As', Cb:'B'  }
const SHARP_MAP = { 'C#':'Cs','D#':'Ds','F#':'Fs','G#':'Gs','A#':'As' }
const AVAILABLE = new Set(['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'])

function getFileKey(key) {
  const root = key.endsWith('m') ? key.slice(0, -1) : key
  return FLAT_MAP[root] || SHARP_MAP[root] || root
}

function keyToFile(key) {
  return `/audio/pad-${getFileKey(key)}.wav`
}

// ── Global singleton ──────────────────────────────────────────────────────────
const pad = {
  el: null,
  ownerId: null,
  listeners: new Set(),

  get() {
    if (!this.el) {
      this.el = new Audio()
      this.el.loop = true
      this.el.volume = 0.75
    }
    return this.el
  },

  play(id, key) {
    const el = this.get()
    el.pause()
    el.src = keyToFile(key)
    el.currentTime = 0
    el.load()
    const tryPlay = () => {
      el.play()
        .then(() => { this.ownerId = id; this.notify() })
        .catch(err => console.warn('Pad play failed:', err))
    }
    el.addEventListener('canplay', tryPlay, { once: true })
  },

  stop() {
    const el = this.get()
    el.pause()
    el.currentTime = 0
    this.ownerId = null
    this.notify()
  },

  notify() {
    this.listeners.forEach(fn => fn())
  },

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
}
// ─────────────────────────────────────────────────────────────────────────────

let nextId = 0

export function usePad(currentKey) {
  const [id] = useState(() => ++nextId)
  const [playing, setPlaying] = useState(false)

  const fileKey = getFileKey(currentKey)
  const padAvailable = AVAILABLE.has(fileKey)

  // Subscribe to global pad state changes
  useEffect(() => {
    const unsub = pad.subscribe(() => {
      setPlaying(pad.ownerId === id)
    })
    return unsub
  }, [id])

  // Stop PAD when key changes (don't auto-swap — user must restart manually)
  useEffect(() => {
    if (pad.ownerId === id) {
      pad.stop()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey])

  // Stop PAD when component unmounts (song closed / navigation)
  useEffect(() => {
    return () => {
      if (pad.ownerId === id) pad.stop()
    }
  }, [id])

  function toggle() {
    if (pad.ownerId === id) {
      pad.stop()
    } else {
      pad.play(id, currentKey)
    }
  }

  return { playing, toggle, padAvailable }
}
