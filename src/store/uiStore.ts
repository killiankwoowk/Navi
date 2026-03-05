import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiStore {
  queuePanelOpen: boolean
  compactMode: boolean
  libraryAlbumType: string
  setQueuePanelOpen: (value: boolean) => void
  toggleQueuePanel: () => void
  setCompactMode: (value: boolean) => void
  setLibraryAlbumType: (type: string) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      queuePanelOpen: false,
      compactMode: false,
      libraryAlbumType: 'alphabeticalByName',
      setQueuePanelOpen: (value) => set({ queuePanelOpen: value }),
      toggleQueuePanel: () => set((state) => ({ queuePanelOpen: !state.queuePanelOpen })),
      setCompactMode: (value) => set({ compactMode: value }),
      setLibraryAlbumType: (libraryAlbumType) => set({ libraryAlbumType }),
    }),
    {
      name: 'navi-ui',
      partialize: (state) => ({
        queuePanelOpen: state.queuePanelOpen,
        compactMode: state.compactMode,
        libraryAlbumType: state.libraryAlbumType,
      }),
    },
  ),
)
