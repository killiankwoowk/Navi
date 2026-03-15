import { formatDuration } from '@/utils/format'

interface ProgressBarProps {
  progress: number
  duration: number
  onSeek: (value: number) => void
}

export const ProgressBar = ({ progress, duration, onSeek }: ProgressBarProps) => (
  <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 text-xs md:text-sm">
    <span className="text-nothing-300">{formatDuration(progress)}</span>
    <input
      type="range"
      min={0}
      max={Math.max(1, duration)}
      value={Math.min(progress, duration || 0)}
      onChange={(event) => onSeek(Number(event.target.value))}
      className="h-2 w-full cursor-pointer appearance-none bg-nothing-600 accent-accent"
    />
    <span className="text-nothing-300">{formatDuration(duration)}</span>
  </div>
)
