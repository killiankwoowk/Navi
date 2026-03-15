import { useRef } from 'react'
import { ChevronDown, ListMusic, MessageSquareText } from 'lucide-react'

import type { RepeatMode, Song } from '@/api/types'

import { CoverArtImage } from '@/components/common/CoverArtImage'
import { ProgressBar } from '@/components/player/ProgressBar'
import { TransportControls } from '@/components/player/TransportControls'

interface FullPlayerProps {
  open: boolean
  track: Song | null
  coverUrl?: string
  isPlaying: boolean
  shuffle: boolean
  repeat: RepeatMode
  progress: number
  duration: number
  queueCount: number
  scrobbleCount: number
  onClose: () => void
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleShuffle: () => void
  onCycleRepeat: () => void
  onSeek: (value: number) => void
  onToggleLyrics: () => void
  onOpenQueue: () => void
}

export const FullPlayer = ({
  open,
  track,
  coverUrl,
  isPlaying,
  shuffle,
  repeat,
  progress,
  duration,
  queueCount,
  scrobbleCount,
  onClose,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onSeek,
  onToggleLyrics,
  onOpenQueue,
}: FullPlayerProps) => {
  const touchStartYRef = useRef<number | null>(null)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 p-4 md:hidden"
      onTouchStart={(event) => {
        touchStartYRef.current = event.touches[0]?.clientY ?? null
      }}
      onTouchEnd={(event) => {
        const startY = touchStartYRef.current
        const endY = event.changedTouches[0]?.clientY
        touchStartYRef.current = null
        if (typeof startY !== 'number' || typeof endY !== 'number') return
        if (endY - startY > 80) onClose()
      }}
    >
      <div className="flex h-full flex-col rounded border border-nothing-700 bg-nothing-800 p-3 text-nothing-100">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.14em] text-nothing-300">Now Playing</span>
          <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onClose} aria-label="Minimize player">
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="mt-4 flex-1 space-y-4 overflow-auto">
          <CoverArtImage
            src={coverUrl}
            alt={track?.title ?? 'cover art'}
            className="mx-auto w-full max-w-sm overflow-hidden border border-nothing-700"
            imageClassName="aspect-square"
          />
          <div className="text-center">
            <h2 className="m-0 truncate text-lg text-nothing-100">{track?.title ?? 'No track selected'}</h2>
            <p className="m-0 truncate text-sm text-nothing-300">{track?.artist ?? 'Unknown artist'}</p>
          </div>
          <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-[11px] text-nothing-300">
              <span className="border border-nothing-500 px-1 uppercase tracking-[0.14em] text-accent">last.fm</span>
              <span className="text-nothing-100">{scrobbleCount}</span>
            </div>
          </div>
          <div className="flex justify-center">
            <TransportControls
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeat={repeat}
              onTogglePlay={onTogglePlay}
              onPrevious={onPrevious}
              onNext={onNext}
              onToggleShuffle={onToggleShuffle}
              onCycleRepeat={onCycleRepeat}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onToggleLyrics} aria-label="Toggle lyrics">
              <MessageSquareText size={14} />
              lyrics
            </button>
            <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onOpenQueue} aria-label="Open queue">
              <ListMusic size={14} />
              queue [{queueCount}]
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
