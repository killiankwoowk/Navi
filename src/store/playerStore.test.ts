import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePlayerStore } from '@/store/playerStore'

describe('playerStore sleep timer', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentTrackId: null,
      currentIndex: -1,
      isPlaying: false,
      shuffle: false,
      repeat: 'off',
      volume: 0.8,
      progress: 0,
      duration: 0,
      shuffleOrder: [],
      sleepTimer: { endsAt: null, durationMinutes: null },
    })
  })

  it('stops playback when sleep timer expires', () => {
    vi.useFakeTimers()
    const store = usePlayerStore.getState()

    usePlayerStore.setState({ isPlaying: true })
    store.setSleepTimer(15)

    vi.advanceTimersByTime(15 * 60_000 + 1_000)
    store.checkSleepTimer()

    expect(usePlayerStore.getState().isPlaying).toBe(false)
    expect(usePlayerStore.getState().sleepTimer.endsAt).toBeNull()
    vi.useRealTimers()
  })
})
