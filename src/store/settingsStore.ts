import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AudioQuality, LyricsSource } from '@/api/types'

interface SettingsState {
  audioQuality: AudioQuality
  lyricsEnabled: boolean
  lyricsSource: LyricsSource
  lyricsFontSize: number
  lyricsSyncOffsetMs: number
  lyricsFollowMode: boolean
  setAudioQuality: (quality: AudioQuality) => void
  setLyricsEnabled: (enabled: boolean) => void
  setLyricsSource: (source: LyricsSource) => void
  setLyricsFontSize: (size: number) => void
  setLyricsSyncOffsetMs: (offsetMs: number) => void
  setLyricsFollowMode: (enabled: boolean) => void
}

const defaultQualityFromEnv = (): AudioQuality => {
  const rawValue = (import.meta.env.VITE_DEFAULT_AUDIO_QUALITY as string | undefined)?.toLowerCase()
  if (rawValue === 'low' || rawValue === 'medium' || rawValue === 'high' || rawValue === 'auto') {
    return rawValue
  }
  return 'auto'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      audioQuality: defaultQualityFromEnv(),
      lyricsEnabled: true,
      lyricsSource: 'auto',
      lyricsFontSize: 16,
      lyricsSyncOffsetMs: 0,
      lyricsFollowMode: true,
      setAudioQuality: (audioQuality) => set({ audioQuality }),
      setLyricsEnabled: (lyricsEnabled) => set({ lyricsEnabled }),
      setLyricsSource: (lyricsSource) => set({ lyricsSource }),
      setLyricsFontSize: (lyricsFontSize) => set({ lyricsFontSize: Math.max(12, Math.min(30, lyricsFontSize)) }),
      setLyricsSyncOffsetMs: (lyricsSyncOffsetMs) => set({ lyricsSyncOffsetMs }),
      setLyricsFollowMode: (lyricsFollowMode) => set({ lyricsFollowMode }),
    }),
    {
      name: 'navi-settings',
      partialize: (state) => ({
        audioQuality: state.audioQuality,
        lyricsEnabled: state.lyricsEnabled,
        lyricsSource: state.lyricsSource,
        lyricsFontSize: state.lyricsFontSize,
        lyricsSyncOffsetMs: state.lyricsSyncOffsetMs,
        lyricsFollowMode: state.lyricsFollowMode,
      }),
    },
  ),
)
