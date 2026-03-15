import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'

import type { QueueItem } from '@/api/types'
import { formatDuration } from '@/utils/format'

interface QueueListProps {
  queue: QueueItem[]
  currentTrackId: string | null
  onSelect: (index: number) => void
  onRemove: (queueId: string) => void
  onMove: (from: number, to: number) => void
}

interface QueueRowProps {
  item: QueueItem
  index: number
  queueLength: number
  active: boolean
  onSelect: (index: number) => void
  onRemove: (queueId: string) => void
  onMove: (from: number, to: number) => void
}

const QueueRow = ({ item, index, queueLength, active, onSelect, onRemove, onMove }: QueueRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.queueId })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[22px_1fr_auto_auto] items-center gap-2 border px-2 py-1 text-xs ${
        active ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent' : 'border-terminal-text/20'
      }`}
    >
      <button className="cursor-grab text-terminal-muted" type="button" aria-label={`Drag ${item.track.title}`} {...attributes} {...listeners}>
        ::
      </button>
      <Link
        to={`/song/${item.track.id}`}
        className="min-h-11 truncate text-left focus:outline-none focus:ring-2 focus:ring-terminal-green"
        aria-label={`Open song ${item.track.title}`}
      >
        {item.track.title}
      </Link>
      <span className="text-terminal-muted">{formatDuration(item.track.duration ?? 0)}</span>
      <div className="flex items-center gap-1">
        <button
          className="terminal-button min-h-11 px-1 py-0"
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Play ${item.track.title}`}
        >
          play
        </button>
        <button className="terminal-button min-h-11 px-1 py-0" type="button" onClick={() => onMove(index, Math.max(0, index - 1))}>
          up
        </button>
        <button
          className="terminal-button min-h-11 px-1 py-0"
          type="button"
          onClick={() => onMove(index, Math.min(index + 1, queueLength - 1))}
        >
          dn
        </button>
        <button className="terminal-button min-h-11 px-1 py-0" type="button" onClick={() => onRemove(item.queueId)}>
          x
        </button>
      </div>
    </div>
  )
}

export const QueueList = ({ queue, currentTrackId, onSelect, onRemove, onMove }: QueueListProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return
        const oldIndex = queue.findIndex((item) => item.queueId === active.id)
        const newIndex = queue.findIndex((item) => item.queueId === over.id)
        if (oldIndex >= 0 && newIndex >= 0) {
          onMove(oldIndex, newIndex)
        }
      }}
    >
      <SortableContext items={queue.map((item) => item.queueId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {queue.map((item, index) => (
            <QueueRow
              key={item.queueId}
              item={item}
              index={index}
              queueLength={queue.length}
              active={item.track.id === currentTrackId}
              onSelect={onSelect}
              onRemove={onRemove}
              onMove={onMove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
