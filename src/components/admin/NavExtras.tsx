import React from 'react'

/** "View website" link at the bottom of the admin sidebar. */
export const NavExtras = () => (
  <div className="eccsa-nav-extra">
    <a href="/" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
      View website
    </a>
  </div>
)

/** Text above the login form. */
export const LoginIntro = () => (
  <div className="eccsa-login-intro">
    <h2>Welcome to the ECCSA admin</h2>
    <p>Sign in to manage the website of the Ethiopian Chamber of Commerce and Sectoral Associations.</p>
  </div>
)
