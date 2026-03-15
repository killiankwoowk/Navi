import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import type { Album } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
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
  const recentSongsQuery = useQuery({
    queryKey: ['recent-songs', 20],
    queryFn: async () => {
      if (!client) return []
      return client.getRecentSongs(20)
    },
    staleTime: 5 * 60_000,
  })

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
  const recentAlbums = useMemo(() => {
    const map = new Map<string, Album>()
    for (const song of recentSongsQuery.data ?? []) {
      if (!song.albumId) continue
      if (map.has(song.albumId)) continue
      map.set(song.albumId, {
        id: song.albumId,
        name: song.album ?? 'Unknown album',
        artist: song.artist ?? 'Unknown artist',
        artistId: song.artistId,
        coverArt: song.coverArt ?? song.albumId,
      })
    }
    return Array.from(map.values())
  }, [recentSongsQuery.data])
  const mainFeed = useMemo(() => {
    const map = new Map<string, Album>()
    for (const album of [...(recentlyAdded.data ?? []), ...(topAlbums.data ?? []), ...(suggestedAlbums.data ?? [])]) {
      if (!map.has(album.id)) map.set(album.id, album)
    }
    return Array.from(map.values())
  }, [recentlyAdded.data, suggestedAlbums.data, topAlbums.data])

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="m-0 text-lg font-semibold text-nothing-100">Home</h1>
      </header>
      {recentlyAdded.isLoading || topAlbums.isLoading ? <LoadingRows rows={4} /> : null}
      {!recentlyAdded.isLoading && !topAlbums.isLoading && mainFeed.length === 0 ? (
        <EmptyState title="No albums available." hint="Check Navidrome scan status." />
      ) : null}

      {featuredAlbums.length > 0 ? (
        <section className="space-y-3">
          <header className="text-xs uppercase tracking-[0.16em] text-nothing-300">Featured Picks</header>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featuredAlbums.slice(0, 4).map((album) => (
              <AlbumCard
                key={`featured-${album.id}`}
                album={album}
                coverUrl={coverUrlForAlbum(album, heroCoverSize)}
                onPlay={() => playAlbum(album)}
                onQueue={() => playAlbum(album, true)}
                onOpen={() => navigate(`/album/${album.id}`)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {recentAlbums.length > 0 ? (
        <CarouselRow title="Recently Played">
          {recentAlbums.map((album) => (
            <div key={`recent-played-${album.id}`} className="min-w-[170px] max-w-[190px]">
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
            className="min-h-24 min-w-[200px] rounded border border-nothing-700 bg-nothing-800 px-3 py-3 text-left text-sm text-nothing-100 hover:bg-nothing-700"
            onClick={() => navigate('/playlists')}
            type="button"
          >
            <div className="text-nothing-100">{playlist.name}</div>
            <div className="mt-1 text-xs text-nothing-300">{playlist.songCount ?? 0} tracks</div>
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
        <header className="text-xs uppercase tracking-[0.16em] text-nothing-300">Main Feed Grid</header>
        <ResponsiveAlbumGrid
          albums={mainFeed}
          coverUrlForAlbum={coverUrlForAlbum}
          onPlayAlbum={(album) => playAlbum(album)}
          onQueueAlbum={(album) => playAlbum(album, true)}
          onOpenAlbum={(albumId) => navigate(`/album/${albumId}`)}
        />
      </section>
    </div>
  )
}
