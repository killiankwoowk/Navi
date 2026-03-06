import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'

import { QueueList } from './QueueList'

export const QueueDock = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const playIndex = usePlayerStore((state) => state.playIndex)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const reorderQueue = usePlayerStore((state) => state.reorderQueue)
  const setDesktopQueueCollapsed = useUiStore((state) => state.setDesktopQueueCollapsed)

  return (
    <aside className="terminal-panel h-full min-h-0">
      <div className="terminal-heading flex items-center justify-between">
        <span>| Queue [{queue.length}]</span>
        <button
          type="button"
          className="terminal-button min-h-11 px-2 py-1"
          onClick={() => setDesktopQueueCollapsed(true)}
          aria-label="Collapse queue dock"
        >
          hide
        </button>
      </div>
      <div className="h-[calc(100%-48px)] overflow-auto p-2">
        <QueueList
          queue={queue}
          currentTrackId={currentTrackId}
          onSelect={playIndex}
          onRemove={removeFromQueue}
          onMove={reorderQueue}
        />
      </div>
    </aside>
  )
}

