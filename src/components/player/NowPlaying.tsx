import type { Song } from '@/api/types'
import { Link } from 'react-router-dom'
import { CoverArtImage } from '@/components/common/CoverArtImage'
import { formatAlbumMeta } from '@/utils/format'

interface NowPlayingProps {
  track: Song | null
  coverUrl?: string
}

export const NowPlaying = ({ track, coverUrl }: NowPlayingProps) => {
  const albumLink = track?.albumId ? `/album/${track.albumId}` : null
  const artistLink = track?.artistId ? `/artist/${track.artistId}` : null
  const songLink = track?.id ? `/song/${track.id}` : null

  return (
    <div className="grid grid-cols-[56px_1fr] items-center gap-3">
      {albumLink ? (
        <Link
          to={albumLink}
          className="block focus:outline-none focus:ring-2 focus:ring-terminal-green"
          aria-label={`Open album ${track?.album ?? 'album'}`}
        >
          <CoverArtImage
            src={coverUrl}
            alt={track?.title ?? 'cover'}
            className="h-14 w-14 border border-terminal-text/35 bg-black/40"
            fallbackLabel="no art"
          />
        </Link>
      ) : (
        <CoverArtImage
          src={coverUrl}
          alt={track?.title ?? 'cover'}
          className="h-14 w-14 border border-terminal-text/35 bg-black/40"
          fallbackLabel="no art"
        />
      )}
      <div className="min-w-0">
        {songLink ? (
          <Link
            to={songLink}
            className="block truncate text-sm text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-green"
            aria-label={`Open song ${track?.title ?? 'song'}`}
          >
            {track?.title ?? 'No track selected'}
          </Link>
        ) : (
          <div className="truncate text-sm text-terminal-text">{track?.title ?? 'No track selected'}</div>
        )}
        <div className="truncate text-xs text-terminal-muted">
          {artistLink ? (
            <Link
              to={artistLink}
              className="focus:outline-none focus:ring-2 focus:ring-terminal-green"
              aria-label={`Open artist ${track?.artist ?? 'Unknown artist'}`}
            >
              {track?.artist ?? 'Unknown artist'}
            </Link>
          ) : (
            <span>{track?.artist ?? 'Unknown artist'}</span>
          )}{' '}
          {track ? '|' : ''} {track ? formatAlbumMeta(track.year) : ''}
        </div>
      </div>
    </div>
  )
}


