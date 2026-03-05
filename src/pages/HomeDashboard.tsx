import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window'

import type { Album } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { AlbumCard } from '@/components/home/AlbumCard'
import { CarouselRow } from '@/components/home/CarouselRow'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useAlbumListQuery } from '@/features/library/useLibrary'
import { usePlaylistsQuery } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'

interface GridRowData {
  items: Album[]
  columns: number
  coverUrlForAlbum: (album: Album) => string | undefined
  playAlbum: (album: Album, queueOnly?: boolean) => void
  openAlbum: (albumId: string) => void
}

const rowHeight = 330
const minColumnWidth = 250

const GridRow = ({ data, index, style }: ListChildComponentProps<GridRowData>) => {
  const start = index * data.columns
  const rowItems = data.items.slice(start, start + data.columns)
  const mergedStyle = { ...style, display: 'grid', gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))` }

  return (
    <div style={mergedStyle} className="gap-2 px-1 py-1">
      {rowItems.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          coverUrl={data.coverUrlForAlbum(album)}
          onPlay={() => data.playAlbum(album)}
          onQueue={() => data.playAlbum(album, true)}
          onOpen={() => data.openAlbum(album.id)}
        />
      ))}
    </div>
  )
}

export const HomeDashboard = () => {
  useDocumentTitle('Home | Navi Terminal Player')

  const navigate = useNavigate()
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const recentlyAdded = useAlbumListQuery('newest', 30, 0)
  const topAlbums = useAlbumListQuery('frequent', 30, 0)
  const suggestedAlbums = useAlbumListQuery('alphabeticalByName', 30, 0)
  const playlists = usePlaylistsQuery()

  const [gridWidth, setGridWidth] = useState(1000)
  const [gridHeight, setGridHeight] = useState(() =>
    typeof window === 'undefined' ? 620 : Math.max(320, window.innerHeight - 400),
  )
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 1000)
      if (nextWidth > 0) setGridWidth(nextWidth)
    })
    observer.observe(gridRef.current)

    const onResize = () => setGridHeight(Math.max(320, window.innerHeight - 400))
    window.addEventListener('resize', onResize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const coverUrlForAlbum = useCallback(
    (album: Album) => {
      const coverId = album.coverArt || album.id
      if (!coverId || !client) return undefined
      return client.getCoverArt(coverId, 480)
    },
    [client],
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

  const openAlbum = useCallback((albumId: string) => navigate(`/album/${albumId}`), [navigate])

  const featuredAlbums = useMemo(() => (recentlyAdded.data ?? []).slice(0, 8), [recentlyAdded.data])
  const mainFeed = useMemo(() => {
    const map = new Map<string, Album>()
    for (const album of [...(recentlyAdded.data ?? []), ...(topAlbums.data ?? []), ...(suggestedAlbums.data ?? [])]) {
      if (!map.has(album.id)) map.set(album.id, album)
    }
    return Array.from(map.values())
  }, [recentlyAdded.data, suggestedAlbums.data, topAlbums.data])

  const columns = Math.max(1, Math.floor(gridWidth / minColumnWidth))
  const rowCount = Math.ceil(mainFeed.length / columns)

  return (
    <TerminalPanel title="Home Dashboard" className="space-y-3">
      {recentlyAdded.isLoading || topAlbums.isLoading ? <LoadingRows rows={4} /> : null}
      {!recentlyAdded.isLoading && !topAlbums.isLoading && mainFeed.length === 0 ? (
        <EmptyState title="No albums available." hint="Check Navidrome scan status." />
      ) : null}

      {featuredAlbums.length > 0 ? (
        <CarouselRow title="Featured">
          {featuredAlbums.map((album) => (
            <div key={`featured-${album.id}`} className="min-w-[220px] max-w-[220px]">
              <AlbumCard
                album={album}
                coverUrl={coverUrlForAlbum(album)}
                onPlay={() => playAlbum(album)}
                onQueue={() => playAlbum(album, true)}
                onOpen={() => openAlbum(album.id)}
              />
            </div>
          ))}
        </CarouselRow>
      ) : null}

      <CarouselRow title="Recently Added">
        {(recentlyAdded.data ?? []).map((album) => (
          <div key={`recent-${album.id}`} className="min-w-[190px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => openAlbum(album.id)}
            />
          </div>
        ))}
      </CarouselRow>

      <CarouselRow title="Top Albums">
        {(topAlbums.data ?? []).map((album) => (
          <div key={`top-${album.id}`} className="min-w-[190px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => openAlbum(album.id)}
            />
          </div>
        ))}
      </CarouselRow>

      <CarouselRow title="Your Playlists">
        {(playlists.data ?? []).map((playlist) => (
          <button
            key={playlist.id}
            className="terminal-card min-w-[220px] px-3 py-3 text-left text-sm"
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
          <div key={`suggested-${album.id}`} className="min-w-[190px] max-w-[190px]">
            <AlbumCard
              album={album}
              coverUrl={coverUrlForAlbum(album)}
              onPlay={() => playAlbum(album)}
              onQueue={() => playAlbum(album, true)}
              onOpen={() => openAlbum(album.id)}
            />
          </div>
        ))}
      </CarouselRow>

      <section className="space-y-2">
        <header className="text-xs uppercase tracking-[0.16em] text-terminal-muted">Main Feed Grid</header>
        <div ref={gridRef} className="playlist-viewport">
          <List
            className="terminal-carousel"
            width={gridWidth}
            height={gridHeight}
            itemCount={rowCount}
            itemSize={rowHeight}
            itemData={{
              items: mainFeed,
              columns,
              coverUrlForAlbum,
              playAlbum,
              openAlbum,
            }}
          >
            {GridRow}
          </List>
        </div>
      </section>
    </TerminalPanel>
  )
}
