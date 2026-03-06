import { type MouseEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPlus, Play, SquareArrowOutUpRight } from 'lucide-react'

import type { Album } from '@/api/types'
import '@/pages/PlaylistView/playlist.css'

interface AlbumCardProps {
  album: Album
  coverUrl?: string
  onPlay: () => void
  onQueue: () => void
  onOpen?: () => void
}

const withEventIsolation =
  (handler: () => void) =>
  (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    handler()
  }

export const AlbumCard = ({ album, coverUrl, onPlay, onQueue, onOpen }: AlbumCardProps) => {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const coverAlt = useMemo(() => `${album.name} cover art`, [album.name])
  const openAlbumPage = () => navigate(`/album/${album.id}`)

  return (
    <article className="terminal-card ascii-frame p-2">
      <button
        type="button"
        className="playlist-cover focus:outline-none focus:ring-2 focus:ring-terminal-green"
        aria-label={`Open album ${album.name}`}
        onClick={openAlbumPage}
      >
        {coverUrl && !imageFailed ? (
          <img
            src={coverUrl}
            alt={coverAlt}
            className={`h-full w-full object-cover ${loaded ? 'opacity-100' : 'opacity-80'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.14em] text-terminal-muted">
            [ no cover ]
          </div>
        )}
      </button>
      <div className="mt-2">
        <h3 className="m-0 truncate text-sm text-terminal-text">{album.name}</h3>
        <p className="m-0 truncate text-xs text-terminal-muted">{album.artist ?? 'Unknown artist'}</p>
      </div>
      <div className="mt-2 flex items-center gap-1">
        <button
          className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={withEventIsolation(onPlay)}
          aria-label={`Play album ${album.name}`}
        >
          <Play size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={withEventIsolation(onQueue)}
          aria-label={`Queue album ${album.name}`}
        >
          <ListPlus size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-terminal-green"
          type="button"
          onClick={withEventIsolation(onOpen ?? openAlbumPage)}
          aria-label={`Open details for album ${album.name}`}
        >
          <SquareArrowOutUpRight size={12} />
        </button>
      </div>
    </article>
  )
}
