import type { Song } from '@/api/types'

export interface ScrobbleClient {
  nowPlaying: (track: Song) => void | Promise<void>
  submit: (track: Song, startedAt: number) => void | Promise<void>
}

export interface ScrobbleController {
  setClient: (client: ScrobbleClient) => void
  setTrack: (track: Song | null) => void
  onPlay: () => void
  onProgress: (progress: number, duration: number) => void
  onEnded: () => void
}

export const createScrobbleController = (initialClient: ScrobbleClient): ScrobbleController => {
  let client = initialClient
  let currentTrack: Song | null = null
  let startedAt = 0
  let nowPlayingSent = false
  let submitted = false

  const resetForTrack = (track: Song | null) => {
    currentTrack = track
    startedAt = track ? Date.now() : 0
    nowPlayingSent = false
    submitted = false
  }

  const submitIfNeeded = () => {
    if (!currentTrack || submitted) return
    submitted = true
    void client.submit(currentTrack, startedAt)
  }

  return {
    setClient: (nextClient) => {
      client = nextClient
    },
    setTrack: (track) => {
      if (track?.id === currentTrack?.id) return
      resetForTrack(track)
    },
    onPlay: () => {
      if (!currentTrack || nowPlayingSent) return
      nowPlayingSent = true
      void client.nowPlaying(currentTrack)
    },
    onProgress: (progress, duration) => {
      if (!currentTrack || submitted || !duration) return
      if (progress >= duration * 0.5) {
        submitIfNeeded()
      }
    },
    onEnded: () => {
      submitIfNeeded()
    },
  }
}
