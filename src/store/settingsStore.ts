import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AudioQuality, FontMode, LyricsSource, SleepTimerDefault, ThemeMode } from '@/api/types'

type Theme = 'terminal' | 'nothing'

interface SettingsSnapshot {
  theme: Theme
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
}

interface SettingsState extends SettingsSnapshot {
  setTheme: (theme: Theme) => void
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
  theme: 'terminal',
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
  themeMode: 'nothing',
  fontMode: 'jetbrains',
  analyticsEnabled: false,
}

const getPersistedSnapshot = (state: SettingsState): SettingsSnapshot => ({
  theme: state.theme,
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
})

const normalizeImportedSettings = (input: unknown): Partial<SettingsSnapshot> => {
  if (!input || typeof input !== 'object') return {}
  const raw = input as Record<string, unknown>
  const next: Partial<SettingsSnapshot> = {}

  if (raw.theme === 'terminal' || raw.theme === 'nothing') next.theme = raw.theme

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

  if (raw.themeMode === 'nothing') next.themeMode = raw.themeMode
  if (raw.fontMode === 'jetbrains' || raw.fontMode === 'fira') next.fontMode = raw.fontMode
  if (typeof raw.analyticsEnabled === 'boolean') next.analyticsEnabled = raw.analyticsEnabled

  return next
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialSnapshot,
      setTheme: (theme) =>
        set(() => ({
          theme,
          themeMode: 'nothing',
        })),
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
      setThemeMode: () =>
        set({
          themeMode: 'nothing',
          theme: 'nothing',
        }),
      setFontMode: (fontMode) => set({ fontMode }),
      setAnalyticsEnabled: (analyticsEnabled) => set({ analyticsEnabled }),
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
          ...normalized,
          theme: normalized.theme ?? 'nothing',
        }
      },
      partialize: (state) => getPersistedSnapshot(state),
    },
  ),
)
