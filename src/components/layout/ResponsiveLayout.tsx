import type { PropsWithChildren, ReactNode } from 'react'

import type { ViewportMode } from '@/api/types'

interface ResponsiveLayoutProps extends PropsWithChildren {
  viewportMode: ViewportMode
  desktopSidebar: ReactNode
  desktopSidebarCollapsed?: boolean
  queueDock?: ReactNode
}

export const ResponsiveLayout = ({
  viewportMode,
  desktopSidebar,
  desktopSidebarCollapsed = false,
  queueDock,
  children,
}: ResponsiveLayoutProps) => {
  if (viewportMode === 'mobile') {
    return (
      <main className="app-scroll flex-1 min-h-0 overflow-auto px-2 py-2 pb-[calc(var(--footer-height)+env(safe-area-inset-bottom))]">
        <div className="space-y-3">{children}</div>
      </main>
    )
  }

  if (viewportMode === 'tablet') {
    return (
      <main className="app-scroll flex-1 min-h-0 overflow-auto px-3 py-3 pb-[calc(var(--footer-height)+env(safe-area-inset-bottom))]">
        <div className="space-y-3">{children}</div>
      </main>
    )
  }

  const gridCols = queueDock
    ? desktopSidebarCollapsed
      ? 'grid-cols-[72px_minmax(0,1fr)_340px]'
      : 'grid-cols-[260px_minmax(0,1fr)_340px]'
    : desktopSidebarCollapsed
      ? 'grid-cols-[72px_minmax(0,1fr)]'
      : 'grid-cols-[260px_minmax(0,1fr)]'

  return (
    <div className={`grid h-full min-h-0 gap-3 px-3 py-3 ${gridCols}`}>
      {desktopSidebar}
      <main className="app-scroll min-h-0 overflow-auto pb-[calc(var(--footer-height)+env(safe-area-inset-bottom))]">
        <div className="space-y-3">{children}</div>
      </main>
      {queueDock}
    </div>
  )
}
