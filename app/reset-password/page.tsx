'use client'
import { useSignIn } from '@clerk/nextjs/legacy'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const { signIn, isLoaded, setActive } = useSignIn()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#0D2B20',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#1B4332',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{fontSize:'24px',fontWeight:'500',color:'#fff',marginBottom:'4px'}}>venura<span style={{color:'#E8D5B7'}}>.</span></div>
          <div style={{fontSize:'14px',color:'rgba(255,255,255,0.6)'}}>Choose a new password</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>Reset code</label>
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g, ''))} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box',letterSpacing:'0.2em'}} placeholder="000000"/>
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>New password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} placeholder="••••••••"/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>Confirm new password</label>
            <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} placeholder="••••••••"/>
          </div>
          {error && <div style={{background:'rgba(220,38,38,0.1)',border:'0.5px solid rgba(220,38,38,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#FCA5A5',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'16px',fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
          <a href="/sign-in" style={{color:'#E8D5B7'}}>Back to sign in</a>
        </div>
      </div>
    </div>
  )
}
