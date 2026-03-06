import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { PlayerState, RepeatMode, Song } from '@/api/types'
import {
  buildShuffleOrder,
  makeQueueItems,
  reorderQueueItems,
  resolveCurrentIndex,
  resolveNextIndex,
  resolvePreviousIndex,
} from '@/player/queue'

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
  currentTrackId: null,
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

const withDerivedIndex = (queue: PlayerState['queue'], currentTrackId: string | null) => {
  const currentIndex = resolveCurrentIndex(queue, currentTrackId)
  return { currentTrackId, currentIndex }
}

const resolvePlayableAnchor = (queue: PlayerState['queue'], currentTrackId: string | null) => {
  let resolvedTrackId = currentTrackId
  let currentIndex = resolveCurrentIndex(queue, resolvedTrackId)

  if (queue.length > 0 && currentIndex < 0) {
    resolvedTrackId = queue[0].track.id
    currentIndex = 0
  }

  return { currentTrackId: resolvedTrackId, currentIndex }
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setQueue: (tracks, startIndex = 0, shouldPlay = true) => {
        const state = get()
        const queue = makeQueueItems(tracks)
        const clampedIndex = queue.length ? Math.max(0, Math.min(startIndex, queue.length - 1)) : -1
        const currentTrackId = clampedIndex >= 0 ? queue[clampedIndex].track.id : null
        const shuffleOrder = state.shuffle && clampedIndex >= 0 ? buildShuffleOrder(queue.length, clampedIndex) : []

        set({
          queue,
          currentTrackId,
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
        const { currentTrackId, currentIndex } = resolvePlayableAnchor(queue, state.currentTrackId)
        const shuffleOrder = state.shuffle && currentIndex >= 0 ? buildShuffleOrder(queue.length, currentIndex) : []

        set({
          queue,
          currentTrackId,
          currentIndex,
          shuffleOrder,
        })
      },
      removeFromQueue: (queueId) => {
        const state = get()
        const removeIndex = state.queue.findIndex((item) => item.queueId === queueId)
        if (removeIndex < 0) return

        const removed = state.queue[removeIndex]
        const nextQueue = state.queue.filter((item) => item.queueId !== queueId)

        if (nextQueue.length === 0) {
          set({
            queue: [],
            currentTrackId: null,
            currentIndex: -1,
            isPlaying: false,
            progress: 0,
            duration: 0,
            shuffleOrder: [],
          })
          return
        }

        let nextTrackId = state.currentTrackId
        if (removed.track.id === state.currentTrackId) {
          const fallbackIndex = Math.min(removeIndex, nextQueue.length - 1)
          nextTrackId = nextQueue[Math.max(0, fallbackIndex)]?.track.id ?? null
        }

        const { currentTrackId, currentIndex } = resolvePlayableAnchor(nextQueue, nextTrackId)
        const shuffleOrder = state.shuffle && currentIndex >= 0 ? buildShuffleOrder(nextQueue.length, currentIndex) : []

        set({
          queue: nextQueue,
          currentTrackId,
          currentIndex,
          isPlaying: currentTrackId ? state.isPlaying : false,
          shuffleOrder,
          progress: currentTrackId ? state.progress : 0,
          duration: currentTrackId ? state.duration : 0,
        })
      },
      reorderQueue: (fromIndex, toIndex) => {
        const state = get()
        if (fromIndex === toIndex) return

        const queue = reorderQueueItems(state.queue, fromIndex, toIndex)
        const { currentTrackId, currentIndex } = resolvePlayableAnchor(queue, state.currentTrackId)
        const shuffleOrder = state.shuffle && currentIndex >= 0 ? buildShuffleOrder(queue.length, currentIndex) : []

        set({
          queue,
          currentTrackId,
          currentIndex,
          shuffleOrder,
        })
      },
      clearQueue: () =>
        set((state) => ({
          ...initialState,
          volume: state.volume,
        })),
      playIndex: (index) => {
        const state = get()
        if (index < 0 || index >= state.queue.length) return
        const currentTrackId = state.queue[index].track.id
        const shuffleOrder = state.shuffle ? buildShuffleOrder(state.queue.length, index) : state.shuffleOrder
        set({
          currentTrackId,
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
        const anchor = resolvePlayableAnchor(state.queue, state.currentTrackId)
        if (anchor.currentIndex < 0) {
          set({ isPlaying: false })
          return
        }

        const nextIndex = resolveNextIndex(
          anchor.currentIndex,
          state.queue.length,
          state.repeat,
          state.shuffle,
          state.shuffleOrder,
        )

        if (nextIndex === -1) {
          set({ isPlaying: false })
          return
        }

        const currentTrackId = state.queue[nextIndex]?.track.id ?? null
        const { currentIndex } = withDerivedIndex(state.queue, currentTrackId)
        set({ currentTrackId, currentIndex, progress: 0, duration: 0, isPlaying: true })
      },
      previous: (currentTime = 0) => {
        const state = get()

        if (currentTime > 5) {
          set({ progress: 0 })
          return
        }

        const anchor = resolvePlayableAnchor(state.queue, state.currentTrackId)
        if (anchor.currentIndex < 0) {
          set({ isPlaying: false })
          return
        }

        const prevIndex = resolvePreviousIndex(
          anchor.currentIndex,
          state.queue.length,
          state.repeat,
          state.shuffle,
          state.shuffleOrder,
        )

        const currentTrackId = state.queue[prevIndex]?.track.id ?? null
        const { currentIndex } = withDerivedIndex(state.queue, currentTrackId)
        set({ currentTrackId, currentIndex, progress: 0, duration: 0, isPlaying: true })
      },
      toggleShuffle: () => {
        const state = get()
        const nextShuffle = !state.shuffle
        const anchor = resolvePlayableAnchor(state.queue, state.currentTrackId)
        const shuffleOrder =
          nextShuffle && anchor.currentIndex >= 0 ? buildShuffleOrder(state.queue.length, anchor.currentIndex) : []

        set({
          shuffle: nextShuffle,
          currentTrackId: anchor.currentTrackId,
          currentIndex: anchor.currentIndex,
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
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return initialState
        }

        const state = persistedState as Partial<PlayerState> & { queue?: PlayerState['queue'] }
        const queue = Array.isArray(state.queue) ? state.queue : []
        const hasTrackId = typeof state.currentTrackId === 'string' || state.currentTrackId === null
        const legacyIndex = typeof state.currentIndex === 'number' ? state.currentIndex : -1

        const currentTrackId = hasTrackId
          ? (state.currentTrackId ?? null)
          : queue[legacyIndex >= 0 ? legacyIndex : 0]?.track.id ?? null
        const currentIndex = resolveCurrentIndex(queue, currentTrackId)

        return {
          ...initialState,
          ...state,
          queue,
          currentTrackId,
          currentIndex,
        }
      },
      partialize: (state) => ({
        queue: state.queue,
        currentTrackId: state.currentTrackId,
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
