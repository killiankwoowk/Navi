import { CSS } from '@dnd-kit/utilities'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'

import type { QueueItem } from '@/api/types'
import { formatDuration } from '@/utils/format'

interface QueuePanelProps {
  queue: QueueItem[]
  currentIndex: number
  onSelect: (index: number) => void
  onRemove: (queueId: string) => void
  onMove: (from: number, to: number) => void
  onClose: () => void
}

interface RowProps {
  item: QueueItem
  index: number
  queueLength: number
  active: boolean
  onSelect: (index: number) => void
  onRemove: (queueId: string) => void
  onMove: (from: number, to: number) => void
}

const QueueRow = ({ item, index, queueLength, active, onSelect, onRemove, onMove }: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.queueId })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[20px_1fr_auto_auto] items-center gap-2 border px-2 py-1 text-xs ${
        active ? 'border-terminal-accent text-terminal-accent' : 'border-terminal-text/20'
      }`}
    >
      <button className="cursor-grab text-terminal-muted" type="button" {...attributes} {...listeners}>
        ::
      </button>
      <button className="truncate text-left" type="button" onClick={() => onSelect(index)}>
        {item.track.title}
      </button>
      <span className="text-terminal-muted">{formatDuration(item.track.duration ?? 0)}</span>
      <div className="flex items-center gap-1">
        <button className="terminal-button px-1 py-0" type="button" onClick={() => onMove(index, Math.max(0, index - 1))}>
          ↑
        </button>
        <button
          className="terminal-button px-1 py-0"
          type="button"
          onClick={() => onMove(index, Math.min(index + 1, queueLength - 1))}
        >
          ↓
        </button>
        <button className="terminal-button px-1 py-0" type="button" onClick={() => onRemove(item.queueId)}>
          x
        </button>
      </div>
    </div>
  )
}

export const QueuePanel = ({ queue, currentIndex, onSelect, onRemove, onMove, onClose }: QueuePanelProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  return (
    <aside className="terminal-panel fixed right-3 top-20 z-30 flex max-h-[70vh] w-[min(520px,95vw)] flex-col">
      <div className="terminal-heading flex items-center justify-between">
        <span>| Queue [{queue.length}]</span>
        <button className="terminal-button px-2 py-0.5" type="button" onClick={onClose}>
          close
        </button>
      </div>
      <div className="space-y-1 overflow-auto p-2">
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
            {queue.map((item, index) => (
              <QueueRow
                key={item.queueId}
                item={item}
                index={index}
                queueLength={queue.length}
                active={index === currentIndex}
                onSelect={onSelect}
                onRemove={onRemove}
                onMove={onMove}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  )
}
