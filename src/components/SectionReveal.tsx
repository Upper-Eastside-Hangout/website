'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { createElement, useEffect, useState, type ReactNode } from 'react'

type Tag = 'div' | 'section' | 'header' | 'footer' | 'article'

type Props = {
  children: ReactNode
  delay?: number
  className?: string
  as?: Tag
}

/**
 * Fade + slide-up on scroll-into-view.
 *
 * Hydration-safe pattern: SSR and the first client render both emit a plain
 * element at the final visual state. After mount we swap in the framer-motion
 * component (unless the user prefers reduced motion). Below-fold sections then
 * animate normally as the user scrolls; above-fold sections skip the animation
 * on first paint, which avoids the disappear-then-fade-in flash that a naive
 * implementation would produce.
 */
export default function SectionReveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: Props) {
  const [mounted, setMounted] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || prefersReduced) {
    return createElement(as, { className }, children)
  }

  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      {children}
    </MotionTag>
  )
}
