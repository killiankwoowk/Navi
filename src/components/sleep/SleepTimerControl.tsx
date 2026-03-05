import { useEffect, useMemo, useState } from 'react'

import { SLEEP_TIMER_OPTIONS } from '@/utils/constants'

interface SleepTimerControlProps {
  endsAt: number | null
  durationMinutes: number | null
  onSetTimer: (minutes: number) => void
  onCancel: () => void
}

const formatRemaining = (ms: number): string => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const SleepTimerControl = ({ endsAt, durationMinutes, onSetTimer, onCancel }: SleepTimerControlProps) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const remaining = useMemo(() => (endsAt ? formatRemaining(endsAt - now) : null), [endsAt, now])

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-terminal-muted">sleep</span>
      {SLEEP_TIMER_OPTIONS.map((minutes) => (
        <button key={minutes} type="button" className="terminal-button px-1 py-0.5" onClick={() => onSetTimer(minutes)}>
          {minutes}
        </button>
      ))}
      {durationMinutes ? (
        <button type="button" className="terminal-button px-1 py-0.5 text-terminal-warn" onClick={onCancel}>
          cancel ({remaining})
        </button>
      ) : null}
    </div>
  )
}
