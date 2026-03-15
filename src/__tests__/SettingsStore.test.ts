import { beforeEach, describe, expect, it } from 'vitest'

import { useSettingsStore } from '@/store/settingsStore'

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.setState({
      theme: 'terminal',
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
      themeMode: 'nothing',
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
    store.setThemeMode('nothing')

    const payload = store.exportSettings()
    useSettingsStore.setState({ audioQuality: 'auto', defaultSleepTimer: 'off', themeMode: 'nothing', theme: 'nothing' })
    const result = useSettingsStore.getState().importSettings(payload)

    expect(result.ok).toBe(true)
    const nextState = useSettingsStore.getState()
    expect(nextState.audioQuality).toBe('high')
    expect(nextState.defaultSleepTimer).toBe(30)
    expect(nextState.themeMode).toBe('nothing')
  })
})
