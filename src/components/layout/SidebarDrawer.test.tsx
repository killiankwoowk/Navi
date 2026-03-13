import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SidebarDrawer } from '@/components/layout/SidebarDrawer'

describe('SidebarDrawer', () => {
  it('closes on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <SidebarDrawer open onClose={onClose} />
      </MemoryRouter>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on overlay click', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <SidebarDrawer open onClose={onClose} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Close sidebar overlay' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
