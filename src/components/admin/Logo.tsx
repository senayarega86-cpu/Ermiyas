import React from 'react'

export const Logo = () => (
  <div className="eccsa-logo">
    <img src="/logo.png" alt="ECCSA" width={84} height={84} />
    <div>
      <strong>ECCSA</strong>
      <span>Ethiopian Chamber of Commerce &amp; Sectoral Associations</span>
    </div>
  </div>
)

export const Icon = () => <img src="/logo.png" alt="ECCSA" width={30} height={30} style={{ display: 'block' }} />
