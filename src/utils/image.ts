import type { Song } from '@/api/types'

export const getSongCoverArtId = (song?: Song | null): string | undefined => {
  if (!song) return undefined
  return song.coverArt || song.albumId
}
