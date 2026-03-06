import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AsciiLogo } from '@/components/common/AsciiLogo'
import { useAuth } from '@/features/auth/useAuth'

export const TopBar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [searchInput, setSearchInput] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = searchInput.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <header className="terminal-panel mx-3 mt-3">
      <div className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="overflow-x-auto border border-terminal-text/20 p-2">
          <AsciiLogo />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
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
          <button className="terminal-button h-9" onClick={() => navigate('/profile')} type="button">
            profile
          </button>
          <button className="terminal-button h-9" onClick={() => navigate('/settings')} type="button">
            settings
          </button>
          <button className="terminal-button h-9" onClick={logout} type="button">
            logout
          </button>
          <button className="terminal-button h-9 md:hidden" onClick={() => navigate('/playlists')} type="button">
            queue
          </button>
        </div>
      </div>
    </header>
  )
}
