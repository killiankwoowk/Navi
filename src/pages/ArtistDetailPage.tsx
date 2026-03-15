import { Link, useParams } from 'react-router-dom'

import { AddToPlaylistMenu } from '@/components/playlists/AddToPlaylistMenu'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useArtistQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { formatDuration } from '@/utils/format'

export const ArtistDetailPage = () => {
  const { id = '' } = useParams()
  const artistQuery = useArtistQuery(id)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

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
              <div key={song.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 border border-terminal-text/20 px-2 py-1">
                <span className="text-[11px] text-terminal-muted">{index + 1}</span>
                <Link
                  to={`/song/${song.id}`}
                  className="truncate text-left text-sm focus:outline-none focus:ring-2 focus:ring-terminal-green"
                  aria-label={`Open song ${song.title}`}
                >
                  {song.title}
                </Link>
                <div className="flex items-center gap-1 text-[11px] text-terminal-muted">
                  <span>{formatDuration(song.duration ?? 0)}</span>
                  <button
                    className="terminal-button px-1 py-0"
                    type="button"
                    onClick={() => setQueue(artistQuery.data.song ?? [], index, true)}
                    aria-label={`Play ${song.title}`}
                  >
                    play
                  </button>
                  <button className="terminal-button px-1 py-0" type="button" onClick={() => addToQueue([song])}>
                    +q
                  </button>
                  <AddToPlaylistMenu songId={song.id} />
                </div>
              </div>
            ))}
          </section>
        </div>
      ) : null}
    </TerminalPanel>
  )
}
