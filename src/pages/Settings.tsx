import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { AudioQuality, SleepTimerDefault } from '@/api/types'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { getLastfmAuthToken, getLastfmAuthUrl, getLastfmSession } from '@/services/lastfmService'
import { useSettingsStore } from '@/store/settingsStore'

const qualityOptions: Array<{ value: AudioQuality; label: string; hint: string }> = [
  { value: 'auto', label: 'Auto', hint: 'Use server default stream' },
  { value: 'low', label: 'Low', hint: 'maxBitRate=128' },
  { value: 'medium', label: 'Medium', hint: 'maxBitRate=192' },
  { value: 'high', label: 'High', hint: 'maxBitRate=320' },
]

const sleepTimerOptions: SleepTimerDefault[] = ['off', 15, 30, 60]

export const Settings = () => {
  useDocumentTitle('Settings | Navi Terminal Player')

  const audioQuality = useSettingsStore((state) => state.audioQuality)
  const gaplessEnabled = useSettingsStore((state) => state.gaplessEnabled)
  const crossfadeSeconds = useSettingsStore((state) => state.crossfadeSeconds)
  const defaultSleepTimer = useSettingsStore((state) => state.defaultSleepTimer)
  const lyricsEnabled = useSettingsStore((state) => state.lyricsEnabled)
  const lyricsSource = useSettingsStore((state) => state.lyricsSource)
  const geniusApiKeyOverride = useSettingsStore((state) => state.geniusApiKeyOverride)
  const themeMode = useSettingsStore((state) => state.themeMode)
  const fontMode = useSettingsStore((state) => state.fontMode)
  const analyticsEnabled = useSettingsStore((state) => state.analyticsEnabled)
  const lastfmEnabled = useSettingsStore((state) => state.lastfmEnabled)
  const lastfmApiKey = useSettingsStore((state) => state.lastfmApiKey)
  const lastfmApiSecret = useSettingsStore((state) => state.lastfmApiSecret)
  const lastfmUsername = useSettingsStore((state) => state.lastfmUsername)
  const lastfmSessionKey = useSettingsStore((state) => state.lastfmSessionKey)

  const setAudioQuality = useSettingsStore((state) => state.setAudioQuality)
  const setGaplessEnabled = useSettingsStore((state) => state.setGaplessEnabled)
  const setCrossfadeSeconds = useSettingsStore((state) => state.setCrossfadeSeconds)
  const setDefaultSleepTimer = useSettingsStore((state) => state.setDefaultSleepTimer)
  const setLyricsEnabled = useSettingsStore((state) => state.setLyricsEnabled)
  const setLyricsSource = useSettingsStore((state) => state.setLyricsSource)
  const setGeniusApiKeyOverride = useSettingsStore((state) => state.setGeniusApiKeyOverride)
  const clearGeniusApiKey = useSettingsStore((state) => state.clearGeniusApiKey)
  const setThemeMode = useSettingsStore((state) => state.setThemeMode)
  const setFontMode = useSettingsStore((state) => state.setFontMode)
  const setAnalyticsEnabled = useSettingsStore((state) => state.setAnalyticsEnabled)
  const setLastfmEnabled = useSettingsStore((state) => state.setLastfmEnabled)
  const setLastfmApiKey = useSettingsStore((state) => state.setLastfmApiKey)
  const setLastfmApiSecret = useSettingsStore((state) => state.setLastfmApiSecret)
  const setLastfmUsername = useSettingsStore((state) => state.setLastfmUsername)
  const setLastfmSession = useSettingsStore((state) => state.setLastfmSession)
  const clearLastfmSession = useSettingsStore((state) => state.clearLastfmSession)
  const exportSettings = useSettingsStore((state) => state.exportSettings)
  const importSettings = useSettingsStore((state) => state.importSettings)

  const [showApiKey, setShowApiKey] = useState(false)
  const [showLastfmSecret, setShowLastfmSecret] = useState(false)
  const [lastfmError, setLastfmError] = useState<string | null>(null)
  const [lastfmBusy, setLastfmBusy] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const downloadSettings = () => {
    const blob = new Blob([exportSettings()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'navi-settings.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const onImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const result = importSettings(text)
    setImportError(result.ok ? null : result.error ?? 'Failed to import settings')
    event.target.value = ''
  }

  const connectLastfm = async () => {
    if (!lastfmApiKey || !lastfmApiSecret) {
      setLastfmError('Provide Last.fm API key and secret first.')
      return
    }
    setLastfmError(null)
    setLastfmBusy(true)
    try {
      const token = await getLastfmAuthToken(lastfmApiKey, lastfmApiSecret)
      const callbackUrl = `${window.location.origin}/settings`
      const authUrl = getLastfmAuthUrl(lastfmApiKey, token, callbackUrl)
      window.location.assign(authUrl)
    } catch (error) {
      setLastfmError(error instanceof Error ? error.message : 'Failed to start Last.fm auth.')
    } finally {
      setLastfmBusy(false)
    }
  }

  useEffect(() => {
    const token = searchParams.get('lastfmToken') ?? searchParams.get('token')
    if (!token || !lastfmApiKey || !lastfmApiSecret) return

    setLastfmBusy(true)
    setLastfmError(null)
    getLastfmSession(lastfmApiKey, lastfmApiSecret, token)
      .then((session) => {
        setLastfmSession(session.key, session.name)
        const nextParams = new URLSearchParams(searchParams)
        nextParams.delete('lastfmToken')
        nextParams.delete('token')
        setSearchParams(nextParams, { replace: true })
      })
      .catch((error) => {
        setLastfmError(error instanceof Error ? error.message : 'Failed to connect Last.fm.')
      })
      .finally(() => {
        setLastfmBusy(false)
      })
  }, [lastfmApiKey, lastfmApiSecret, searchParams, setLastfmSession, setSearchParams])

  return (
    <TerminalPanel title="Settings">
      <div className="space-y-4">
        <section className="space-y-2 border border-terminal-text/20 p-3">
          <h2 className="m-0 text-xs uppercase tracking-[0.16em] text-terminal-muted">Playback</h2>
          <fieldset className="space-y-1 border border-terminal-text/15 p-2">
            <legend className="px-1 text-[11px] uppercase tracking-[0.14em] text-terminal-muted">Audio quality</legend>
            {qualityOptions.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="audio-quality"
                  value={option.value}
                  checked={audioQuality === option.value}
                  onChange={() => setAudioQuality(option.value)}
                />
                <span className="text-terminal-text">{option.label}</span>
                <span className="text-terminal-muted">{option.hint}</span>
              </label>
            ))}
          </fieldset>

          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={gaplessEnabled} onChange={(event) => setGaplessEnabled(event.target.checked)} />
            <span>Gapless playback (preference)</span>
          </label>

          <label className="block space-y-1 text-xs">
            <span className="text-terminal-muted">Crossfade: {crossfadeSeconds}s</span>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={crossfadeSeconds}
              onChange={(event) => setCrossfadeSeconds(Number(event.target.value))}
              className="w-full accent-terminal-accent"
            />
          </label>

          <label className="block space-y-1 text-xs">
            <span className="text-terminal-muted">Default sleep timer</span>
            <select
              value={String(defaultSleepTimer)}
              onChange={(event) => {
                const raw = event.target.value
                setDefaultSleepTimer(raw === 'off' ? 'off' : Number(raw) as SleepTimerDefault)
              }}
              className="terminal-input max-w-xs"
            >
              {sleepTimerOptions.map((item) => (
                <option key={String(item)} value={String(item)}>
                  {item === 'off' ? 'Off' : `${item} minutes`}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="space-y-2 border border-terminal-text/20 p-3">
          <h2 className="m-0 text-xs uppercase tracking-[0.16em] text-terminal-muted">Lyrics</h2>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={lyricsEnabled} onChange={(event) => setLyricsEnabled(event.target.checked)} />
            <span>Enable lyrics</span>
          </label>

          <label className="block space-y-1 text-xs">
            <span className="text-terminal-muted">Source priority</span>
            <select
              value={lyricsSource}
              onChange={(event) => setLyricsSource(event.target.value as 'auto' | 'genius' | 'local')}
              className="terminal-input max-w-xs"
            >
              <option value="auto">Auto (Genius {'>'} Local)</option>
              <option value="genius">Genius only</option>
              <option value="local">Local only</option>
            </select>
          </label>

          <div className="space-y-1 text-xs">
            <label htmlFor="genius-key" className="text-terminal-muted">
              Genius API key override (optional)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="genius-key"
                type={showApiKey ? 'text' : 'password'}
                className="terminal-input max-w-md"
                placeholder="VITE_GENIUS_API_KEY override"
                value={geniusApiKeyOverride}
                onChange={(event) => setGeniusApiKeyOverride(event.target.value)}
              />
              <button
                type="button"
                className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
                onClick={() => setShowApiKey((value) => !value)}
              >
                {showApiKey ? 'hide' : 'show'}
              </button>
              <button
                type="button"
                className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
                onClick={clearGeniusApiKey}
              >
                clear
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-2 border border-terminal-text/20 p-3">
          <h2 className="m-0 text-xs uppercase tracking-[0.16em] text-terminal-muted">Last.fm</h2>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={lastfmEnabled}
              onChange={(event) => {
                const nextValue = event.target.checked
                if (nextValue && !lastfmSessionKey) {
                  setLastfmError('Connect Last.fm before enabling scrobbling.')
                  return
                }
                setLastfmError(null)
                setLastfmEnabled(nextValue)
              }}
            />
            <span>Enable Last.fm scrobbling</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block space-y-1 text-xs">
              <span className="text-terminal-muted">API Key</span>
              <input
                className="terminal-input"
                value={lastfmApiKey}
                onChange={(event) => setLastfmApiKey(event.target.value)}
                placeholder="Last.fm API key"
              />
            </label>
            <label className="block space-y-1 text-xs">
              <span className="text-terminal-muted">API Secret</span>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="terminal-input flex-1"
                  type={showLastfmSecret ? 'text' : 'password'}
                  value={lastfmApiSecret}
                  onChange={(event) => setLastfmApiSecret(event.target.value)}
                  placeholder="Last.fm API secret"
                />
                <button
                  type="button"
                  className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
                  onClick={() => setShowLastfmSecret((value) => !value)}
                >
                  {showLastfmSecret ? 'hide' : 'show'}
                </button>
              </div>
            </label>
          </div>
          <label className="block space-y-1 text-xs">
            <span className="text-terminal-muted">Username</span>
            <input
              className="terminal-input"
              value={lastfmUsername}
              onChange={(event) => setLastfmUsername(event.target.value)}
              placeholder="Last.fm username"
            />
          </label>
          <label className="block space-y-1 text-xs">
            <span className="text-terminal-muted">Session Key</span>
            <input className="terminal-input" value={lastfmSessionKey} readOnly placeholder="Not connected" />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={connectLastfm}
              disabled={lastfmBusy}
            >
              {lastfmBusy ? 'connecting...' : 'connect last.fm'}
            </button>
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={() => {
                clearLastfmSession()
                setLastfmError(null)
              }}
              disabled={lastfmBusy}
            >
              disconnect
            </button>
          </div>
          {lastfmSessionKey ? (
            <p className="m-0 text-xs text-terminal-muted">Connected as {lastfmUsername || 'unknown user'}.</p>
          ) : (
            <p className="m-0 text-xs text-terminal-muted">Connect Last.fm to enable scrobbling.</p>
          )}
          {lastfmError ? <p className="m-0 text-xs text-terminal-warn">{lastfmError}</p> : null}
        </section>

        <section className="space-y-2 border border-terminal-text/20 p-3">
          <h2 className="m-0 text-xs uppercase tracking-[0.16em] text-terminal-muted">Appearance</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block space-y-1 text-xs">
              <span className="text-terminal-muted">Theme</span>
              <select
                value={themeMode}
                onChange={(event) => setThemeMode(event.target.value as 'terminal-dark' | 'terminal-contrast')}
                className="terminal-input"
              >
                <option value="terminal-dark">Terminal Dark</option>
                <option value="terminal-contrast">Terminal High Contrast</option>
              </select>
            </label>
            <label className="block space-y-1 text-xs">
              <span className="text-terminal-muted">Font</span>
              <select
                value={fontMode}
                onChange={(event) => setFontMode(event.target.value as 'jetbrains' | 'fira')}
                className="terminal-input"
              >
                <option value="jetbrains">JetBrains Mono</option>
                <option value="fira">Fira Code</option>
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-2 border border-terminal-text/20 p-3">
          <h2 className="m-0 text-xs uppercase tracking-[0.16em] text-terminal-muted">Privacy</h2>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} />
            <span>Enable local analytics metrics</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={downloadSettings}
            >
              export settings
            </button>
            <button
              type="button"
              className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              onClick={() => inputFileRef.current?.click()}
            >
              import settings
            </button>
            <input ref={inputFileRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
          </div>
          {importError ? <p className="m-0 text-xs text-terminal-warn">{importError}</p> : null}
        </section>
      </div>
    </TerminalPanel>
  )
}
