import { ChevronUp, ListMusic, Pause, Play } from 'lucide-react'

import type { Song } from '@/api/types'

interface MiniPlayerProps {
  track: Song | null
  isPlaying: boolean
  queueCount: number
  onTogglePlay: () => void
  onExpand: () => void
  onOpenQueue: () => void
}

export const MiniPlayer = ({ track, isPlaying, queueCount, onTogglePlay, onExpand, onOpenQueue }: MiniPlayerProps) => (
  <div className="terminal-panel fixed bottom-[calc(4.3rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 mx-2 px-3 py-2 md:hidden">
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <button
        type="button"
        onClick={onExpand}
        className="min-h-11 truncate text-left focus:outline-none focus:ring-2 focus:ring-terminal-green"
        aria-label="Expand player"
      >
        <span className="truncate text-sm text-terminal-text">{track?.title ?? 'No track selected'}</span>
        <span className="block truncate text-[11px] text-terminal-muted">{track?.artist ?? 'Unknown artist'}</span>
      </button>
      <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onTogglePlay} aria-label="Toggle playback">
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onOpenQueue} aria-label="Open queue">
        <ListMusic size={14} />
        <span className="text-[10px]">{queueCount}</span>
      </button>
    </div>
    <button
      type="button"
      className="absolute -top-3 right-3 rounded-full border border-terminal-text/30 bg-terminal-panel p-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
      onClick={onExpand}
      aria-label="Expand player"
    >
      <ChevronUp size={12} />
    </button>
  </div>
)
