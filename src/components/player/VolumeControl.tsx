interface VolumeControlProps {
  volume: number
  onChange: (value: number) => void
}

export const VolumeControl = ({ volume, onChange }: VolumeControlProps) => (
  <div className="grid w-full max-w-[11rem] grid-cols-[auto_1fr] items-center gap-2 text-xs sm:w-36">
    <span className="text-nothing-300">vol</span>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={(event) => onChange(Number(event.target.value))}
      className="h-2 cursor-pointer appearance-none bg-nothing-600 accent-accent"
    />
  </div>
)
