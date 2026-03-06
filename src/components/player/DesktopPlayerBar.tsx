import { ListMusic, MessageSquareText } from 'lucide-react'

import type { AudioQuality, RepeatMode, Song, SleepTimerDefault } from '@/api/types'

import { NowPlaying } from './NowPlaying'
import { ProgressBar } from './ProgressBar'
import { QualityControl } from './QualityControl'
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
  audioQuality: AudioQuality
  defaultSleepTimer: SleepTimerDefault
  queueActive: boolean
  lyricsActive: boolean
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleShuffle: () => void
  onCycleRepeat: () => void
  onSeek: (value: number) => void
  onVolumeChange: (value: number) => void
  onQualityChange: (quality: AudioQuality) => void
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
  audioQuality,
  defaultSleepTimer,
  queueActive,
  lyricsActive,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onSeek,
  onVolumeChange,
  onQualityChange,
  onSetSleepTimer,
  onCancelSleepTimer,
  sleepEndsAt,
  sleepDurationMinutes,
  onToggleLyrics,
  onToggleQueue,
  warningMessage,
}: DesktopPlayerBarProps) => (
  <footer className="terminal-panel sticky bottom-0 mx-3 mb-3 mt-3 p-3">
    <div className="grid gap-3 lg:grid-cols-[1.2fr_2fr_1fr] lg:items-center">
      <NowPlaying track={track} coverUrl={coverUrl} />
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
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
          <div className="flex items-center gap-2">
            <QualityControl value={audioQuality} onChange={onQualityChange} compact />
            <button
              className={`terminal-button min-h-11 px-2 py-1 ${lyricsActive ? 'border-terminal-accent text-terminal-accent' : ''}`}
              type="button"
              onClick={onToggleLyrics}
              aria-label="Toggle lyrics panel"
            >
              <MessageSquareText size={14} />
              lyrics
            </button>
            <button
              className={`terminal-button min-h-11 px-2 py-1 ${queueActive ? 'border-terminal-accent text-terminal-accent' : ''}`}
              type="button"
              onClick={onToggleQueue}
              aria-label="Toggle queue panel"
            >
              <ListMusic size={14} />
              queue
              <span className="rounded-sm border border-terminal-text/40 px-1 text-[10px]">{queueLength}</span>
            </button>
            <VolumeControl volume={volume} onChange={onVolumeChange} />
          </div>
        </div>
        <ProgressBar progress={progress} duration={duration} onSeek={onSeek} />
        {warningMessage ? (
          <div className="border border-terminal-warn/70 bg-terminal-warn/10 px-2 py-1 text-[11px] text-terminal-warn">
            {warningMessage}
          </div>
        ) : null}
      </div>
      <div className="space-y-2 text-right">
        <SleepTimerControl
          endsAt={sleepEndsAt}
          durationMinutes={sleepDurationMinutes}
          defaultDuration={defaultSleepTimer}
          onSetTimer={onSetSleepTimer}
          onCancel={onCancelSleepTimer}
        />
        <QualityControl value={audioQuality} onChange={onQualityChange} />
        <div className="text-xs text-terminal-muted">
          [{currentIndex + 1}/{queueLength || 0}] {track?.album ?? '--'}
        </div>
      </div>
    </div>
  </footer>
)

