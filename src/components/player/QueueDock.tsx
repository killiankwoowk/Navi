import { useMemo, useState } from 'react'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'

import { QueueList } from './QueueList'

export const QueueDock = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const playIndex = usePlayerStore((state) => state.playIndex)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const reorderQueue = usePlayerStore((state) => state.reorderQueue)
  const clearQueue = usePlayerStore((state) => state.clearQueue)
  const setDesktopQueueCollapsed = useUiStore((state) => state.setDesktopQueueCollapsed)
  const [isSaving, setIsSaving] = useState(false)
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const handleSaveQueue = async () => {
    if (!queue.length || !client) return
    const name = window.prompt('Playlist name for current queue?')
    if (!name) return
    setIsSaving(true)
    try {
      await client.createPlaylist(name, queue.map((item) => item.track.id))
    } finally {
      setIsSaving(false)
    }
  }

  const handleClearQueue = () => {
    if (!queue.length) return
    if (!window.confirm('Are you sure you want to clear the queue?')) return
    clearQueue()
  }

  return (
    <aside className="terminal-panel h-full min-h-0">
      <div className="terminal-heading flex flex-wrap items-center justify-between gap-2">
        <span>| Queue [{queue.length}]</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="terminal-button min-h-11 px-2 py-1"
            onClick={handleSaveQueue}
            disabled={!queue.length || isSaving}
            aria-label="Save queue as playlist"
          >
            {isSaving ? 'saving...' : 'save queue'}
          </button>
          <button
            type="button"
            className="terminal-button min-h-11 px-2 py-1"
            onClick={handleClearQueue}
            disabled={!queue.length}
            aria-label="Clear queue"
          >
            clear
          </button>
          <button
            type="button"
            className="terminal-button min-h-11 px-2 py-1"
            onClick={() => setDesktopQueueCollapsed(true)}
            aria-label="Collapse queue dock"
          >
            hide
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-48px)] overflow-auto p-2 pb-[calc(var(--footer-height)+env(safe-area-inset-bottom))]">
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
