'use client'
import { useSignIn } from '@clerk/nextjs/legacy'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setSent(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#0D2B20',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#1B4332',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{fontSize:'24px',fontWeight:'500',color:'#fff',marginBottom:'4px'}}>venura<span style={{color:'#E8D5B7'}}>.</span></div>
          <div style={{fontSize:'14px',color:'rgba(255,255,255,0.6)'}}>Reset your password</div>
        </div>
        {sent ? (
          <div>
            <div style={{background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',padding:'14px',color:'rgba(255,255,255,0.9)',fontSize:'14px',lineHeight:'1.5',marginBottom:'20px'}}>
              Check your email — we sent a password reset link to {email}
            </div>
            <a href="/reset-password" style={{display:'block',width:'100%',padding:'11px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer',textAlign:'center',textDecoration:'none',boxSizing:'border-box'}}>
              Enter reset code
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'20px'}}>
              <label style={{display:'block',fontSize:'12px',color:'rgba(255,255,255,0.6)',marginBottom:'6px'}}>Email address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={{width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.1)',border:'0.5px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#fff',fontSize:'14px',outline:'none',boxSizing:'border-box'}} placeholder="you@example.com"/>
            </div>
            {error && <div style={{background:'rgba(220,38,38,0.1)',border:'0.5px solid rgba(220,38,38,0.3)',borderRadius:'8px',padding:'10px 14px',color:'#FCA5A5',fontSize:'13px',marginBottom:'16px'}}>{error}</div>}
            <button type="submit" disabled={loading} style={{width:'100%',padding:'11px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}
        <div style={{textAlign:'center',marginTop:'16px',fontSize:'13px',color:'rgba(255,255,255,0.5)'}}>
          <a href="/sign-in" style={{color:'#E8D5B7'}}>Back to sign in</a>
        </div>
      </div>
    </div>
  )
}
