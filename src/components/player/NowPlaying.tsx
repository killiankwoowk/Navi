import type { Song } from '@/api/types'
import { CoverArtImage } from '@/components/common/CoverArtImage'
import { formatAlbumMeta } from '@/utils/format'

interface NowPlayingProps {
  track: Song | null
  coverUrl?: string
}

export const NowPlaying = ({ track, coverUrl }: NowPlayingProps) => (
  <div className="grid grid-cols-[56px_1fr] items-center gap-3">
    <CoverArtImage
      src={coverUrl}
      alt={track?.title ?? 'cover'}
      className="h-14 w-14 border border-terminal-text/35 bg-black/40"
      fallbackLabel="no art"
    />
    <div className="min-w-0">
      <div className="truncate text-sm text-terminal-text">{track?.title ?? 'No track selected'}</div>
      <div className="truncate text-xs text-terminal-muted">
        {track?.artist ?? 'Unknown artist'} {track ? '|' : ''} {track ? formatAlbumMeta(track.year) : ''}
      </div>
    </div>
  </div>
)


