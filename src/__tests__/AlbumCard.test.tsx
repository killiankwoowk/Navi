import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import type { Album } from '@/api/types'
import { AlbumCard } from '@/components/home/AlbumCard'

describe('AlbumCard', () => {
  const album: Album = {
    id: 'album-1',
    name: 'Night Shift',
    artist: 'Terminal Echo',
  }

  it('renders album links for cover and title', () => {
    render(
      <MemoryRouter>
        <AlbumCard album={album} onPlay={vi.fn()} onQueue={vi.fn()} />
      </MemoryRouter>,
    )

    const coverLink = screen.getByRole('link', { name: `Open album ${album.name}` })
    const titleLink = screen.getByRole('link', { name: `Open album details for ${album.name}` })
    expect(coverLink).toHaveAttribute('href', `/album/${album.id}`)
    expect(titleLink).toHaveAttribute('href', `/album/${album.id}`)
  })

  it('play action does not trigger navigation', async () => {
    const user = userEvent.setup()
    const playSpy = vi.fn()
    const openSpy = vi.fn()
    render(
      <MemoryRouter>
        <AlbumCard album={album} onPlay={playSpy} onQueue={vi.fn()} onOpen={openSpy} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: `Play album ${album.name}` }))
    expect(playSpy).toHaveBeenCalledTimes(1)
    expect(openSpy).not.toHaveBeenCalled()
  })
})
