import { useEffect, useState } from 'react'

import type { ViewportMode } from '@/api/types'

const getViewportMode = (): ViewportMode => {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet'
  return 'desktop'
}

export const useViewportMode = (): ViewportMode => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>(() => getViewportMode())

  useEffect(() => {
    const onResize = () => setViewportMode(getViewportMode())
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return viewportMode
}

