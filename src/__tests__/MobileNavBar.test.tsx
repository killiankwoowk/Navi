import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { MobileNavBar } from '@/components/layout/MobileNavBar'

describe('MobileNavBar', () => {
  it('renders all mobile nav items', () => {
    render(
      <MemoryRouter>
        <MobileNavBar />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
    expect(screen.getByLabelText('Library')).toBeInTheDocument()
    expect(screen.getByLabelText('Playlists')).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })
})

