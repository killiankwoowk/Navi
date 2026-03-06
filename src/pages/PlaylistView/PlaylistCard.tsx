import { type MouseEvent, useMemo, useState } from 'react'
import { MessageSquareMore, Play, Plus } from 'lucide-react'

import type { Song } from '@/api/types'
import { AddToPlaylistMenu } from '@/components/playlists/AddToPlaylistMenu'
import { formatDuration } from '@/utils/format'

import './playlist.css'

interface PlaylistCardProps {
  track: Song
  mode: 'list' | 'grid'
  coverUrl?: string
  onPlay: () => void
  onQueue: () => void
  onLyrics: () => void
  onRemove?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

const isolateEvent =
  (handler?: () => void) =>
  (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    handler?.()
  }

export const PlaylistCard = ({
  track,
  mode,
  coverUrl,
  onPlay,
  onQueue,
  onLyrics,
  onRemove,
  onMoveUp,
  onMoveDown,
}: PlaylistCardProps) => {
  const [isCoverLoaded, setIsCoverLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const artistLabel = useMemo(() => track.artist ?? 'Unknown artist', [track.artist])

  const coverContent = coverUrl && !imageFailed ? (
    <img
      src={coverUrl}
      alt={`${track.title} cover`}
      className="h-full w-full object-cover"
      loading="lazy"
      onLoad={() => setIsCoverLoaded(true)}
      onError={() => setImageFailed(true)}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.14em] text-terminal-muted">
      [ no cover ]
    </div>
  )

  if (mode === 'list') {
    return (
      <article className="terminal-card grid grid-cols-[56px_1fr_auto] items-center gap-2 p-2">
        <div className={`playlist-cover h-14 w-14 ${isCoverLoaded ? '' : 'is-loading'}`}>{coverContent}</div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm text-terminal-text">{track.title}</p>
          <p className="m-0 truncate text-xs text-terminal-muted">{artistLabel}</p>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-terminal-muted">{formatDuration(track.duration ?? 0)}</span>
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onPlay)}
            aria-label={`Play ${track.title}`}
          >
            <Play size={12} />
          </button>
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onQueue)}
            aria-label={`Add ${track.title} to queue`}
          >
            <Plus size={12} />
          </button>
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onLyrics)}
            aria-label={`Open lyrics for ${track.title}`}
          >
            <MessageSquareMore size={12} />
          </button>
          {onMoveUp ? (
            <button
              className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              type="button"
              onClick={isolateEvent(onMoveUp)}
              aria-label={`Move ${track.title} up`}
            >
              up
            </button>
          ) : null}
          {onMoveDown ? (
            <button
              className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              type="button"
              onClick={isolateEvent(onMoveDown)}
              aria-label={`Move ${track.title} down`}
            >
              dn
            </button>
          ) : null}
          {onRemove ? (
            <button
              className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
              type="button"
              onClick={isolateEvent(onRemove)}
              aria-label={`Remove ${track.title}`}
            >
              rm
            </button>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article className="terminal-card p-2">
      <div className={`playlist-cover ${isCoverLoaded ? '' : 'is-loading'}`}>{coverContent}</div>
      <div className="mt-2">
        <p className="m-0 truncate text-sm text-terminal-text">{track.title}</p>
        <p className="m-0 truncate text-xs text-terminal-muted">{artistLabel}</p>
        <p className="m-0 mt-1 text-[11px] text-terminal-muted">{formatDuration(track.duration ?? 0)}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={isolateEvent(onPlay)}
          aria-label={`Play ${track.title}`}
        >
          <Play size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={isolateEvent(onQueue)}
          aria-label={`Add ${track.title} to queue`}
        >
          <Plus size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={isolateEvent(onLyrics)}
          aria-label={`Open lyrics for ${track.title}`}
        >
          <MessageSquareMore size={12} />
        </button>
        {onMoveUp ? (
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onMoveUp)}
            aria-label={`Move ${track.title} up`}
          >
            up
          </button>
        ) : null}
        {onMoveDown ? (
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onMoveDown)}
            aria-label={`Move ${track.title} down`}
          >
            dn
          </button>
        ) : null}
        {onRemove ? (
          <button
            className="terminal-button min-h-11 px-1 py-0 focus:outline-none focus:ring-2 focus:ring-terminal-green"
            type="button"
            onClick={isolateEvent(onRemove)}
            aria-label={`Remove ${track.title}`}
          >
            rm
          </button>
        ) : null}
        <AddToPlaylistMenu songId={track.id} />
      </div>
    </article>
  )
}
