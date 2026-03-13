import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useViewportMode } from '@/hooks/useViewportMode'
import { useSettingsStore } from '@/store/settingsStore'
import { useUiStore } from '@/store/uiStore'

import { BottomPlayer } from './BottomPlayer'
import { DesktopSidebar } from './DesktopSidebar'
import { MobileNavBar } from './MobileNavBar'
import { ResponsiveLayout } from './ResponsiveLayout'
import { SidebarDrawer } from './SidebarDrawer'
import { TopBar } from './TopBar'
import { QueueDock } from '@/components/player/QueueDock'
import { QueueDrawer } from '@/components/player/QueueDrawer'
import { QueueFab } from '@/components/player/QueueFab'
import { usePlayerStore } from '@/store/playerStore'

export const AppShell = () => {
  const { bindAuthFailure } = useAuth()
  useKeyboardShortcuts()
  const viewportMode = useViewportMode()
  const themeMode = useSettingsStore((state) => state.themeMode)
  const fontMode = useSettingsStore((state) => state.fontMode)
  const desktopSidebarCollapsed = useUiStore((state) => state.desktopSidebarCollapsed)
  const setDesktopSidebarCollapsed = useUiStore((state) => state.setDesktopSidebarCollapsed)
  const desktopQueueCollapsed = useUiStore((state) => state.desktopQueueCollapsed)
  const setDesktopQueueCollapsed = useUiStore((state) => state.setDesktopQueueCollapsed)
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen)
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen)
  const mobileQueueOpen = useUiStore((state) => state.mobileQueueOpen)
  const setMobileQueueOpen = useUiStore((state) => state.setMobileQueueOpen)
  const mobilePlayerExpanded = useUiStore((state) => state.mobilePlayerExpanded)
  const setMobilePlayerExpanded = useUiStore((state) => state.setMobilePlayerExpanded)
  const queueCount = usePlayerStore((state) => state.queue.length)

  useEffect(() => bindAuthFailure(), [bindAuthFailure])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme-mode', themeMode)
    document.documentElement.setAttribute('data-font-mode', fontMode)
  }, [fontMode, themeMode])

  useEffect(() => {
    if (viewportMode === 'desktop') {
      setMobileQueueOpen(false)
      setMobileSidebarOpen(false)
    }
  }, [setMobileQueueOpen, setMobileSidebarOpen, viewportMode])

  useEffect(() => {
    if (viewportMode !== 'mobile' && mobilePlayerExpanded) {
      setMobilePlayerExpanded(false)
    }
  }, [mobilePlayerExpanded, setMobilePlayerExpanded, viewportMode])

  return (
    <div className="terminal-grid flex h-screen flex-col">
      <TopBar />
      <div className="flex-1 min-h-0 overflow-hidden">
        <ResponsiveLayout
          viewportMode={viewportMode}
          desktopSidebar={
            <DesktopSidebar
              collapsed={desktopSidebarCollapsed}
              onToggleCollapsed={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
            />
          }
          desktopSidebarCollapsed={desktopSidebarCollapsed}
          queueDock={
            viewportMode === 'desktop' ? (
              desktopQueueCollapsed ? (
                <div className="terminal-panel h-fit p-2">
                  <button
                    type="button"
                    className="terminal-button min-h-11 w-full justify-center"
                    onClick={() => setDesktopQueueCollapsed(false)}
                    aria-label="Open queue dock"
                  >
                    open queue
                  </button>
                </div>
              ) : (
                <QueueDock />
              )
            ) : null
          }
        >
          <Outlet />
        </ResponsiveLayout>
      </div>
      <BottomPlayer viewportMode={viewportMode} />
      {viewportMode !== 'desktop' ? <QueueDrawer open={mobileQueueOpen} onClose={() => setMobileQueueOpen(false)} /> : null}
      {viewportMode !== 'desktop' ? <SidebarDrawer open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} /> : null}
      {viewportMode === 'tablet' ? <QueueFab count={queueCount} onClick={() => setMobileQueueOpen(true)} /> : null}
      <MobileNavBar />
    </div>
  )
}
