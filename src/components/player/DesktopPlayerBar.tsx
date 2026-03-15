import { ListMusic, MessageSquareText } from 'lucide-react'

import type { RepeatMode, Song, SleepTimerDefault } from '@/api/types'

import { NowPlaying } from './NowPlaying'
import { ProgressBar } from './ProgressBar'
import { TransportControls } from './TransportControls'
import { VolumeControl } from './VolumeControl'
import { SleepTimerControl } from '@/components/sleep/SleepTimerControl'

interface DesktopPlayerBarProps {
  track: Song | null
  coverUrl?: string
  queueLength: number
  currentIndex: number
  isPlaying: boolean
  shuffle: boolean
  repeat: RepeatMode
  progress: number
  duration: number
  volume: number
  defaultSleepTimer: SleepTimerDefault
  queueActive: boolean
  lyricsActive: boolean
  scrobbleCount: number
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleShuffle: () => void
  onCycleRepeat: () => void
  onSeek: (value: number) => void
  onVolumeChange: (value: number) => void
  onSetSleepTimer: (minutes: number) => void
  onCancelSleepTimer: () => void
  sleepEndsAt: number | null
  sleepDurationMinutes: number | null
  onToggleLyrics: () => void
  onToggleQueue: () => void
  warningMessage: string | null
}

export const DesktopPlayerBar = ({
  track,
  coverUrl,
  queueLength,
  currentIndex,
  isPlaying,
  shuffle,
  repeat,
  progress,
  duration,
  volume,
  defaultSleepTimer,
  queueActive,
  lyricsActive,
  scrobbleCount,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onSeek,
  onVolumeChange,
  onSetSleepTimer,
  onCancelSleepTimer,
  sleepEndsAt,
  sleepDurationMinutes,
  onToggleLyrics,
  onToggleQueue,
  warningMessage,
}: DesktopPlayerBarProps) => (
  <footer className="fixed bottom-0 left-0 right-0 z-30 mx-2 mb-2 rounded border border-nothing-700 bg-nothing-800 p-2 text-nothing-100 sm:mx-3 sm:mb-3 sm:p-3">
    <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.05fr)_minmax(0,1.8fr)_minmax(240px,0.95fr)] lg:items-center">
      <NowPlaying track={track} coverUrl={coverUrl} />
      <div className="min-w-0 space-y-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`terminal-button min-h-11 px-2 py-1 ${lyricsActive ? 'border-accent text-accent' : ''}`}
              type="button"
              onClick={onToggleLyrics}
              aria-label="Toggle lyrics panel"
            >
              <MessageSquareText size={14} />
              lyrics
            </button>
            <button
              className={`terminal-button min-h-11 px-2 py-1 ${queueActive ? 'border-accent text-accent' : ''}`}
              type="button"
              onClick={onToggleQueue}
              aria-label="Toggle queue panel"
            >
              <ListMusic size={14} />
              queue
              <span className="rounded-sm border border-nothing-500 px-1 text-[10px]">{queueLength}</span>
            </button>
          </div>
        </div>
        <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
        <div className="flex flex-wrap items-center justify-between gap-2 lg:hidden">
          <SleepTimerControl
            endsAt={sleepEndsAt}
            durationMinutes={sleepDurationMinutes}
            defaultDuration={defaultSleepTimer}
            onSetTimer={onSetSleepTimer}
            onCancel={onCancelSleepTimer}
          />
          <VolumeControl volume={volume} onChange={onVolumeChange} />
        </div>
        {warningMessage ? (
          <div className="border border-nothing-400/70 bg-nothing-700/20 px-2 py-1 text-[11px] text-nothing-100">
            {warningMessage}
          </div>
        ) : null}
      </div>
      <div className="hidden min-w-0 flex-col gap-2 lg:flex lg:items-end lg:text-right">
        <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
          <SleepTimerControl
            endsAt={sleepEndsAt}
            durationMinutes={sleepDurationMinutes}
            defaultDuration={defaultSleepTimer}
            onSetTimer={onSetSleepTimer}
            onCancel={onCancelSleepTimer}
          />
          <VolumeControl volume={volume} onChange={onVolumeChange} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-nothing-300 lg:justify-end">
          <span className="border border-nothing-500 px-1 uppercase tracking-[0.14em] text-accent">last.fm</span>
          <span className="text-nothing-100">{scrobbleCount}</span>
        </div>
        <div className="text-xs text-nothing-300">
          [{currentIndex + 1}/{queueLength || 0}] {track?.album ?? '--'}
        </div>
      </div>
    </div>
  </footer>
)
