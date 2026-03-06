import { beforeEach, describe, expect, it } from 'vitest'

import { useSettingsStore } from '@/store/settingsStore'

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.setState({
      audioQuality: 'auto',
      gaplessEnabled: false,
      crossfadeSeconds: 0,
      defaultSleepTimer: 'off',
      lyricsEnabled: true,
      lyricsSource: 'auto',
      lyricsFontSize: 16,
      lyricsSyncOffsetMs: 0,
      lyricsFollowMode: true,
      geniusApiKeyOverride: '',
      themeMode: 'terminal-dark',
      fontMode: 'jetbrains',
      analyticsEnabled: false,
    })
  })

  it('persists quality selection', () => {
    useSettingsStore.getState().setAudioQuality('medium')
    const persisted = localStorage.getItem('navi-settings') ?? ''
    expect(persisted).toContain('"audioQuality":"medium"')
  })

  it('exports and imports settings JSON', () => {
    const store = useSettingsStore.getState()
    store.setAudioQuality('high')
    store.setDefaultSleepTimer(30)
    store.setThemeMode('terminal-contrast')

    const payload = store.exportSettings()
    useSettingsStore.setState({ audioQuality: 'auto', defaultSleepTimer: 'off', themeMode: 'terminal-dark' })
    const result = useSettingsStore.getState().importSettings(payload)

    expect(result.ok).toBe(true)
    const nextState = useSettingsStore.getState()
    expect(nextState.audioQuality).toBe('high')
    expect(nextState.defaultSleepTimer).toBe(30)
    expect(nextState.themeMode).toBe('terminal-contrast')
  })
})
