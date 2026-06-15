'use client'
import { useSignIn } from '@clerk/nextjs/legacy'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function SignInPage() {
  const { signIn, isLoaded, setActive } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <style>{`
        .cl-socialButtonsBlockButton,
        .cl-socialButtonsRoot,
        .cl-dividerRow,
        .cl-dividerText,
        .cl-dividerLine,
        [data-provider="google"],
        .cl-internal-b3fm6y {
          display: none !important;
        }
      `}</style>
    <div style={{minHeight:'100vh',background:'#0D2B20',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#1B4332',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{fontSize:'24px',fontWeight:'500',color:'#fff',marginBottom:'4px'}}>venura<span style={{color:'#E8D5B7'}}>.</span></div>
          <div style={{fontSize:'14px',color:'rgba(255,255,255,0.6)'}}>Sign in to your account</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} placeholder="you@example.com"/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} placeholder="••••••••"/>
          </div>
          {error && <div style={{background:'rgba(220,38,38,0.1)',border:'0.5px solid rgba(220,38,38,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#FCA5A5',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'16px',fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
          Don't have an account? <a href="/sign-up" style={{color:'#E8D5B7'}}>Sign up</a>
        </div>
      </div>
    </div>
    </div>
  )
}
