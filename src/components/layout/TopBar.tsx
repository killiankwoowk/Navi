import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Search } from 'lucide-react'

import { AsciiLogo } from '@/components/common/AsciiLogo'
import { useAuth } from '@/features/auth/useAuth'
import { useViewportMode } from '@/hooks/useViewportMode'
import { useUiStore } from '@/store/uiStore'

export const TopBar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const viewportMode = useViewportMode()
  const openSidebar = useUiStore((state) => state.openSidebar)
  const [searchInput, setSearchInput] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = searchInput.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  if (viewportMode === 'mobile') {
    return (
      <header className="terminal-panel mx-2 mt-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              className="terminal-button min-h-11 px-2 py-1"
              onClick={openSidebar}
              type="button"
              aria-label="Open navigation"
            >
              <Menu size={14} />
            </button>
            <div className="text-xs uppercase tracking-[0.16em] text-terminal-accent">Navi Terminal</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="terminal-button min-h-11 px-2 py-1" onClick={() => navigate('/search')} type="button" aria-label="Open search">
              <Search size={14} />
            </button>
            <button className="terminal-button min-h-11 px-2 py-1" onClick={logout} type="button" aria-label="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="terminal-panel mx-3 mt-3">
      <div className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="overflow-x-auto border border-terminal-text/20 p-2">
          <AsciiLogo />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {viewportMode === 'desktop' ? (
            <form className="flex min-w-[240px] items-center gap-2" onSubmit={onSubmit}>
              <span className="text-xs text-terminal-muted">$</span>
              <input
                className="terminal-input h-9"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="search artists albums songs"
                aria-label="Global search"
              />
              <button className="terminal-button h-9" type="submit">
                run
              </button>
            </form>
          ) : (
            <>
              <button className="terminal-button min-h-11 px-2 py-1" onClick={openSidebar} type="button" aria-label="Open navigation">
                <Menu size={14} />
                menu
              </button>
              <button className="terminal-button min-h-11 px-2 py-1" onClick={() => navigate('/search')} type="button">
                <Search size={14} />
                search
              </button>
            </>
          )}
          <button className="terminal-button min-h-11 px-2 py-1" onClick={() => navigate('/profile')} type="button">
            profile
          </button>
          <button className="terminal-button min-h-11 px-2 py-1" onClick={() => navigate('/settings')} type="button">
            settings
          </button>
          <button className="terminal-button min-h-11 px-2 py-1" onClick={logout} type="button">
            logout
          </button>
        </div>
      </div>
    </header>
  )
}
