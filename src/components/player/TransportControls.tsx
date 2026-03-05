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
    <button className={`terminal-button ${shuffle ? 'text-terminal-accent' : ''}`} type="button" onClick={onToggleShuffle}>
      <Shuffle size={14} />
    </button>
    <button className="terminal-button" type="button" onClick={onPrevious}>
      <SkipBack size={14} />
    </button>
    <button className="terminal-button" type="button" onClick={onTogglePlay}>
      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
    </button>
    <button className="terminal-button" type="button" onClick={onNext}>
      <SkipForward size={14} />
    </button>
    <button className={`terminal-button ${repeat !== 'off' ? 'text-terminal-accent' : ''}`} type="button" onClick={onCycleRepeat}>
      <Repeat size={14} />
      <span className="text-[10px]">{repeat}</span>
    </button>
  </div>
)
