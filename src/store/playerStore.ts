import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { PlayerState, RepeatMode, Song } from '@/api/types'
import { buildShuffleOrder, makeQueueItems, reorderQueueItems, resolveNextIndex, resolvePreviousIndex } from '@/player/queue'

interface PlayerActions {
  setQueue: (tracks: Song[], startIndex?: number, shouldPlay?: boolean) => void
  addToQueue: (tracks: Song[]) => void
  removeFromQueue: (queueId: string) => void
  reorderQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  playIndex: (index: number) => void
  setPlaying: (isPlaying: boolean) => void
  togglePlay: () => void
  next: () => void
  previous: (currentTime?: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
  setDuration: (duration: number) => void
  setSleepTimer: (durationMinutes: number | null) => void
  clearSleepTimer: () => void
  checkSleepTimer: () => boolean
}

type PlayerStore = PlayerState & PlayerActions

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  shuffle: false,
  repeat: 'off',
  volume: 0.8,
  progress: 0,
  duration: 0,
  shuffleOrder: [],
  sleepTimer: {
    endsAt: null,
    durationMinutes: null,
  },
}

const repeatCycle: RepeatMode[] = ['off', 'all', 'one']

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setQueue: (tracks, startIndex = 0, shouldPlay = true) => {
        const queue = makeQueueItems(tracks)
        const clampedIndex = queue.length ? Math.max(0, Math.min(startIndex, queue.length - 1)) : -1
        const shuffleOrder = get().shuffle && clampedIndex >= 0 ? buildShuffleOrder(queue.length, clampedIndex) : []

        set({
          queue,
          currentIndex: clampedIndex,
          isPlaying: shouldPlay && clampedIndex >= 0,
          progress: 0,
          duration: 0,
          shuffleOrder,
        })
      },
      addToQueue: (tracks) => {
        if (!tracks.length) return
        const state = get()
        const additions = makeQueueItems(tracks)
        const queue = [...state.queue, ...additions]
        const shuffleOrder = state.shuffle
          ? buildShuffleOrder(queue.length, state.currentIndex >= 0 ? state.currentIndex : 0)
          : []

        set({
          queue,
          currentIndex: state.currentIndex >= 0 ? state.currentIndex : 0,
          shuffleOrder,
        })
      },
      removeFromQueue: (queueId) => {
        const state = get()
        const nextQueue = state.queue.filter((item) => item.queueId !== queueId)
        const activeId = state.queue[state.currentIndex]?.queueId
        const nextIndex = nextQueue.findIndex((item) => item.queueId === activeId)
        const resolvedIndex = nextQueue.length ? Math.max(nextIndex, 0) : -1
        const shuffleOrder = state.shuffle && resolvedIndex >= 0 ? buildShuffleOrder(nextQueue.length, resolvedIndex) : []

        set({
          queue: nextQueue,
          currentIndex: resolvedIndex,
          isPlaying: resolvedIndex >= 0 ? state.isPlaying : false,
          shuffleOrder,
          progress: resolvedIndex >= 0 ? state.progress : 0,
          duration: resolvedIndex >= 0 ? state.duration : 0,
        })
      },
      reorderQueue: (fromIndex, toIndex) => {
        const state = get()
        if (fromIndex === toIndex) return

        const currentId = state.queue[state.currentIndex]?.queueId
        const queue = reorderQueueItems(state.queue, fromIndex, toIndex)
        const currentIndex = currentId ? queue.findIndex((item) => item.queueId === currentId) : -1
        const shuffleOrder = state.shuffle && currentIndex >= 0 ? buildShuffleOrder(queue.length, currentIndex) : []

        set({
          queue,
          currentIndex,
          shuffleOrder,
        })
      },
      clearQueue: () => set({ ...initialState, volume: get().volume }),
      playIndex: (index) => {
        const state = get()
        if (index < 0 || index >= state.queue.length) return
        const shuffleOrder = state.shuffle ? buildShuffleOrder(state.queue.length, index) : state.shuffleOrder
        set({
          currentIndex: index,
          isPlaying: true,
          progress: 0,
          duration: 0,
          shuffleOrder,
        })
      },
      setPlaying: (isPlaying) => set({ isPlaying }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      next: () => {
        const state = get()
        const nextIndex = resolveNextIndex(
          state.currentIndex,
          state.queue.length,
          state.repeat,
          state.shuffle,
          state.shuffleOrder,
        )

        if (nextIndex === -1) {
          set({ isPlaying: false })
          return
        }

        set({ currentIndex: nextIndex, progress: 0, duration: 0, isPlaying: true })
      },
      previous: (currentTime = 0) => {
        const state = get()

        if (currentTime > 5) {
          set({ progress: 0 })
          return
        }

        const prevIndex = resolvePreviousIndex(
          state.currentIndex,
          state.queue.length,
          state.repeat,
          state.shuffle,
          state.shuffleOrder,
        )

        set({ currentIndex: prevIndex, progress: 0, duration: 0, isPlaying: true })
      },
      toggleShuffle: () => {
        const state = get()
        const nextShuffle = !state.shuffle
        const shuffleOrder =
          nextShuffle && state.currentIndex >= 0 ? buildShuffleOrder(state.queue.length, state.currentIndex) : []

        set({
          shuffle: nextShuffle,
          shuffleOrder,
        })
      },
      cycleRepeat: () => {
        const state = get()
        const index = repeatCycle.indexOf(state.repeat)
        const repeat = repeatCycle[(index + 1) % repeatCycle.length]
        set({ repeat })
      },
      setVolume: (volume) => {
        set({ volume: Math.min(1, Math.max(0, volume)) })
      },
      setProgress: (progress) => {
        set({ progress })
      },
      setDuration: (duration) => {
        set({ duration })
      },
      setSleepTimer: (durationMinutes) => {
        if (!durationMinutes) {
          set({
            sleepTimer: {
              endsAt: null,
              durationMinutes: null,
            },
          })
          return
        }

        set({
          sleepTimer: {
            endsAt: Date.now() + durationMinutes * 60_000,
            durationMinutes,
          },
        })
      },
      clearSleepTimer: () => {
        set({
          sleepTimer: {
            endsAt: null,
            durationMinutes: null,
          },
        })
      },
      checkSleepTimer: () => {
        const { sleepTimer } = get()
        if (!sleepTimer.endsAt) return false
        if (Date.now() < sleepTimer.endsAt) return false
        set({
          isPlaying: false,
          sleepTimer: {
            endsAt: null,
            durationMinutes: null,
          },
        })
        return true
      },
    }),
    {
      name: 'navi-player',
      partialize: (state) => ({
        queue: state.queue,
        currentIndex: state.currentIndex,
        isPlaying: state.isPlaying,
        shuffle: state.shuffle,
        repeat: state.repeat,
        volume: state.volume,
        shuffleOrder: state.shuffleOrder,
        sleepTimer: state.sleepTimer,
      }),
    },
  ),
)
