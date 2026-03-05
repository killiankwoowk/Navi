import type { AudioQuality } from '@/api/types'

const QUALITY_OPTIONS: Array<{ value: AudioQuality; label: string; hint: string }> = [
  { value: 'auto', label: 'Auto', hint: 'Default stream' },
  { value: 'high', label: 'High', hint: '320+ kbps' },
  { value: 'medium', label: 'Medium', hint: '192 kbps' },
  { value: 'low', label: 'Low', hint: '128 kbps' },
]

interface QualityControlProps {
  value: AudioQuality
  onChange: (quality: AudioQuality) => void
  compact?: boolean
}

export const QualityControl = ({ value, onChange, compact }: QualityControlProps) => {
  if (compact) {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AudioQuality)}
        className="h-7 border border-terminal-text/35 bg-black/40 px-2 text-[11px] uppercase tracking-[0.12em] text-terminal-text"
        aria-label="Audio quality"
      >
        {QUALITY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-terminal-muted">quality</span>
      {QUALITY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`terminal-button px-1 py-0.5 ${
            option.value === value ? 'border-terminal-accent text-terminal-accent' : ''
          }`}
          onClick={() => onChange(option.value)}
          aria-label={`Set audio quality ${option.hint}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
