import { useState, useEffect } from 'react'

const FLAT_TO_SHARP = { Db:'Cs', Eb:'Ds', Fb:'E', Gb:'Fs', Ab:'Gs', Bb:'As', Cb:'B' }

function keyToFile(key) {
  const root = key.endsWith('m') ? key.slice(0, -1) : key
  return `/audio/pad-${FLAT_TO_SHARP[root] || root}.wav`
}

// ── Global singleton (survives React StrictMode remounts) ──────────────────
const pad = {
  el: null,
  ownerId: null,         // which card is currently playing
  listeners: new Set(),  // callbacks to notify on state change

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
    el.play()
      .then(() => { this.ownerId = id; this.notify() })
      .catch(err => console.warn('Pad play failed:', err))
  },

  stop() {
    const el = this.get()
    el.pause()
    el.currentTime = 0
    this.ownerId = null
    this.notify()
  },

  swapKey(key) {
    const el = this.get()
    el.src = keyToFile(key)
    el.currentTime = 0
    el.play().catch(console.warn)
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

  // Subscribe to global pad state changes
  useEffect(() => {
    const unsub = pad.subscribe(() => {
      setPlaying(pad.ownerId === id)
    })
    return unsub
  }, [id])

  // If this pad is active and key changes → swap audio immediately
  useEffect(() => {
    if (pad.ownerId === id) {
      pad.swapKey(currentKey)
    }
  }, [currentKey, id])

  function toggle() {
    if (pad.ownerId === id) {
      pad.stop()
    } else {
      pad.play(id, currentKey)
    }
  }

  return { playing, toggle }
}
