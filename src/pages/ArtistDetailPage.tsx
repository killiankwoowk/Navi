import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { SongRow } from '@/components/common/SongRow'
import { useArtistQuery } from '@/features/library/useLibrary'
import { useAddSongToPlaylist, usePlaylistsQuery } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useMemo } from 'react'

export const ArtistDetailPage = () => {
  const { id = '' } = useParams()
  const artistQuery = useArtistQuery(id)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const playlistsQuery = usePlaylistsQuery()
  const addToPlaylist = useAddSongToPlaylist()
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const title = artistQuery.data?.artist.name ?? 'Artist'
  useDocumentTitle(`${title} | Navi Terminal Player`)

  return (
    <TerminalPanel title={`Artist: ${title}`} rightSlot={<span>{artistQuery.data?.album.length ?? 0} albums</span>}>
      {artistQuery.isLoading ? <LoadingRows /> : null}
      {!artistQuery.isLoading && !artistQuery.data ? <EmptyState title="Artist not found." /> : null}

      {artistQuery.data ? (
        <div className="grid gap-3 xl:grid-cols-2">
          <section className="space-y-2">
            <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">albums</h3>
            {artistQuery.data.album.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="block border border-terminal-text/25 px-3 py-2 text-sm transition-colors hover:border-terminal-accent hover:text-terminal-accent"
              >
                {album.name}
              </Link>
            ))}
          </section>

          <section className="space-y-2">
            <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">songs</h3>
            {(artistQuery.data.song ?? []).slice(0, 40).map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                indexLabel={index + 1}
                playlists={playlistsQuery.data ?? []}
                onPlay={() => setQueue(artistQuery.data?.song ?? [], index, true)}
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
          </section>
        </div>
      ) : null}
    </TerminalPanel>
  )
}
