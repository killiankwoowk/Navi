import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CoverArtImage } from '@/components/common/CoverArtImage'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { SongRow } from '@/components/common/SongRow'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useAlbumQuery } from '@/features/library/useLibrary'
import { useAddSongToPlaylist, usePlaylistsQuery } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useViewportMode } from '@/hooks/useViewportMode'
import { usePlayerStore } from '@/store/playerStore'
import { formatAlbumMeta } from '@/utils/format'
import { getCoverSizeForViewport } from '@/utils/image'

export const AlbumDetailPage = () => {
  const { id = '' } = useParams()
  const albumQuery = useAlbumQuery(id)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const viewportMode = useViewportMode()
  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const playlistsQuery = usePlaylistsQuery()
  const addToPlaylist = useAddSongToPlaylist()

  const album = albumQuery.data
  const tracks = useMemo(() => album?.song ?? [], [album])
  const coverSize = getCoverSizeForViewport(viewportMode, 'hero')
  const coverUrl = useMemo(() => {
    if (!album || !client) return undefined
    const coverId = album.coverArt || album.id
    return coverId ? client.getCoverArt(coverId, coverSize) : undefined
  }, [album, client, coverSize])

  useDocumentTitle(`${album?.name ?? 'Album'} | Navi Terminal Player`)

  return (
    <TerminalPanel
      title={album?.name ?? 'Album'}
      rightSlot={<span className="text-[11px]">{formatAlbumMeta(album?.year, album?.songCount)}</span>}
    >
      {albumQuery.isLoading ? <LoadingRows /> : null}
      {!albumQuery.isLoading && !album ? <EmptyState title="Album not found." /> : null}

      {album ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(220px,320px)_minmax(0,1fr)]">
          <section className="space-y-3">
            <CoverArtImage
              src={coverUrl}
              alt={`${album.name} cover art`}
              className="w-full overflow-hidden border border-terminal-text/30"
              imageClassName="aspect-square"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={() => setQueue(tracks, 0, true)}>
                play album
              </button>
              <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={() => addToQueue(tracks)}>
                add album to queue
              </button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-terminal-muted">artist</div>
              {album.artistId ? (
                <Link
                  to={`/artist/${album.artistId}`}
                  className="text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-green"
                  aria-label={`Open artist ${album.artist ?? 'Unknown artist'}`}
                >
                  {album.artist ?? 'Unknown artist'}
                </Link>
              ) : (
                <div className="text-terminal-text">{album.artist ?? 'Unknown artist'}</div>
              )}
              {album.genre ? (
                <>
                  <div className="text-terminal-muted">genre</div>
                  <div className="text-terminal-text">{album.genre}</div>
                </>
              ) : null}
              {album.year ? (
                <>
                  <div className="text-terminal-muted">year</div>
                  <div className="text-terminal-text">{album.year}</div>
                </>
              ) : null}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">tracks</h3>
            <div className="space-y-1">
              {tracks.map((song, index) => (
                <SongRow
                  key={song.id}
                  song={song}
                  indexLabel={song.track ?? index + 1}
                  playlists={playlistsQuery.data ?? []}
                  onPlay={() => setQueue(tracks, index, true)}
                  onQueue={(selected) => addToQueue([selected])}
                  onAddToPlaylist={(playlistId, songId) => {
                    void addToPlaylist.mutateAsync({ playlistId, songId })
                  }}
                  onToggleFavorite={(selected, next) => {
                    if (!client) return
                    void (next ? client.star(selected.id) : client.unstar(selected.id))
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </TerminalPanel>
  )
}
