import { useMemo, useRef, useState } from 'react'

import { DragHandle } from '@/components/common/DragHandle'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { usePlayerStore } from '@/store/playerStore'

import { QueueList } from './QueueList'

interface QueueDrawerProps {
  open: boolean
  onClose: () => void
}

export const QueueDrawer = ({ open, onClose }: QueueDrawerProps) => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const playIndex = usePlayerStore((state) => state.playIndex)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const reorderQueue = usePlayerStore((state) => state.reorderQueue)
  const clearQueue = usePlayerStore((state) => state.clearQueue)
  const [isSaving, setIsSaving] = useState(false)
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const touchStartYRef = useRef<number | null>(null)

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    initialFocusRef: closeButtonRef,
    onClose,
  })

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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Queue drawer">
      <button className="absolute inset-0 bg-black/70" type="button" onClick={onClose} aria-label="Close queue drawer overlay" />
      <aside
        ref={panelRef}
        className="terminal-panel absolute inset-x-0 bottom-0 top-16 flex flex-col md:inset-y-8 md:left-auto md:right-3 md:w-[min(520px,95vw)]"
        onTouchStart={(event) => {
          touchStartYRef.current = event.touches[0]?.clientY ?? null
        }}
        onTouchEnd={(event) => {
          const startY = touchStartYRef.current
          const endY = event.changedTouches[0]?.clientY
          touchStartYRef.current = null
          if (typeof startY !== 'number' || typeof endY !== 'number') return
          if (endY - startY > 80) onClose()
        }}
      >
        <DragHandle />
        <div className="terminal-heading flex items-center justify-between">
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
              ref={closeButtonRef}
              className="terminal-button min-h-11 px-2 py-1"
              type="button"
              onClick={onClose}
              aria-label="Close queue drawer"
            >
              close
            </button>
          </div>
        </div>
        <div className="overflow-auto p-2 pb-[calc(var(--footer-height)+env(safe-area-inset-bottom))]">
          <QueueList
            queue={queue}
            currentTrackId={currentTrackId}
            onSelect={playIndex}
            onRemove={removeFromQueue}
            onMove={reorderQueue}
          />
        </div>
      </aside>
    </div>
  )
}
