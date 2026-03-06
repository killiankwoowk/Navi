import type { Song } from '@/api/types'
import type { ViewportMode } from '@/api/types'

export const getSongCoverArtId = (song?: Song | null): string | undefined => {
  if (!song) return undefined
  return song.coverArt || song.albumId
}

export const getCoverSizeForViewport = (viewportMode: ViewportMode, intent: 'card' | 'hero' | 'player'): 200 | 400 | 600 => {
  if (intent === 'hero') {
    return viewportMode === 'mobile' ? 400 : 600
  }
  if (intent === 'player') {
    if (viewportMode === 'mobile') return 600
    if (viewportMode === 'tablet') return 400
    return 200
  }
  return viewportMode === 'mobile' ? 200 : 400
}
