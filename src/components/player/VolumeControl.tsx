interface VolumeControlProps {
  volume: number
  onChange: (value: number) => void
}

export const VolumeControl = ({ volume, onChange }: VolumeControlProps) => (
  <div className="grid w-36 grid-cols-[auto_1fr] items-center gap-2 text-xs">
    <span className="text-terminal-muted">vol</span>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-1 cursor-pointer appearance-none bg-terminal-text/30 accent-[#00ff9c]"
    />
  </div>
)
