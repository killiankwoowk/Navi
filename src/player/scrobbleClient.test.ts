import { describe, expect, it, vi } from 'vitest'

import type { NavidromeClient, Song } from '@/api/types'
import { createNavidromeScrobbleClient } from '@/player/scrobbleClient'

const track: Song = {
  id: 'track-1',
  title: 'Signal',
  artist: 'Navi',
}

describe('createNavidromeScrobbleClient', () => {
  it('increments on successful scrobble submission', async () => {
    const scrobble = vi.fn().mockResolvedValue(undefined)
    const client = { scrobble } as unknown as NavidromeClient
    const increment = vi.fn()

    const scrobbleClient = createNavidromeScrobbleClient({ client, onScrobble: increment })
    await scrobbleClient.submit(track, Date.now())

    expect(scrobble).toHaveBeenCalledWith('track-1', true)
    expect(increment).toHaveBeenCalledTimes(1)
  })

  it('does not increment when scrobble fails', async () => {
    const scrobble = vi.fn().mockRejectedValue(new Error('fail'))
    const client = { scrobble } as unknown as NavidromeClient
    const increment = vi.fn()

    const scrobbleClient = createNavidromeScrobbleClient({ client, onScrobble: increment })
    await scrobbleClient.submit(track, Date.now())

    expect(increment).not.toHaveBeenCalled()
  })
})
