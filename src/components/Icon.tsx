import React from 'react'
import { SPRITE } from './sprite'

export const IconSprite = () => <div hidden dangerouslySetInnerHTML={{ __html: SPRITE }} />

export const Icon = ({ name, className, size }: { name: string; className?: string; size?: number }) => (
  <svg className={className} width={size} height={size} aria-hidden="true">
    <use href={`#i-${name}`} />
  </svg>
)

export const Rays = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} aria-hidden="true">
    <use href="#rays" />
  </svg>
)
