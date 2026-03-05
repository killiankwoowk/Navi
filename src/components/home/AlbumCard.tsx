import { useState } from 'react'
import { ListPlus, Play, SquareArrowOutUpRight } from 'lucide-react'

import type { Album } from '@/api/types'
import '@/pages/PlaylistView/playlist.css'

interface AlbumCardProps {
  album: Album
  coverUrl?: string
  onPlay: () => void
  onQueue: () => void
  onOpen: () => void
}

export const AlbumCard = ({ album, coverUrl, onPlay, onQueue, onOpen }: AlbumCardProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <article className="terminal-card ascii-frame p-2">
      <div className={`playlist-cover ${loaded ? '' : 'is-loading'}`}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${album.name} cover`}
            className="h-full w-full object-cover"
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        ) : null}
      </div>
      <div className="mt-2">
        <h3 className="m-0 truncate text-sm text-terminal-text">{album.name}</h3>
        <p className="m-0 truncate text-xs text-terminal-muted">{album.artist ?? 'Unknown artist'}</p>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <button className="terminal-button px-1 py-0" type="button" onClick={onPlay} aria-label={`Play album ${album.name}`}>
          <Play size={12} />
        </button>
        <button className="terminal-button px-1 py-0" type="button" onClick={onQueue} aria-label={`Queue album ${album.name}`}>
          <ListPlus size={12} />
        </button>
        <button className="terminal-button px-1 py-0" type="button" onClick={onOpen} aria-label={`Open album ${album.name}`}>
          <SquareArrowOutUpRight size={12} />
        </button>
      </div>
    </article>
  )
}
