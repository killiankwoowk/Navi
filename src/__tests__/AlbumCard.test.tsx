import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Album } from '@/api/types'
import { AlbumCard } from '@/components/home/AlbumCard'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('AlbumCard', () => {
  const album: Album = {
    id: 'album-1',
    name: 'Night Shift',
    artist: 'Terminal Echo',
  }

  beforeEach(() => {
    mockNavigate.mockReset()
  })

  it('navigates to album page when cover is clicked', async () => {
    const user = userEvent.setup()
    render(<AlbumCard album={album} onPlay={vi.fn()} onQueue={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: `Open album ${album.name}` }))
    expect(mockNavigate).toHaveBeenCalledWith(`/album/${album.id}`)
  })

  it('play action does not trigger navigation', async () => {
    const user = userEvent.setup()
    const playSpy = vi.fn()
    render(<AlbumCard album={album} onPlay={playSpy} onQueue={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: `Play album ${album.name}` }))
    expect(playSpy).toHaveBeenCalledTimes(1)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('supports keyboard activation on cover button', async () => {
    const user = userEvent.setup()
    render(<AlbumCard album={album} onPlay={vi.fn()} onQueue={vi.fn()} />)
    const coverButton = screen.getByRole('button', { name: `Open album ${album.name}` })
    coverButton.focus()
    await user.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalledWith(`/album/${album.id}`)
  })
})
