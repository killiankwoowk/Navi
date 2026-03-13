import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AudioQuality, FontMode, LyricsSource, SleepTimerDefault, ThemeMode } from '@/api/types'

interface SettingsSnapshot {
  audioQuality: AudioQuality
  gaplessEnabled: boolean
  crossfadeSeconds: number
  defaultSleepTimer: SleepTimerDefault
  lyricsEnabled: boolean
  lyricsSource: LyricsSource
  lyricsFontSize: number
  lyricsSyncOffsetMs: number
  lyricsFollowMode: boolean
  geniusApiKeyOverride: string
  themeMode: ThemeMode
  fontMode: FontMode
  analyticsEnabled: boolean
  lastfmEnabled: boolean
  lastfmApiKey: string
  lastfmApiSecret: string
  lastfmUsername: string
  lastfmSessionKey: string
}

interface SettingsState extends SettingsSnapshot {
  setAudioQuality: (quality: AudioQuality) => void
  setGaplessEnabled: (enabled: boolean) => void
  setCrossfadeSeconds: (seconds: number) => void
  setDefaultSleepTimer: (value: SleepTimerDefault) => void
  setLyricsEnabled: (enabled: boolean) => void
  setLyricsSource: (source: LyricsSource) => void
  setLyricsFontSize: (size: number) => void
  setLyricsSyncOffsetMs: (offsetMs: number) => void
  setLyricsFollowMode: (enabled: boolean) => void
  setGeniusApiKeyOverride: (value: string) => void
  clearGeniusApiKey: () => void
  setThemeMode: (theme: ThemeMode) => void
  setFontMode: (font: FontMode) => void
  setAnalyticsEnabled: (enabled: boolean) => void
  setLastfmEnabled: (enabled: boolean) => void
  setLastfmApiKey: (value: string) => void
  setLastfmApiSecret: (value: string) => void
  setLastfmUsername: (value: string) => void
  setLastfmSessionKey: (value: string) => void
  setLastfmSession: (sessionKey: string, username: string) => void
  clearLastfmSession: () => void
  exportSettings: () => string
  importSettings: (json: string) => { ok: boolean; error?: string }
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const defaultQualityFromEnv = (): AudioQuality => {
  const rawValue = (import.meta.env.VITE_DEFAULT_AUDIO_QUALITY as string | undefined)?.toLowerCase()
  if (rawValue === 'low' || rawValue === 'medium' || rawValue === 'high' || rawValue === 'auto') {
    return rawValue
  }
  return 'auto'
}

const parseSleepTimer = (value: unknown): SleepTimerDefault => {
  if (value === 'off' || value === 15 || value === 30 || value === 60) return value
  return 'off'
}

const initialSnapshot: SettingsSnapshot = {
  audioQuality: defaultQualityFromEnv(),
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
  lastfmEnabled: false,
  lastfmApiKey: '',
  lastfmApiSecret: '',
  lastfmUsername: '',
  lastfmSessionKey: '',
}

const getPersistedSnapshot = (state: SettingsState): SettingsSnapshot => ({
  audioQuality: state.audioQuality,
  gaplessEnabled: state.gaplessEnabled,
  crossfadeSeconds: state.crossfadeSeconds,
  defaultSleepTimer: state.defaultSleepTimer,
  lyricsEnabled: state.lyricsEnabled,
  lyricsSource: state.lyricsSource,
  lyricsFontSize: state.lyricsFontSize,
  lyricsSyncOffsetMs: state.lyricsSyncOffsetMs,
  lyricsFollowMode: state.lyricsFollowMode,
  geniusApiKeyOverride: state.geniusApiKeyOverride,
  themeMode: state.themeMode,
  fontMode: state.fontMode,
  analyticsEnabled: state.analyticsEnabled,
  lastfmEnabled: state.lastfmEnabled,
  lastfmApiKey: state.lastfmApiKey,
  lastfmApiSecret: state.lastfmApiSecret,
  lastfmUsername: state.lastfmUsername,
  lastfmSessionKey: state.lastfmSessionKey,
})

const normalizeImportedSettings = (input: unknown): Partial<SettingsSnapshot> => {
  if (!input || typeof input !== 'object') return {}
  const raw = input as Record<string, unknown>
  const next: Partial<SettingsSnapshot> = {}

  if (raw.audioQuality === 'auto' || raw.audioQuality === 'low' || raw.audioQuality === 'medium' || raw.audioQuality === 'high') {
    next.audioQuality = raw.audioQuality
  }

  if (typeof raw.gaplessEnabled === 'boolean') next.gaplessEnabled = raw.gaplessEnabled
  if (typeof raw.crossfadeSeconds === 'number') next.crossfadeSeconds = clamp(raw.crossfadeSeconds, 0, 12)
  if (typeof raw.defaultSleepTimer === 'string' || typeof raw.defaultSleepTimer === 'number') {
    next.defaultSleepTimer = parseSleepTimer(raw.defaultSleepTimer)
  }

  if (typeof raw.lyricsEnabled === 'boolean') next.lyricsEnabled = raw.lyricsEnabled
  if (raw.lyricsSource === 'auto' || raw.lyricsSource === 'genius' || raw.lyricsSource === 'local') {
    next.lyricsSource = raw.lyricsSource
  }
  if (typeof raw.lyricsFontSize === 'number') next.lyricsFontSize = clamp(raw.lyricsFontSize, 12, 30)
  if (typeof raw.lyricsSyncOffsetMs === 'number') next.lyricsSyncOffsetMs = raw.lyricsSyncOffsetMs
  if (typeof raw.lyricsFollowMode === 'boolean') next.lyricsFollowMode = raw.lyricsFollowMode
  if (typeof raw.geniusApiKeyOverride === 'string') next.geniusApiKeyOverride = raw.geniusApiKeyOverride

  if (raw.themeMode === 'terminal-dark' || raw.themeMode === 'terminal-contrast') next.themeMode = raw.themeMode
  if (raw.fontMode === 'jetbrains' || raw.fontMode === 'fira') next.fontMode = raw.fontMode
  if (typeof raw.analyticsEnabled === 'boolean') next.analyticsEnabled = raw.analyticsEnabled
  if (typeof raw.lastfmEnabled === 'boolean') next.lastfmEnabled = raw.lastfmEnabled
  if (typeof raw.lastfmApiKey === 'string') next.lastfmApiKey = raw.lastfmApiKey
  if (typeof raw.lastfmApiSecret === 'string') next.lastfmApiSecret = raw.lastfmApiSecret
  if (typeof raw.lastfmUsername === 'string') next.lastfmUsername = raw.lastfmUsername
  if (typeof raw.lastfmSessionKey === 'string') next.lastfmSessionKey = raw.lastfmSessionKey

  return next
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialSnapshot,
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      setGaplessEnabled: (gaplessEnabled) => set({ gaplessEnabled }),
      setCrossfadeSeconds: (crossfadeSeconds) => set({ crossfadeSeconds: clamp(crossfadeSeconds, 0, 12) }),
      setDefaultSleepTimer: (defaultSleepTimer) => set({ defaultSleepTimer: parseSleepTimer(defaultSleepTimer) }),
      setLyricsEnabled: (lyricsEnabled) => set({ lyricsEnabled }),
      setLyricsSource: (lyricsSource) => set({ lyricsSource }),
      setLyricsFontSize: (lyricsFontSize) => set({ lyricsFontSize: clamp(lyricsFontSize, 12, 30) }),
      setLyricsSyncOffsetMs: (lyricsSyncOffsetMs) => set({ lyricsSyncOffsetMs }),
      setLyricsFollowMode: (lyricsFollowMode) => set({ lyricsFollowMode }),
      setGeniusApiKeyOverride: (geniusApiKeyOverride) => set({ geniusApiKeyOverride: geniusApiKeyOverride.trim() }),
      clearGeniusApiKey: () => set({ geniusApiKeyOverride: '' }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setFontMode: (fontMode) => set({ fontMode }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
      setLastfmEnabled: (lastfmEnabled) =>
        set((state) => {
          if (lastfmEnabled && !state.lastfmSessionKey) {
            return { lastfmEnabled: false }
          }
          return { lastfmEnabled }
        }),
      setLastfmApiKey: (lastfmApiKey) => set({ lastfmApiKey: lastfmApiKey.trim() }),
      setLastfmApiSecret: (lastfmApiSecret) => set({ lastfmApiSecret: lastfmApiSecret.trim() }),
      setLastfmUsername: (lastfmUsername) => set({ lastfmUsername: lastfmUsername.trim() }),
      setLastfmSessionKey: (lastfmSessionKey) => set({ lastfmSessionKey: lastfmSessionKey.trim() }),
      setLastfmSession: (sessionKey, username) =>
        set({
          lastfmSessionKey: sessionKey.trim(),
          lastfmUsername: username.trim(),
          lastfmEnabled: true,
        }),
      clearLastfmSession: () => set({ lastfmSessionKey: '', lastfmEnabled: false, lastfmUsername: '' }),
      exportSettings: () => JSON.stringify(getPersistedSnapshot(get()), null, 2),
      importSettings: (json) => {
        try {
          const parsed = JSON.parse(json) as unknown
          const normalized = normalizeImportedSettings(parsed)
          set((state) => ({ ...state, ...normalized }))
          return { ok: true }
        } catch {
          return { ok: false, error: 'Invalid JSON settings payload.' }
        }
      },
    }),
    {
      name: 'navi-settings',
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') return initialSnapshot
        const normalized = normalizeImportedSettings(persistedState)
        return {
          ...initialSnapshot,
          ...(persistedState as Record<string, unknown>),
          ...normalized,
        }
      },
      partialize: (state) => getPersistedSnapshot(state),
    },
  ),
)
