import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center', maxWidth: 640 }}>
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Page not found · ገጹ አልተገኘም</h1>
        <p className="lead" style={{ margin: '0 auto 28px' }}>The page you are looking for may have been moved or removed.</p>
        <Link className="btn" href="/en">Go to the home page</Link>
      </div>
    </section>
  )
}
