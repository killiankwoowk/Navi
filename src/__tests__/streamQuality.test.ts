import { beforeEach, describe, expect, it } from 'vitest'

import { useSettingsStore } from '@/store/settingsStore'
import { getMaxBitRateForQuality, getStreamUrl } from '@/utils/stream'

describe('stream quality settings', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.setState({
      audioQuality: 'auto',
      lyricsEnabled: true,
      lyricsSource: 'auto',
      lyricsFontSize: 16,
      lyricsSyncOffsetMs: 0,
      lyricsFollowMode: true,
    })
  })

  it('maps quality presets to maxBitRate values', () => {
    expect(getMaxBitRateForQuality('auto')).toBeUndefined()
    expect(getMaxBitRateForQuality('low')).toBe(128)
    expect(getMaxBitRateForQuality('medium')).toBe(192)
    expect(getMaxBitRateForQuality('high')).toBe(320)
  })

  it('adds maxBitRate to stream URL when quality is not auto', () => {
    const url = getStreamUrl({
      baseUrl: 'https://music.example.com',
      songId: '42',
      username: 'user',
      token: 'token',
      maxBitRate: 128,
    })
    expect(url).toContain('maxBitRate=128')

    const autoUrl = getStreamUrl({
      baseUrl: 'https://music.example.com',
      songId: '42',
      username: 'user',
      token: 'token',
      maxBitRate: 'auto',
    })
    expect(autoUrl).not.toContain('maxBitRate=')
  })

  it('persists selected quality in settings store', () => {
    useSettingsStore.getState().setAudioQuality('medium')
    const persisted = localStorage.getItem('navi-settings') ?? ''
    expect(persisted).toContain('"audioQuality":"medium"')
  })
})
