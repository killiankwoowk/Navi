import type { ViewportMode } from '@/api/types'
import { useViewportMode } from '@/hooks/useViewportMode'

type CoverIntent = 'card' | 'hero' | 'player'

const sizeMap: Record<CoverIntent, Record<ViewportMode, 200 | 400 | 600>> = {
  card: {
    mobile: 200,
    tablet: 400,
    desktop: 400,
  },
  hero: {
    mobile: 400,
    tablet: 600,
    desktop: 600,
  },
  player: {
    mobile: 600,
    tablet: 400,
    desktop: 200,
  },
}

export const useResponsiveCoverSize = (intent: CoverIntent): 200 | 400 | 600 => {
  const viewportMode = useViewportMode()
  return sizeMap[intent][viewportMode]
}

