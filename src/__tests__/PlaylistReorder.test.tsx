import { beforeEach, describe, expect, it } from 'vitest'

import { usePlayerStore } from '@/store/playerStore'

const tracks = [
  { id: 's1', title: 'One' },
  { id: 's2', title: 'Two' },
  { id: 's3', title: 'Three' },
]

describe('playlist reorder behavior', () => {
  beforeEach(() => {
    localStorage.clear()
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

  it('keeps current track stable by id after reorder', () => {
    const store = usePlayerStore.getState()
    store.setQueue(tracks, 1, true)
    expect(usePlayerStore.getState().currentTrackId).toBe('s2')

    store.reorderQueue(1, 0)
    const nextState = usePlayerStore.getState()
    expect(nextState.currentTrackId).toBe('s2')
    expect(nextState.currentIndex).toBe(0)
    expect(nextState.queue[0]?.track.id).toBe('s2')
  })

  it('moves to nearest track when removing the current item', () => {
    const store = usePlayerStore.getState()
    store.setQueue(tracks, 1, true)
    const currentQueueId = usePlayerStore.getState().queue[1]?.queueId
    if (!currentQueueId) throw new Error('Expected queue id')

    store.removeFromQueue(currentQueueId)
    const nextState = usePlayerStore.getState()
    expect(nextState.currentTrackId).toBeTruthy()
    expect(nextState.queue.some((item) => item.track.id === nextState.currentTrackId)).toBe(true)
  })
})
