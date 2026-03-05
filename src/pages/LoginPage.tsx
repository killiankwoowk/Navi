import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const LoginPage = () => {
  useDocumentTitle('Login | Navi Terminal Player')

  const navigate = useNavigate()
  const { isAuthenticated, login } = useAuth()
  const defaultServerUrl = (import.meta.env.VITE_DEFAULT_NAVIDROME_URL as string | undefined) ?? 'https://music.dobymick.me'
  const [serverUrl, setServerUrl] = useState(defaultServerUrl)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/library')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({
        serverUrl,
        username,
        password,
      })
      navigate('/library')
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : 'Login failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="terminal-grid flex min-h-screen items-center justify-center p-4">
      <TerminalPanel title="NAVIDROME LOGIN" className="w-full max-w-lg" bodyClassName="space-y-3">
        <p className="m-0 text-xs text-terminal-muted">Direct Subsonic auth. Credentials are saved on this browser.</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.15em] text-terminal-muted" htmlFor="server-url">
              Server URL
            </label>
            <input
              id="server-url"
              className="terminal-input"
              value={serverUrl}
              onChange={(event) => setServerUrl(event.target.value)}
              placeholder="https://music.dobymick.me"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.15em] text-terminal-muted" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="terminal-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.15em] text-terminal-muted" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="terminal-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error ? <div className="border border-red-400/60 bg-red-950/30 p-2 text-xs text-red-200">{error}</div> : null}
          <button className="terminal-button w-full justify-center py-2" type="submit" disabled={isLoading}>
            {isLoading ? 'CONNECTING...' : 'CONNECT'}
          </button>
        </form>
      </TerminalPanel>
    </div>
  )
}
