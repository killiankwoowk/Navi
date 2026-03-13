import { describe, expect, it, vi } from 'vitest'

import type { Song } from '@/api/types'
import { createScrobbleController } from '@/player/PlayerController'

describe('createScrobbleController', () => {
  const track: Song = {
    id: 'track-1',
    title: 'Signal',
    artist: 'Navi',
    duration: 200,
  }

  it('fires now playing once and submits at min(50%, 4 minutes)', () => {
    const nowPlaying = vi.fn()
    const submit = vi.fn()
    const controller = createScrobbleController({ nowPlaying, submit })

    controller.setTrack(track)
    controller.onPlay()
    controller.onPlay()
    expect(nowPlaying).toHaveBeenCalledTimes(1)

    controller.onProgress(90, 200)
    expect(submit).toHaveBeenCalledTimes(0)

    controller.onProgress(100, 200)
    expect(submit).toHaveBeenCalledTimes(1)
  })

  it('submits at 4 minutes for long tracks', () => {
    const submit = vi.fn()
    const controller = createScrobbleController({ nowPlaying: vi.fn(), submit })
    controller.setTrack({ ...track, id: 'track-long', duration: 600 })

    controller.onProgress(200, 600)
    expect(submit).toHaveBeenCalledTimes(0)

    controller.onProgress(240, 600)
    expect(submit).toHaveBeenCalledTimes(1)
  })

  it('submits on ended when not yet submitted', () => {
    const submit = vi.fn()
    const controller = createScrobbleController({ nowPlaying: vi.fn(), submit })
    controller.setTrack(track)
    controller.onEnded()
    expect(submit).toHaveBeenCalledTimes(1)
  })
})
