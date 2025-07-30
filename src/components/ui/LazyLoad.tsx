'use client';

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLazyLoad } from '@/hooks/useLazyLoad'

interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  fallback?: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideIn' | 'zoomIn'
  delay?: number
  once?: boolean
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  fallback = <div className="h-32 bg-gray-200 animate-pulse rounded" />,
  animation = 'fadeIn',
  delay = 0,
  once = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, isVisible, hasLoaded } = useLazyLoad({ threshold, rootMargin, once })

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, delay])

  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5 }
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <div ref={ref} className={className}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="fallback"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoaded && (
        <motion.div
          key="content"
          initial={animations[animation].initial}
          animate={animations[animation].animate}
          transition={animations[animation].transition}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

export default LazyLoad 