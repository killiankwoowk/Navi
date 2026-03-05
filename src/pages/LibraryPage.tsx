import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useAlbumListQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'
import { formatAlbumMeta } from '@/utils/format'

const albumTypes = [
  { value: 'alphabeticalByName', label: 'alphabetical' },
  { value: 'recent', label: 'recent' },
  { value: 'newest', label: 'newest' },
  { value: 'frequent', label: 'frequent' },
]

export const LibraryPage = () => {
  useDocumentTitle('Library | Navi Terminal Player')

  const albumType = useUiStore((state) => state.libraryAlbumType)
  const setAlbumType = useUiStore((state) => state.setLibraryAlbumType)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const query = useAlbumListQuery(albumType, 80, 0)

  const queueAlbum = async (albumId: string, playNow: boolean) => {
    const client = getNavidromeClientOrNull()
    if (!client) return
    const album = await client.getAlbum(albumId)
    const tracks = album.song ?? []
    if (!tracks.length) return
    if (playNow) {
      setQueue(tracks, 0, true)
      return
    }
    addToQueue(tracks)
  }

  return (
    <TerminalPanel
      title="Library Dashboard"
      rightSlot={
        <select
          value={albumType}
          onChange={(event) => setAlbumType(event.target.value)}
          className="border border-terminal-text/40 bg-black/40 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-terminal-text"
        >
          {albumTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      }
    >
      {query.isLoading ? <LoadingRows /> : null}
      {!query.isLoading && query.data?.length === 0 ? (
        <EmptyState title="No albums returned by server." hint="Check credentials and library indexing status." />
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {query.data?.map((album) => (
          <article key={album.id} className="border border-terminal-text/25 p-3 transition-colors hover:border-terminal-accent/70">
            <Link to={`/album/${album.id}`} className="block">
              <h3 className="m-0 truncate text-sm text-terminal-text">{album.name}</h3>
              <p className="m-0 mt-1 truncate text-xs text-terminal-muted">{album.artist ?? 'Unknown artist'}</p>
              <p className="m-0 mt-2 text-[11px] text-terminal-muted">{formatAlbumMeta(album.year, album.songCount)}</p>
            </Link>
            <div className="mt-3 flex gap-1">
              <button className="terminal-button px-2 py-0.5" type="button" onClick={() => queueAlbum(album.id, true)}>
                play
              </button>
              <button className="terminal-button px-2 py-0.5" type="button" onClick={() => queueAlbum(album.id, false)}>
                +queue
              </button>
            </div>
          </article>
        ))}
      </div>
    </TerminalPanel>
  )
}
