import { formatDuration } from '@/utils/format'

interface ProgressBarProps {
  progress: number
  duration: number
  onSeek: (value: number) => void
}

export const ProgressBar = ({ progress, duration, onSeek }: ProgressBarProps) => (
  <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 text-xs">
    <span className="text-terminal-muted">{formatDuration(progress)}</span>
    <input
      type="range"
      min={0}
      max={Math.max(1, duration)}
      value={Math.min(progress, duration || 0)}
      onChange={(event) => onSeek(Number(event.target.value))}
      className="h-1 w-full cursor-pointer appearance-none bg-terminal-text/30 accent-[#00e5ff]"
    />
    <span className="text-terminal-muted">{formatDuration(duration)}</span>
  </div>
)
