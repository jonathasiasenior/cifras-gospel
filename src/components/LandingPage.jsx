import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const WPP = 'https://wa.me/5511971345013?text=' + encodeURIComponent('Olá! Quero ter acesso completo ao CIFREI com +900 músicas.')

export default function LandingPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await signIn(email.trim(), password)
    if (err) setError('E-mail ou senha incorretos.')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#1a1a2e 0%,#0f3460 60%,#16213e 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      {/* Logo */}
      <div style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🎸</div>
        <div style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:-1 }}>CIFREI</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,.5)', marginTop:4 }}>Cifras gospel para adoração</div>
      </div>

      {/* Login card */}
      <div style={{ background:'#fff', borderRadius:24, padding:'32px 28px', width:'100%', maxWidth:380, boxShadow:'0 20px 60px rgba(0,0,0,.4)' }}>
        <div style={{ fontSize:18, fontWeight:800, color:'#1a1a2e', marginBottom:4 }}>Entrar no CIFREI</div>
        <div style={{ fontSize:13, color:'#999', marginBottom:24 }}>Use seu e-mail e senha de acesso</div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #E0DDD6', borderRadius:12, fontSize:14, outline:'none', fontFamily:'inherit', background:'#F8F7F4' }}
              onFocus={e => e.target.style.borderColor='#1a1a2e'}
              onBlur={e => e.target.style.borderColor='#E0DDD6'}
            />
          </div>
          <div style={{ marginBottom:20 }}>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width:'100%', padding:'12px 14px', border:'1.5px solid #E0DDD6', borderRadius:12, fontSize:14, outline:'none', fontFamily:'inherit', background:'#F8F7F4' }}
              onFocus={e => e.target.style.borderColor='#1a1a2e'}
              onBlur={e => e.target.style.borderColor='#E0DDD6'}
            />
          </div>

          {error && (
            <div style={{ background:'#FFE8E8', color:'#c0392b', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16, fontWeight:600 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width:'100%', padding:'14px', background: loading?'#AAA':'#1a1a2e', color:'#fff', border:'none', borderRadius:14, fontSize:15, fontWeight:800, cursor:loading?'not-allowed':'pointer', transition:'background .2s' }}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div style={{ margin:'20px 0', height:1, background:'#F0EEE8' }}/>

        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:12, color:'#BBB', marginBottom:12 }}>Ainda não tem acesso?</div>
          <a href={WPP} target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#25D366', color:'#fff', borderRadius:14, padding:'13px', textDecoration:'none', fontWeight:800, fontSize:14 }}>
            💬 Solicitar acesso pelo WhatsApp
          </a>
        </div>
      </div>

      {/* Features */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 20px', marginTop:32, maxWidth:340 }}>
        {['✅ +970 cifras gospel','✅ Teclado e violão','✅ Playlists','✅ Auto-scroll','✅ Diagramas de acordes','✅ Anotações pessoais'].map(f => (
          <span key={f} style={{ fontSize:12, color:'rgba(255,255,255,.65)', fontWeight:500 }}>{f}</span>
        ))}
      </div>
    </div>
  )
}
