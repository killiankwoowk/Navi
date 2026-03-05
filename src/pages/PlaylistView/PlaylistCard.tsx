import { useState } from 'react'
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
}

export const PlaylistCard = ({ track, mode, coverUrl, onPlay, onQueue, onLyrics, onRemove }: PlaylistCardProps) => {
  const [isCoverLoaded, setIsCoverLoaded] = useState(false)

  if (mode === 'list') {
    return (
      <article className="terminal-card grid grid-cols-[56px_1fr_auto] items-center gap-2 p-2">
        <div className={`playlist-cover h-14 w-14 ${isCoverLoaded ? '' : 'is-loading'}`}>
          {coverUrl ? (
            <img src={coverUrl} alt={`${track.title} cover`} className="h-full w-full object-cover" onLoad={() => setIsCoverLoaded(true)} />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm text-terminal-text">{track.title}</p>
          <p className="m-0 truncate text-xs text-terminal-muted">{track.artist ?? 'Unknown artist'}</p>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-terminal-muted">{formatDuration(track.duration ?? 0)}</span>
          <button className="terminal-button px-1 py-0" type="button" onClick={onPlay} aria-label={`Play ${track.title}`}>
            <Play size={12} />
          </button>
          <button className="terminal-button px-1 py-0" type="button" onClick={onQueue} aria-label={`Add ${track.title} to queue`}>
            <Plus size={12} />
          </button>
          <button className="terminal-button px-1 py-0" type="button" onClick={onLyrics} aria-label={`Open lyrics for ${track.title}`}>
            <MessageSquareMore size={12} />
          </button>
          {onRemove ? (
            <button className="terminal-button px-1 py-0" type="button" onClick={onRemove} aria-label={`Remove ${track.title}`}>
              rm
            </button>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article className="terminal-card p-2">
      <div className={`playlist-cover ${isCoverLoaded ? '' : 'is-loading'}`}>
        {coverUrl ? (
          <img src={coverUrl} alt={`${track.title} cover`} className="h-full w-full object-cover" onLoad={() => setIsCoverLoaded(true)} />
        ) : null}
      </div>
      <div className="mt-2">
        <p className="m-0 truncate text-sm text-terminal-text">{track.title}</p>
        <p className="m-0 truncate text-xs text-terminal-muted">{track.artist ?? 'Unknown artist'}</p>
        <p className="m-0 mt-1 text-[11px] text-terminal-muted">{formatDuration(track.duration ?? 0)}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        <button className="terminal-button px-1 py-0" type="button" onClick={onPlay} aria-label={`Play ${track.title}`}>
          <Play size={12} />
        </button>
        <button className="terminal-button px-1 py-0" type="button" onClick={onQueue} aria-label={`Add ${track.title} to queue`}>
          <Plus size={12} />
        </button>
        <button className="terminal-button px-1 py-0" type="button" onClick={onLyrics} aria-label={`Open lyrics for ${track.title}`}>
          <MessageSquareMore size={12} />
        </button>
        {onRemove ? (
          <button className="terminal-button px-1 py-0" type="button" onClick={onRemove} aria-label={`Remove ${track.title}`}>
            rm
          </button>
        ) : null}
        <AddToPlaylistMenu songId={track.id} />
      </div>
    </article>
  )
}
