import { useMemo } from 'react'

import { usePlayerStore } from '@/store/playerStore'

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

export const Scrubber = () => {
  const progress = usePlayerStore((state) => state.progress)
  const duration = usePlayerStore((state) => state.duration)

  const percent = useMemo(() => (duration > 0 ? Math.min(100, (progress / duration) * 100) : 0), [duration, progress])

  return (
    <div className="w-full flex items-center gap-2">
      <span className="text-xs text-nothing-300 font-mono">{formatTime(progress)}</span>
      <div className="w-full bg-nothing-600 rounded-full h-1 group">
        <div className="bg-accent h-1 rounded-full relative" style={{ width: `${percent}%` }}>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100" />
        </div>
      </div>
      <span className="text-xs text-nothing-300 font-mono">{formatTime(duration)}</span>
    </div>
  )
}
