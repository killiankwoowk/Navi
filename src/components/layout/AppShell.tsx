import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

import { BottomPlayer } from './BottomPlayer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export const AppShell = () => {
  const { bindAuthFailure } = useAuth()
  useKeyboardShortcuts()

  useEffect(() => bindAuthFailure(), [bindAuthFailure])

  return (
    <div className="terminal-grid min-h-screen">
      <TopBar />
      <div className="grid min-h-[calc(100vh-260px)] grid-cols-1 gap-3 px-3 py-3 lg:grid-cols-[230px_1fr]">
        <Sidebar />
        <main className="min-h-0 space-y-3">
          <Outlet />
        </main>
      </div>
      <BottomPlayer />
    </div>
  )
}
