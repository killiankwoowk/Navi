import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Song } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useUiStore } from '@/store/uiStore'
import { getSongCoverArtId } from '@/utils/image'

import { PlaylistGrid } from './PlaylistGrid'

interface PlaylistViewProps {
  title?: string
  tracks: Song[]
  isLoading?: boolean
  onPlayTrack: (track: Song, index: number) => void
  onQueueTrack: (track: Song) => void
  onOpenLyrics: (track: Song) => void
  onRemoveTrack?: (track: Song, index: number) => void
}

export const PlaylistView = ({
  title = 'Playlist',
  tracks,
  isLoading,
  onPlayTrack,
  onQueueTrack,
  onOpenLyrics,
  onRemoveTrack,
}: PlaylistViewProps) => {
  const viewMode = useUiStore((state) => state.playlistViewMode)
  const setViewMode = useUiStore((state) => state.setPlaylistViewMode)

  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 560 : Math.max(280, window.innerHeight - 340),
  )
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  useEffect(() => {
    const updateHeight = () => setViewportHeight(Math.max(280, window.innerHeight - 340))
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const resolveCoverUrl = useCallback(
    (track: Song) => {
      const coverArtId = getSongCoverArtId(track)
      if (!client || !coverArtId) return undefined
      return client.getCoverArt(coverArtId, 300)
    },
    [client],
  )

  return (
    <section className="space-y-2">
      <header className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-terminal-muted">
          [{title}] <span className="text-terminal-accent">{tracks.length}</span> tracks
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`terminal-button px-2 py-0.5 ${viewMode === 'list' ? 'border-terminal-accent text-terminal-accent' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="Show playlist in list view"
          >
            list
          </button>
          <button
            type="button"
            className={`terminal-button px-2 py-0.5 ${viewMode === 'grid' ? 'border-terminal-accent text-terminal-accent' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="Show playlist in grid view"
          >
            grid
          </button>
        </div>
      </header>

      {isLoading ? <LoadingRows rows={6} /> : null}
      {!isLoading && tracks.length === 0 ? <EmptyState title="No tracks available." /> : null}
      {!isLoading && tracks.length > 0 ? (
        <PlaylistGrid
          tracks={tracks}
          mode={viewMode}
          height={viewportHeight}
          resolveCoverUrl={resolveCoverUrl}
          onPlayTrack={onPlayTrack}
          onQueueTrack={onQueueTrack}
          onOpenLyrics={onOpenLyrics}
          onRemoveTrack={onRemoveTrack}
        />
      ) : null}
    </section>
  )
}
