import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Album } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { ResponsiveAlbumGrid } from '@/components/albums/ResponsiveAlbumGrid'
import { AlbumCard } from '@/components/home/AlbumCard'
import { CarouselRow } from '@/components/home/CarouselRow'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useAlbumListQuery } from '@/features/library/useLibrary'
import { usePlaylistsQuery } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useResponsiveCoverSize } from '@/hooks/useResponsiveCoverSize'
import { usePlayerStore } from '@/store/playerStore'

export const HomeDashboard = () => {
  useDocumentTitle('Home | Navi Terminal Player')

  const navigate = useNavigate()
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const coverSize = useResponsiveCoverSize('card')
  const heroCoverSize = useResponsiveCoverSize('hero')
  const recentlyAdded = useAlbumListQuery('newest', 40, 0)
  const topAlbums = useAlbumListQuery('frequent', 40, 0)
  const suggestedAlbums = useAlbumListQuery('alphabeticalByName', 40, 0)
  const playlists = usePlaylistsQuery()

  const coverUrlForAlbum = useCallback(
    (album: Album, size = coverSize) => {
      const coverId = album.coverArt || album.id
      if (!coverId || !client) return undefined
      return client.getCoverArt(coverId, size)
    },
    [client, coverSize],
  )

  const playAlbum = useCallback(
    async (album: Album, queueOnly = false) => {
      if (!client) return
      const fullAlbum = await client.getAlbum(album.id)
      const tracks = fullAlbum.song ?? []
      if (!tracks.length) return
      if (queueOnly) {
        addToQueue(tracks)
        return
      }
      setQueue(tracks, 0, true)
    },
    [addToQueue, client, setQueue],
  )

  const featuredAlbums = useMemo(() => (recentlyAdded.data ?? []).slice(0, 8), [recentlyAdded.data])
  const mainFeed = useMemo(() => {
    const map = new Map<string, Album>()
    for (const album of [...(recentlyAdded.data ?? []), ...(topAlbums.data ?? []), ...(suggestedAlbums.data ?? [])]) {
      if (!map.has(album.id)) map.set(album.id, album)
    }
    return Array.from(map.values())
  }, [recentlyAdded.data, suggestedAlbums.data, topAlbums.data])

  return (
    <TerminalPanel title="Home Dashboard" className="space-y-3">
      {recentlyAdded.isLoading || topAlbums.isLoading ? <LoadingRows rows={4} /> : null}
      {!recentlyAdded.isLoading && !topAlbums.isLoading && mainFeed.length === 0 ? (
        <EmptyState title="No albums available." hint="Check Navidrome scan status." />
      ) : null}

      {featuredAlbums.length > 0 ? (
        <CarouselRow title="Featured">
          {featuredAlbums.map((album) => (
            <div key={`featured-${album.id}`} className="min-w-[180px] max-w-[220px] sm:min-w-[220px] sm:max-w-[260px]">
              <AlbumCard
                album={album}
                coverUrl={coverUrlForAlbum(album, heroCoverSize)}
                onPlay={() => playAlbum(album)}
                onQueue={() => playAlbum(album, true)}
                onOpen={() => navigate(`/album/${album.id}`)}
              />
            </div>
          ))}
        </CarouselRow>
      ) : null}

      <CarouselRow title="Recently Added">
        {(recentlyAdded.data ?? []).map((album) => (
          <div key={`recent-${album.id}`} className="min-w-[170px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => navigate(`/album/${album.id}`)}
            />
          </div>
        ))}
      </CarouselRow>

      <CarouselRow title="Top Albums">
        {(topAlbums.data ?? []).map((album) => (
          <div key={`top-${album.id}`} className="min-w-[170px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => navigate(`/album/${album.id}`)}
            />
          </div>
        ))}
      </CarouselRow>

      <CarouselRow title="Your Playlists">
        {(playlists.data ?? []).map((playlist) => (
          <button
            key={playlist.id}
            className="terminal-card min-h-24 min-w-[200px] px-3 py-3 text-left text-sm"
            onClick={() => navigate('/playlists')}
            type="button"
          >
            <div className="text-terminal-text">{playlist.name}</div>
            <div className="mt-1 text-xs text-terminal-muted">{playlist.songCount ?? 0} tracks</div>
          </button>
        ))}
      </CarouselRow>

      <CarouselRow title="Suggested">
        {(suggestedAlbums.data ?? []).map((album) => (
          <div key={`suggested-${album.id}`} className="min-w-[170px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => navigate(`/album/${album.id}`)}
            />
          </div>
        ))}
      </CarouselRow>

      <section className="space-y-2">
        <header className="text-xs uppercase tracking-[0.16em] text-terminal-muted">Main Feed Grid</header>
        <ResponsiveAlbumGrid
          albums={mainFeed}
          coverUrlForAlbum={coverUrlForAlbum}
          onPlayAlbum={(album) => playAlbum(album)}
          onQueueAlbum={(album) => playAlbum(album, true)}
          onOpenAlbum={(albumId) => navigate(`/album/${albumId}`)}
        />
      </section>
    </TerminalPanel>
  )
}

