import { type MouseEvent, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ListPlus, Play, SquareArrowOutUpRight } from 'lucide-react'

import type { Album } from '@/api/types'
import { CoverArtImage } from '@/components/common/CoverArtImage'

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
  const coverAlt = useMemo(() => `${album.name} cover art`, [album.name])
  const openAlbumPage = () => navigate(`/album/${album.id}`)
  const albumLink = `/album/${album.id}`
  const artistLink = album.artistId ? `/artist/${album.artistId}` : null

  return (
    <article className="terminal-card ascii-frame p-2 transition-transform duration-fast hover:-translate-y-0.5">
      <Link
        to={albumLink}
        className="playlist-cover block focus:outline-none focus:ring-2 focus:ring-terminal-green"
        aria-label={`Open album ${album.name}`}
      >
        <CoverArtImage src={coverUrl} alt={coverAlt} className="h-full w-full" />
      </Link>
      <div className="mt-2">
        <Link
          to={albumLink}
          className="block truncate text-sm md:text-base text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-green"
          aria-label={`Open album details for ${album.name}`}
        >
          {album.name}
        </Link>
        {artistLink ? (
          <Link
            to={artistLink}
            className="block truncate text-xs md:text-sm text-terminal-muted focus:outline-none focus:ring-2 focus:ring-terminal-green"
            aria-label={`Open artist ${album.artist ?? 'Unknown artist'}`}
          >
            {album.artist ?? 'Unknown artist'}
          </Link>
        ) : (
          <p className="m-0 truncate text-xs md:text-sm text-terminal-muted">{album.artist ?? 'Unknown artist'}</p>
        )}
      </div>
      <div className="mt-2 flex items-center gap-1">
        <button
          className="terminal-button min-h-11 px-2 py-1"
          type="button"
          onClick={withEventIsolation(onPlay)}
          aria-label={`Play album ${album.name}`}
        >
          <Play size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-2 py-1"
          type="button"
          onClick={withEventIsolation(onQueue)}
          aria-label={`Queue album ${album.name}`}
        >
          <ListPlus size={12} />
        </button>
        <button
          className="terminal-button min-h-11 px-2 py-1"
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
