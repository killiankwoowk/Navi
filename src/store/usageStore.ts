import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Song, UsageEntry } from '@/api/types'

interface UsageStore {
  entries: Record<string, UsageEntry>
  incrementPlay: (song: Song) => void
  getTopPlayed: (limit: number) => UsageEntry[]
  getRecentlyPlayed: (limit: number) => UsageEntry[]
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set, get) => ({
      entries: {},
      incrementPlay: (song) => {
        set((state) => {
          const existing = state.entries[song.id]
          return {
            entries: {
              ...state.entries,
              [song.id]: {
                song,
                playCount: (existing?.playCount ?? 0) + 1,
                lastPlayedAt: Date.now(),
              },
            },
          }
        })
      },
      getTopPlayed: (limit) =>
        Object.values(get().entries)
          .sort((a, b) => b.playCount - a.playCount || b.lastPlayedAt - a.lastPlayedAt)
          .slice(0, limit),
      getRecentlyPlayed: (limit) =>
        Object.values(get().entries)
          .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
          .slice(0, limit),
    }),
    {
      name: 'navi-usage',
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
)
