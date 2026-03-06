import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Song } from '@/api/types'

interface UiStore {
  queuePanelOpen: boolean
  compactMode: boolean
  libraryAlbumType: string
  playlistViewMode: 'list' | 'grid'
  lyricsPanelOpen: boolean
  lyricsTargetSong: Song | null
  streamQualityWarning: string | null
  setQueuePanelOpen: (value: boolean) => void
  toggleQueuePanel: () => void
  setCompactMode: (value: boolean) => void
  setLibraryAlbumType: (type: string) => void
  setPlaylistViewMode: (mode: 'list' | 'grid') => void
  openLyricsPanel: (song?: Song | null) => void
  closeLyricsPanel: () => void
  setStreamQualityWarning: (message: string | null) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      queuePanelOpen: false,
      compactMode: false,
      libraryAlbumType: 'alphabeticalByName',
      playlistViewMode: 'list',
      lyricsPanelOpen: false,
      lyricsTargetSong: null,
      streamQualityWarning: null,
      setQueuePanelOpen: (value) => set({ queuePanelOpen: value }),
      toggleQueuePanel: () => set((state) => ({ queuePanelOpen: !state.queuePanelOpen })),
      setCompactMode: (value) => set({ compactMode: value }),
      setLibraryAlbumType: (libraryAlbumType) => set({ libraryAlbumType }),
      setPlaylistViewMode: (playlistViewMode) => set({ playlistViewMode }),
      openLyricsPanel: (song) => set({ lyricsPanelOpen: true, lyricsTargetSong: song ?? null }),
      closeLyricsPanel: () => set({ lyricsPanelOpen: false, lyricsTargetSong: null }),
      setStreamQualityWarning: (streamQualityWarning) => set({ streamQualityWarning }),
    }),
    {
      name: 'navi-ui',
      partialize: (state) => ({
        queuePanelOpen: state.queuePanelOpen,
        compactMode: state.compactMode,
        libraryAlbumType: state.libraryAlbumType,
        playlistViewMode: state.playlistViewMode,
        lyricsPanelOpen: state.lyricsPanelOpen,
      }),
    },
  ),
)
