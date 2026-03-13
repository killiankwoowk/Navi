import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { QueueDock } from '@/components/player/QueueDock'
import { QueueDrawer } from '@/components/player/QueueDrawer'
import { QueueFab } from '@/components/player/QueueFab'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'

describe('Queue responsive components', () => {
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
    useUiStore.setState({
      desktopQueueCollapsed: false,
      mobileSidebarOpen: false,
      mobileQueueOpen: false,
      mobilePlayerExpanded: false,
      desktopSidebarCollapsed: false,
      mobileSearchTab: 'songs',
      queuePanelOpen: false,
      compactMode: false,
      libraryAlbumType: 'alphabeticalByName',
      playlistViewMode: 'list',
      lyricsPanelOpen: false,
      lyricsTargetSong: null,
      streamQualityWarning: null,
    })
  })

  it('renders queue drawer when open', () => {
    render(<QueueDrawer open onClose={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Queue drawer' })).toBeInTheDocument()
  })

  it('collapses queue dock from hide button', async () => {
    const user = userEvent.setup()
    render(<QueueDock />)

    await user.click(screen.getByRole('button', { name: 'Collapse queue dock' }))
    expect(useUiStore.getState().desktopQueueCollapsed).toBe(true)
  })

  it('opens queue drawer from tablet FAB', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<QueueFab count={3} onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Open queue drawer' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
