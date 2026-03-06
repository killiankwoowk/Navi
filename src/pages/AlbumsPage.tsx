import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { Album } from '@/api/types'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { ResponsiveAlbumGrid } from '@/components/albums/ResponsiveAlbumGrid'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useAlbumListQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useResponsiveCoverSize } from '@/hooks/useResponsiveCoverSize'
import { usePlayerStore } from '@/store/playerStore'

const PAGE_SIZE = 60

export const AlbumsPage = () => {
  useDocumentTitle('Albums | Navi Terminal Player')

  const navigate = useNavigate()
  const [offset, setOffset] = useState(0)
  const [type, setType] = useState('alphabeticalByName')
  const albumQuery = useAlbumListQuery(type, PAGE_SIZE, offset)

  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const coverSize = useResponsiveCoverSize('card')
  const albums = albumQuery.data ?? []

  const coverUrlForAlbum = useCallback(
    (album: Album) => {
      const coverId = album.coverArt || album.id
      if (!coverId || !client) return undefined
      return client.getCoverArt(coverId, coverSize)
    },
    [client, coverSize],
  )

  const playAlbum = useCallback(
    async (album: Album) => {
      if (!client) return
      const detailed = await client.getAlbum(album.id)
      const songs = detailed.song ?? []
      if (!songs.length) return
      setQueue(songs, 0, true)
    },
    [client, setQueue],
  )

  const queueAlbum = useCallback(
    async (album: Album) => {
      if (!client) return
      const detailed = await client.getAlbum(album.id)
      const songs = detailed.song ?? []
      if (!songs.length) return
      addToQueue(songs)
    },
    [addToQueue, client],
  )

  return (
    <TerminalPanel
      title="Albums"
      rightSlot={
        <div className="flex items-center gap-2">
          <select
            aria-label="Album list type"
            value={type}
            onChange={(event) => {
              setOffset(0)
              setType(event.target.value)
            }}
            className="terminal-input h-9 w-40 px-2 py-1 text-xs"
          >
            <option value="alphabeticalByName">A-Z</option>
            <option value="newest">Newest</option>
            <option value="frequent">Frequent</option>
            <option value="recent">Recent</option>
          </select>
          <button
            type="button"
            className="terminal-button min-h-9 px-2 py-1"
            onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
            disabled={offset === 0}
          >
            prev
          </button>
          <button type="button" className="terminal-button min-h-9 px-2 py-1" onClick={() => setOffset((value) => value + PAGE_SIZE)}>
            next
          </button>
        </div>
      }
    >
      {albumQuery.isLoading ? <LoadingRows rows={6} /> : null}
      {!albumQuery.isLoading && albums.length === 0 ? <EmptyState title="No albums found." /> : null}
      <ResponsiveAlbumGrid
        albums={albums}
        coverUrlForAlbum={coverUrlForAlbum}
        onPlayAlbum={playAlbum}
        onQueueAlbum={queueAlbum}
        onOpenAlbum={(albumId) => navigate(`/album/${albumId}`)}
      />
    </TerminalPanel>
  )
}

