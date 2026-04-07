import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabase'

export function usePlaylists(userId) {
  const [playlists, setPlaylists] = useState([])

  const load = useCallback(async () => {
    if (!userId) { setPlaylists([]); return }
    const { data } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at')
    setPlaylists(data || [])
  }, [userId])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (name) => {
    if (!name?.trim() || !userId) return
    await supabase.from('playlists').insert({ user_id: userId, name: name.trim(), songs: [] })
    load()
  }, [userId, load])

  const rename = useCallback(async (id, name) => {
    if (!name?.trim()) return
    await supabase.from('playlists').update({ name: name.trim() }).eq('id', id).eq('user_id', userId)
    load()
  }, [userId, load])

  const remove = useCallback(async (id) => {
    await supabase.from('playlists').delete().eq('id', id).eq('user_id', userId)
    load()
  }, [userId, load])

  const toggleSong = useCallback(async (plId, songIdx) => {
    const pl = playlists.find(p => p.id === plId)
    if (!pl) return false
    const songs = pl.songs || []
    const i = songs.indexOf(songIdx)
    const newSongs = i !== -1 ? songs.filter((_, idx) => idx !== i) : [...songs, songIdx]
    await supabase.from('playlists').update({ songs: newSongs }).eq('id', plId).eq('user_id', userId)
    load()
    return i === -1
  }, [playlists, userId, load])

  const moveSong = useCallback(async (plId, pos, dir) => {
    const pl = playlists.find(p => p.id === plId)
    if (!pl) return
    const songs = [...(pl.songs || [])]
    const n = pos + dir
    if (n < 0 || n >= songs.length) return
    const t = songs[pos]; songs[pos] = songs[n]; songs[n] = t
    await supabase.from('playlists').update({ songs }).eq('id', plId).eq('user_id', userId)
    load()
  }, [playlists, userId, load])

  const removeSong = useCallback(async (plId, pos) => {
    const pl = playlists.find(p => p.id === plId)
    if (!pl) return
    const songs = [...(pl.songs || [])]
    songs.splice(pos, 1)
    await supabase.from('playlists').update({ songs }).eq('id', plId).eq('user_id', userId)
    load()
  }, [playlists, userId, load])

  return { playlists, create, rename, remove, toggleSong, moveSong, removeSong }
}
