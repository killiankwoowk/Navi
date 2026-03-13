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
  desktopSidebarCollapsed: boolean
  desktopQueueCollapsed: boolean
  mobileSidebarOpen: boolean
  mobilePlayerExpanded: boolean
  mobileQueueOpen: boolean
  mobileSearchTab: 'songs' | 'albums' | 'artists'
  setQueuePanelOpen: (value: boolean) => void
  toggleQueuePanel: () => void
  setCompactMode: (value: boolean) => void
  setLibraryAlbumType: (type: string) => void
  setPlaylistViewMode: (mode: 'list' | 'grid') => void
  openLyricsPanel: (song?: Song | null) => void
  closeLyricsPanel: () => void
  setStreamQualityWarning: (message: string | null) => void
  setDesktopSidebarCollapsed: (value: boolean) => void
  setDesktopQueueCollapsed: (value: boolean) => void
  setMobileSidebarOpen: (value: boolean) => void
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  setMobilePlayerExpanded: (value: boolean) => void
  setMobileQueueOpen: (value: boolean) => void
  setMobileSearchTab: (value: 'songs' | 'albums' | 'artists') => void
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
      desktopSidebarCollapsed: false,
      desktopQueueCollapsed: false,
      mobileSidebarOpen: false,
      mobilePlayerExpanded: false,
      mobileQueueOpen: false,
      mobileSearchTab: 'songs',
      setQueuePanelOpen: (value) => set({ queuePanelOpen: value }),
      toggleQueuePanel: () => set((state) => ({ queuePanelOpen: !state.queuePanelOpen })),
      setCompactMode: (value) => set({ compactMode: value }),
      setLibraryAlbumType: (libraryAlbumType) => set({ libraryAlbumType }),
      setPlaylistViewMode: (playlistViewMode) => set({ playlistViewMode }),
      openLyricsPanel: (song) => set({ lyricsPanelOpen: true, lyricsTargetSong: song ?? null }),
      closeLyricsPanel: () => set({ lyricsPanelOpen: false, lyricsTargetSong: null }),
      setStreamQualityWarning: (streamQualityWarning) => set({ streamQualityWarning }),
      setDesktopSidebarCollapsed: (desktopSidebarCollapsed) => set({ desktopSidebarCollapsed }),
      setDesktopQueueCollapsed: (desktopQueueCollapsed) => set({ desktopQueueCollapsed }),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
      openSidebar: () => set({ mobileSidebarOpen: true }),
      closeSidebar: () => set({ mobileSidebarOpen: false }),
      toggleSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setMobilePlayerExpanded: (mobilePlayerExpanded) => set({ mobilePlayerExpanded }),
      setMobileQueueOpen: (mobileQueueOpen) => set({ mobileQueueOpen }),
      setMobileSearchTab: (mobileSearchTab) => set({ mobileSearchTab }),
    }),
    {
      name: 'navi-ui',
      partialize: (state) => ({
        queuePanelOpen: state.queuePanelOpen,
        compactMode: state.compactMode,
        libraryAlbumType: state.libraryAlbumType,
        playlistViewMode: state.playlistViewMode,
        lyricsPanelOpen: state.lyricsPanelOpen,
        desktopSidebarCollapsed: state.desktopSidebarCollapsed,
        desktopQueueCollapsed: state.desktopQueueCollapsed,
        mobilePlayerExpanded: state.mobilePlayerExpanded,
        mobileSearchTab: state.mobileSearchTab,
      }),
    },
  ),
)
