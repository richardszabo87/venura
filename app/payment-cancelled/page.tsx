'use client'
import { useRouter } from 'next/navigation'

export default function PaymentCancelledPage() {
  const router = useRouter()

  return (
    <div style={{minHeight:'100vh',background:'#0D2B20',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{background:'#1B4332',borderRadius:'16px',padding:'40px 32px',width:'100%',maxWidth:'480px',textAlign:'center'}}>
        <div style={{width:'64px',height:'64px',background:'rgba(232,213,183,0.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px'}}>↩</div>
        <div style={{fontSize:'24px',fontWeight:'500',color:'#fff',marginBottom:'8px'}}>Checkout cancelled</div>
        <div style={{fontSize:'14px',color:'rgba(255,255,255,0.65)',lineHeight:'1.6',marginBottom:'24px'}}>
          No worries — your plan hasn&apos;t changed. You can upgrade anytime when you&apos;re ready.
        </div>
        <button
          onClick={() => router.push('/pricing')}
          style={{width:'100%',padding:'12px',background:'#E8D5B7',color:'#1B4332',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'500',cursor:'pointer'}}
        >
          Back to pricing →
        </button>
      </div>
    </div>
  )
}
