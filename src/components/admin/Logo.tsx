import React from 'react'

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    
    <img src="/logo.png" alt="ECCSA" width={64} height={64} />
    <div style={{ lineHeight: 1.2 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0A2347', letterSpacing: '.02em' }}>ECCSA</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>Website administration</div>
    </div>
  </div>
)

export const Icon = () => (

  <img src="/logo.png" alt="ECCSA" width={28} height={28} />
)
