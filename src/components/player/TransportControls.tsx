import { Repeat, Shuffle, SkipBack, SkipForward, Play, Pause } from 'lucide-react'

import type { RepeatMode } from '@/api/types'

interface TransportControlsProps {
  isPlaying: boolean
  shuffle: boolean
  repeat: RepeatMode
  onTogglePlay: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleShuffle: () => void
  onCycleRepeat: () => void
}

export const TransportControls = ({
  isPlaying,
  shuffle,
  repeat,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
}: TransportControlsProps) => (
  <div className="flex items-center gap-2">
    <button className={`terminal-button min-h-11 ${shuffle ? 'text-terminal-accent' : ''}`} type="button" onClick={onToggleShuffle} aria-label="Toggle shuffle">
      <Shuffle size={14} />
    </button>
    <button className="terminal-button min-h-11" type="button" onClick={onPrevious} aria-label="Previous track">
      <SkipBack size={14} />
    </button>
    <button className="terminal-button min-h-11" type="button" onClick={onTogglePlay} aria-label="Toggle playback">
      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
    </button>
    <button className="terminal-button min-h-11" type="button" onClick={onNext} aria-label="Next track">
      <SkipForward size={14} />
    </button>
    <button
      className={`terminal-button min-h-11 ${repeat !== 'off' ? 'text-terminal-accent' : ''}`}
      type="button"
      onClick={onCycleRepeat}
      aria-label="Cycle repeat mode"
    >
      <Repeat size={14} />
      <span className="text-[10px]">{repeat}</span>
    </button>
  </div>
)
