import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CreatePlaylistModal } from '@/components/playlists/CreatePlaylistModal'

describe('CreatePlaylistModal', () => {
  it('submits playlist name', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    render(<CreatePlaylistModal open onClose={onClose} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Playlist Name'), 'Night Run')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Night Run'))
  })
})
