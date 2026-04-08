import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../supabase'

export const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  useEffect(() => {
    // Failsafe: never stay on loading screen more than 6s
    const failsafe = setTimeout(() => setLoading(false), 6000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(failsafe)
      setUser(session?.user ?? null)
      if (session?.user) {
        try { await fetchProfile(session.user.id) } catch { /* ignore */ }
      }
      setLoading(false)
    }).catch(() => { clearTimeout(failsafe); setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { await fetchProfile(session.user.id) } catch { /* ignore */ }
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

  async function signOut() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const isAdmin = profile?.role === 'admin'
  const isApproved = !!user   // any logged-in user has full access
  const mustChangePassword = profile?.must_change_password === true

  return { user, profile, loading, isAdmin, isApproved, mustChangePassword, signIn, signOut }
}
