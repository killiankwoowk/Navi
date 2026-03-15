import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import type { Album } from '@/api/types'
import { AlbumDetailPage } from '@/pages/AlbumDetailPage'
import { usePlayerStore } from '@/store/playerStore'

vi.mock('@/features/library/useLibrary', () => ({
  useAlbumQuery: () => ({
    data: {
      id: 'album-1',
      name: 'Test Album',
      artist: 'Test Artist',
      artistId: 'artist-1',
      year: 2020,
      genre: 'Synthwave',
      song: [
        { id: 'song-1', title: 'Track One', duration: 120 },
        { id: 'song-2', title: 'Track Two', duration: 140 },
      ],
      songCount: 2,
    } satisfies Album,
    isLoading: false,
  }),
}))

vi.mock('@/features/auth/useAuth', () => ({
  getNavidromeClientOrNull: () => null,
}))

vi.mock('@/hooks/useViewportMode', () => ({
  useViewportMode: () => 'desktop',
}))

describe('AlbumDetailPage', () => {
  it('renders album metadata and tracklist', () => {
    render(
      <MemoryRouter initialEntries={['/album/album-1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Test Album')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(screen.getByText('tracks')).toBeInTheDocument()
    expect(screen.getByText('Track One')).toBeInTheDocument()
  })

  it('plays the album when Play Album is clicked', async () => {
    const user = userEvent.setup()
    const setQueue = vi.fn()

    usePlayerStore.setState({
      setQueue,
    } as unknown as Parameters<typeof usePlayerStore.setState>[0])

    render(
      <MemoryRouter initialEntries={['/album/album-1']}>
        <Routes>
          <Route path="/album/:id" element={<AlbumDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'play album' }))
    expect(setQueue).toHaveBeenCalled()
  })
})
