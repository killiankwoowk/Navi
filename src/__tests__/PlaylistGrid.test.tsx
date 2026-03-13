import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PlaylistView } from '@/pages/PlaylistView/PlaylistView'
import { useUiStore } from '@/store/uiStore'

vi.mock('@/components/playlists/AddToPlaylistMenu', () => ({
  AddToPlaylistMenu: () => <span data-testid="add-to-playlist-menu" />,
}))

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  ;(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver
})

describe('PlaylistView grid/list toggle', () => {
  beforeEach(() => {
    useUiStore.setState({
      playlistViewMode: 'list',
      lyricsPanelOpen: false,
      lyricsTargetSong: null,
      scrobbleCount: 0,
    })
  })

  it('toggles between list and grid and triggers play callback', async () => {
    const user = userEvent.setup()
    const playSpy = vi.fn()

    const tracks = [
      { id: '1', title: 'Track One', artist: 'Artist A', duration: 120 },
      { id: '2', title: 'Track Two', artist: 'Artist B', duration: 140 },
    ]

    render(
      <PlaylistView
        title="Test Playlist"
        tracks={tracks}
        onPlayTrack={playSpy}
        onQueueTrack={vi.fn()}
        onOpenLyrics={vi.fn()}
      />,
    )

    await user.click(screen.getByLabelText('Show playlist in grid view'))
    expect(useUiStore.getState().playlistViewMode).toBe('grid')

    await user.click(screen.getByLabelText('Show playlist in list view'))
    expect(useUiStore.getState().playlistViewMode).toBe('list')

    await user.click(screen.getByLabelText('Play Track One'))
    expect(playSpy).toHaveBeenCalledWith(tracks[0], 0)
  })
})
