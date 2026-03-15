import { useMemo, useState } from 'react'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { usePlayerStore } from '@/store/playerStore'
import { formatDuration } from '@/utils/format'

interface QueueItemRowProps {
  id: string
  title: string
  artist: string
  duration: number
  isActive: boolean
  onRemove: () => void
  onPlay: () => void
}

const QueueItemRow = ({ id, title, artist, duration, isActive, onRemove, onPlay }: QueueItemRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 p-2 border-l-2 ${
        isActive ? 'border-accent bg-nothing-700' : 'border-transparent hover:bg-nothing-800'
      }`}
    >
      <button
        type="button"
        className="text-nothing-300 cursor-grab"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${title}`}
      >
        ::
      </button>
      <div className="flex-1 min-w-0">
        <button
          type="button"
          className="block w-full text-left text-nothing-100 truncate focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={onPlay}
        >
          {title}
        </button>
        <p className="text-xs text-nothing-300 truncate">{artist}</p>
      </div>
      <span className="text-xs text-nothing-300 font-mono">{formatDuration(duration)}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-nothing-300 hover:text-nothing-100 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={`Remove ${title} from queue`}
      >
        x
      </button>
    </li>
  )
}

export const QueueView = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const playIndex = usePlayerStore((state) => state.playIndex)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const reorderQueue = usePlayerStore((state) => state.reorderQueue)
  const clearQueue = usePlayerStore((state) => state.clearQueue)
  const [isSaving, setIsSaving] = useState(false)
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

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
    <aside className="w-80 bg-nothing-900 border-l border-nothing-700 flex flex-col">
      <div className="p-4 border-b border-nothing-700 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-nothing-100">Up Next</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-xs text-nothing-100 border border-nothing-600 px-2 py-1 rounded-sm hover:bg-nothing-700"
            onClick={handleSaveQueue}
            disabled={!queue.length || isSaving}
          >
            {isSaving ? 'saving...' : 'save'}
          </button>
          <button
            type="button"
            className="text-xs text-nothing-100 border border-nothing-600 px-2 py-1 rounded-sm hover:bg-nothing-700"
            onClick={handleClearQueue}
            disabled={!queue.length}
          >
            clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return
            const oldIndex = queue.findIndex((item) => item.queueId === active.id)
            const newIndex = queue.findIndex((item) => item.queueId === over.id)
            if (oldIndex >= 0 && newIndex >= 0) {
              reorderQueue(oldIndex, newIndex)
            }
          }}
        >
          <SortableContext items={queue.map((item) => item.queueId)} strategy={verticalListSortingStrategy}>
            <ul className="p-2 space-y-1">
              {queue.map((item, index) => (
                <QueueItemRow
                  key={item.queueId}
                  id={item.queueId}
                  title={item.track.title}
                  artist={item.track.artist ?? 'Unknown Artist'}
                  duration={item.track.duration ?? 0}
                  isActive={item.track.id === currentTrackId}
                  onRemove={() => removeFromQueue(item.queueId)}
                  onPlay={() => playIndex(index)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  )
}
