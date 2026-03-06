import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout'

const desktopSidebar = <div data-testid="desktop-sidebar">desktop-sidebar</div>
const tabletSidebar = <div data-testid="tablet-sidebar">tablet-sidebar</div>
const queueDock = <div data-testid="queue-dock">queue-dock</div>
const content = <div data-testid="content">content</div>

describe('ResponsiveLayout', () => {
  it('renders mobile layout without sidebars', () => {
    render(
      <ResponsiveLayout viewportMode="mobile" desktopSidebar={desktopSidebar} tabletSidebar={tabletSidebar} queueDock={queueDock}>
        {content}
      </ResponsiveLayout>,
    )

    expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('tablet-sidebar')).not.toBeInTheDocument()
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders tablet layout with tablet sidebar only', () => {
    render(
      <ResponsiveLayout viewportMode="tablet" desktopSidebar={desktopSidebar} tabletSidebar={tabletSidebar} queueDock={queueDock}>
        {content}
      </ResponsiveLayout>,
    )

    expect(screen.getByTestId('tablet-sidebar')).toBeInTheDocument()
    expect(screen.queryByTestId('desktop-sidebar')).not.toBeInTheDocument()
  })

  it('renders desktop layout with queue dock', () => {
    render(
      <ResponsiveLayout viewportMode="desktop" desktopSidebar={desktopSidebar} tabletSidebar={tabletSidebar} queueDock={queueDock}>
        {content}
      </ResponsiveLayout>,
    )

    expect(screen.getByTestId('desktop-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('queue-dock')).toBeInTheDocument()
  })
})

