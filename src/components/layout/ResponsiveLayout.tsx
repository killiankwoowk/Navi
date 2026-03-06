import type { PropsWithChildren, ReactNode } from 'react'

import type { ViewportMode } from '@/api/types'

interface ResponsiveLayoutProps extends PropsWithChildren {
  viewportMode: ViewportMode
  desktopSidebar: ReactNode
  tabletSidebar: ReactNode
  queueDock?: ReactNode
}

export const ResponsiveLayout = ({
  viewportMode,
  desktopSidebar,
  tabletSidebar,
  queueDock,
  children,
}: ResponsiveLayoutProps) => {
  if (viewportMode === 'mobile') {
    return <div className="space-y-3 px-2 py-2 pb-28">{children}</div>
  }

  if (viewportMode === 'tablet') {
    return (
      <div className="grid min-h-[calc(100vh-250px)] grid-cols-[72px_1fr] gap-3 px-3 py-3">
        {tabletSidebar}
        <main className="min-h-0 space-y-3">{children}</main>
      </div>
    )
  }

  return (
    <div
      className={`grid min-h-[calc(100vh-250px)] gap-3 px-3 py-3 ${
        queueDock ? 'grid-cols-[260px_minmax(0,1fr)_340px]' : 'grid-cols-[260px_minmax(0,1fr)]'
      }`}
    >
      {desktopSidebar}
      <main className="min-h-0 space-y-3">{children}</main>
      {queueDock}
    </div>
  )
}

