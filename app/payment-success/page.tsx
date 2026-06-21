'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
export default function PaymentSuccessPage() {
  const router = useRouter()
  const { user } = useUser()
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [router])
  return (
    <div style={{minHeight:'100vh',background:'#0D2B20',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#1B4332',borderRadius:'16px',padding:'40px 32px',width:'100%',maxWidth:'480px',textAlign:'center'}}>
        <div style={{width:'64px',height:'64px',background:'rgba(232,213,183,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px'}}>✓</div>
        <div style={{fontSize:'24px',fontWeight:'500',color:'#fff',marginBottom:'8px'}}>You're now an Investor!</div>
        <div style={{fontSize:'14px',color:'rgba(255,255,255,0.65)',lineHeight:'1.6',marginBottom:'24px'}}>
          Welcome to Venura Investor. Your plan is now active — unlimited analyses, PDF reports, HOA Health, Deal Score, and up to 10 deal alerts are all unlocked.
        </div>
        <div style={{background:'rgba(255,255,255,0.08)',borderRadius:'12px',padding:'16px',marginBottom:'24px'}}>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,0.5)',marginBottom:'12px'}}>What's now unlocked:</div>
          {['Unlimited property analyses','PDF report downloads','Full Deal Score on every analysis','HOA Health Report','Up to 10 active deal alerts','Unlimited VenuraAI messages'].map(feature => (
            <div key={feature} style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 0',borderBottom:'0.5px solid rgba(255,255,255,0.08)',fontSize:'13px',color:'#fff',textAlign:'left'}}>
              <span style={{color:'#E8D5B7'}}>✓</span>{feature}
            </div>
          ))}
        </div>
        <button 
          onClick={() => router.push('/dashboard')}
          style={{width:'100%',padding:'12px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer',marginBottom:'10px'}}
        >
          Go to my dashboard →
        </button>
        <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)'}}>Redirecting automatically in {countdown} seconds</div>
      </div>
    </div>
  )
}
