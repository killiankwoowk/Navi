import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import { Disc, MoreVertical, Play, Trash2, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { QueueItem } from '@/api/types'

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
  active: boolean
  onSelect: (index: number) => void
  onRemove: (queueId: string) => void
}

const QueueRow = ({ item, index, active, onSelect, onRemove }: QueueRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.queueId })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(event.target as Node)) return
      setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[22px_1fr_auto] items-center gap-2 border px-2 py-1 text-xs ${
        active ? 'border-accent bg-nothing-700 text-nothing-100' : 'border-nothing-700 text-nothing-100'
      }`}
    >
      <button className="cursor-grab text-nothing-300" type="button" aria-label={`Drag ${item.track.title}`} {...attributes} {...listeners}>
        ::
      </button>
      <button
        type="button"
        className="min-h-11 flex items-center justify-start truncate text-left focus:outline-none focus:ring-2 focus:ring-accent text-nothing-100"
        aria-label={`Play ${item.track.title}`}
        onClick={() => onSelect(index)}
      >
        {item.track.title}
      </button>
      <div className="relative" ref={menuRef}>
        <button
          className="terminal-button min-h-11 px-2 py-0"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={`Open actions for ${item.track.title}`}
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen ? (
          <div className="absolute right-0 z-30 mt-2 w-44 rounded border border-nothing-700 bg-nothing-800 p-1 text-xs shadow-lg">
            
            {item.track.artistId ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                onClick={() => {
                  navigate(`/artist/${item.track.artistId}`)
                  setMenuOpen(false)
                }}
              >
                <User size={12} />
                Go to artist
              </button>
            ) : null}
            {item.track.albumId ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                onClick={() => {
                  navigate(`/album/${item.track.albumId}`)
                  setMenuOpen(false)
                }}
              >
                <Disc size={12} />
                Go to album
              </button>
            ) : null}
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
              onClick={() => {
                onRemove(item.queueId)
                setMenuOpen(false)
              }}
            >
              <Trash2 size={12} />
              Remove from queue
            </button>
          </div>
        ) : null}
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
              active={item.track.id === currentTrackId}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
