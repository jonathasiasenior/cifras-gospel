import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Uses direct fetch to avoid Supabase client network hangs
  async function fetchProfile(userId, accessToken) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': SUPABASE_ANON,
            'Accept': 'application/json'
          }
        }
      )
      if (res.ok) {
        const data = await res.json()
        if (data?.[0]) setProfile(data[0])
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const failsafe = setTimeout(() => setLoading(false), 6000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(failsafe)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id, session.access_token)
      }
      setLoading(false)
    }).catch(() => { clearTimeout(failsafe); setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id, session.access_token)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }

  function signOut() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('sb-'))
      .forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  const isAdmin = profile?.role === 'admin'
  const isApproved = !!user
  const mustChangePassword = profile?.must_change_password === true

  return { user, profile, loading, isAdmin, isApproved, mustChangePassword, signIn, signOut }
}
