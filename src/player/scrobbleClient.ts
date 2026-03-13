import type { NavidromeClient, Song } from '@/api/types'

import type { ScrobbleClient } from '@/player/PlayerController'

interface NavidromeScrobbleOptions {
  client: NavidromeClient | null
  onScrobble: () => void
}

/**
 * Builds a scrobble client that only reports to Navidrome.
 * Increments the scrobble counter only after successful submissions.
 */
export const createNavidromeScrobbleClient = ({ client, onScrobble }: NavidromeScrobbleOptions): ScrobbleClient => ({
  nowPlaying: async (track: Song) => {
    if (!client) return
    try {
      await client.scrobble(track.id, false)
    } catch {
      // Best effort.
    }
  },
  submit: async (track: Song) => {
    if (!client) return
    try {
      await client.scrobble(track.id, true)
      onScrobble()
    } catch {
      // Best effort.
    }
  },
})
