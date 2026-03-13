import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { QueueDock } from '@/components/player/QueueDock'
import { usePlayerStore } from '@/store/playerStore'

const createPlaylist = vi.fn()

vi.mock('@/features/auth/useAuth', () => ({
  getNavidromeClientOrNull: () => ({
    createPlaylist,
  }),
}))

describe('Queue management actions', () => {
  beforeEach(() => {
    createPlaylist.mockReset()
    usePlayerStore.setState({
      queue: [
        { queueId: 'q1', track: { id: '1', title: 'One', artist: 'A' } },
        { queueId: 'q2', track: { id: '2', title: 'Two', artist: 'B' } },
      ],
      currentTrackId: '1',
      currentIndex: 0,
      isPlaying: true,
      shuffle: false,
      repeat: 'off',
      volume: 0.8,
      progress: 0,
      duration: 0,
      shuffleOrder: [],
      sleepTimer: { endsAt: null, durationMinutes: null },
    })
  })

  it('saves queue as playlist', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'prompt').mockReturnValue('My Queue')

    render(<QueueDock />)
    await user.click(screen.getByRole('button', { name: 'Save queue as playlist' }))

    await waitFor(() => {
      expect(createPlaylist).toHaveBeenCalledWith('My Queue', ['1', '2'])
    })
  })

  it('clears queue with confirmation', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<QueueDock />)
    await user.click(screen.getByRole('button', { name: 'Clear queue' }))

    expect(usePlayerStore.getState().queue).toHaveLength(0)
  })
})
