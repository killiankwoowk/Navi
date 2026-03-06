import { useRef } from 'react'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { QueueItem } from '@/api/types'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { formatDuration } from '@/utils/format'

interface QueuePanelProps {
  queue: QueueItem[]
  currentTrackId: string | null
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
      className={`grid grid-cols-[24px_1fr_auto_auto] items-center gap-2 border px-2 py-1 text-xs ${
        active ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent' : 'border-terminal-text/20'
      }`}
    >
      <button
        className="cursor-grab text-terminal-muted focus:outline-none focus:ring-2 focus:ring-terminal-green"
        type="button"
        aria-label={`Drag ${item.track.title}`}
        {...attributes}
        {...listeners}
      >
        ::
      </button>
      <button
        className="min-h-11 truncate text-left focus:outline-none focus:ring-2 focus:ring-terminal-green"
        type="button"
        onClick={() => onSelect(index)}
        aria-label={`Play ${item.track.title}`}
      >
        {item.track.title}
      </button>
      <span className="text-terminal-muted">{formatDuration(item.track.duration ?? 0)}</span>
      <div className="flex items-center gap-1">
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={() => onMove(index, Math.max(0, index - 1))}
          aria-label={`Move ${item.track.title} up`}
        >
          up
        </button>
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={() => onMove(index, Math.min(index + 1, queueLength - 1))}
          aria-label={`Move ${item.track.title} down`}
        >
          dn
        </button>
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={() => onRemove(item.queueId)}
          aria-label={`Remove ${item.track.title} from queue`}
        >
          x
        </button>
      </div>
    </div>
  )
}

export const QueuePanel = ({ queue, currentTrackId, onSelect, onRemove, onMove, onClose }: QueuePanelProps) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap({
    active: true,
    containerRef: panelRef,
    initialFocusRef: closeButtonRef,
    onClose,
  })

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Queue panel">
      <button
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        type="button"
        aria-label="Close queue panel overlay"
      />
      <aside
        ref={panelRef}
        className="terminal-panel absolute inset-x-0 bottom-0 top-16 flex w-full flex-col sm:inset-y-8 sm:left-auto sm:right-3 sm:w-[min(520px,95vw)]"
      >
        <div className="terminal-heading flex items-center justify-between">
          <span>| Queue [{queue.length}]</span>
          <button
            ref={closeButtonRef}
            className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={onClose}
          >
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
                  active={item.track.id === currentTrackId}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  onMove={onMove}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </aside>
    </div>
  )
}
