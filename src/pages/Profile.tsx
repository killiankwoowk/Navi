import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUsageStore } from '@/store/usageStore'

const initialsFromName = (name: string): string => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

const colorFromName = (name: string): string => {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }
  return `hsl(${Math.abs(hash % 360)}, 70%, 25%)`
}

export const Profile = () => {
  useDocumentTitle('Profile | Navi Terminal Player')

  const navigate = useNavigate()
  const { logout } = useAuth()
  const clearSession = useAuthStore((state) => state.clearSession)
  const username = useAuthStore((state) => state.username)
  const serverUrl = useAuthStore((state) => state.serverUrl)
  const clearGeniusApiKey = useSettingsStore((state) => state.clearGeniusApiKey)
  const geniusApiKeyOverride = useSettingsStore((state) => state.geniusApiKeyOverride)

  const totalPlays = useUsageStore((state) => state.getTotalPlays())
  const topArtists = useUsageStore((state) => state.getTopArtists(6))
  const trackedSongs = useUsageStore((state) => Object.keys(state.entries).length)

  const avatarInitials = useMemo(() => initialsFromName(username || 'Navi User'), [username])
  const avatarColor = useMemo(() => colorFromName(username || 'Navi User'), [username])
  const hasEnvGeniusKey = Boolean((import.meta.env.VITE_GENIUS_API_KEY as string | undefined)?.trim())
  const geniusStatus = geniusApiKeyOverride
    ? 'Stored locally'
    : hasEnvGeniusKey
      ? 'Using env only'
      : 'Not set'

  return (
    <TerminalPanel title="Profile">
      <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
        <section className="space-y-3 border border-terminal-text/20 p-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-terminal-accent text-lg font-bold text-terminal-accent"
              style={{ backgroundColor: avatarColor }}
              aria-hidden="true"
            >
              {avatarInitials}
            </div>
            <div>
              <h2 className="m-0 text-sm text-terminal-text">{username || 'Navi User'}</h2>
              <p className="m-0 text-xs text-terminal-muted">email: N/A</p>
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <p className="m-0 text-terminal-muted">server</p>
            <p className="m-0 break-all text-terminal-text">{serverUrl || '-'}</p>
          </div>
          <div className="space-y-1 text-xs">
            <p className="m-0 text-terminal-muted">Genius key</p>
            <p className="m-0 text-terminal-text">{geniusStatus}</p>
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={clearGeniusApiKey}
            >
              remove local key
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={() => {
                clearSession()
                navigate('/login')
              }}
            >
              re-authenticate
            </button>
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 text-terminal-warn focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={logout}
            >
              logout
            </button>
          </div>
        </section>

        <section className="space-y-3 border border-terminal-text/20 p-3">
          <header className="text-xs uppercase tracking-[0.16em] text-terminal-muted">Usage Stats</header>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-terminal-text/20 p-2">
              <p className="m-0 text-[11px] uppercase tracking-[0.14em] text-terminal-muted">Total Plays</p>
              <p className="m-0 mt-1 text-lg text-terminal-accent">{totalPlays}</p>
            </div>
            <div className="border border-terminal-text/20 p-2">
              <p className="m-0 text-[11px] uppercase tracking-[0.14em] text-terminal-muted">Tracked Songs</p>
              <p className="m-0 mt-1 text-lg text-terminal-accent">{trackedSongs}</p>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="m-0 text-sm text-terminal-text">Top artists</h3>
            {topArtists.length === 0 ? (
              <p className="m-0 text-xs text-terminal-muted">No play history yet.</p>
            ) : (
              topArtists.map((item) => (
                <div key={item.artist} className="flex items-center justify-between border border-terminal-text/15 px-2 py-1 text-xs">
                  <span className="truncate text-terminal-text">{item.artist}</span>
                  <span className="text-terminal-muted">{item.playCount} plays</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </TerminalPanel>
  )
}
