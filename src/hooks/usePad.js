import { useRef, useState, useEffect } from 'react'

// Map key name → audio file
const FLAT_TO_SHARP = { 'Db':'Cs','Eb':'Ds','Fb':'E','Gb':'Fs','Ab':'Gs','Bb':'As','Cb':'B' }

function keyToFile(key) {
  // Strip minor suffix, normalize flats to sharps
  const root = key.endsWith('m') ? key.slice(0, -1) : key
  const normalized = FLAT_TO_SHARP[root] || root
  return `/audio/pad-${normalized}.wav`
}

export function usePad(currentKey) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const currentKeyRef = useRef(currentKey)

  useEffect(() => {
    currentKeyRef.current = currentKey
    // If playing, switch to new key audio seamlessly
    if (playing && audioRef.current) {
      const newSrc = keyToFile(currentKey)
      if (!audioRef.current.src.endsWith(newSrc)) {
        const currentTime = audioRef.current.currentTime
        audioRef.current.src = newSrc
        audioRef.current.loop = true
        audioRef.current.play().catch(() => {})
      }
    }
  }, [currentKey, playing])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  function toggle() {
    if (playing) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }
      audioRef.current.src = keyToFile(currentKeyRef.current)
      audioRef.current.loop = true
      audioRef.current.volume = 0.7
      audioRef.current.play().catch(() => setPlaying(false))
      setPlaying(true)
    }
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
  }

  return { playing, toggle, stop }
}
