import { ListMusic } from 'lucide-react'

interface QueueFabProps {
  count: number
  onClick: () => void
}

export const QueueFab = ({ count, onClick }: QueueFabProps) => (
  <button
    type="button"
    className="terminal-button fixed bottom-40 right-3 z-40 hidden h-14 w-14 items-center justify-center rounded-full p-0 md:flex lg:hidden"
    onClick={onClick}
    aria-label="Open queue drawer"
  >
    <ListMusic size={18} />
    <span className="absolute -right-1 -top-1 rounded-full border border-terminal-accent bg-terminal-panel px-1 text-[10px] text-terminal-accent">
      {count}
    </span>
  </button>
)
