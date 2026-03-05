import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { AddToPlaylistMenu } from '@/components/playlists/AddToPlaylistMenu'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useAlbumQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { formatAlbumMeta, formatDuration } from '@/utils/format'

export const AlbumDetailPage = () => {
  const { id = '' } = useParams()
  const albumQuery = useAlbumQuery(id)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const album = albumQuery.data
  const tracks = useMemo(() => album?.song ?? [], [album])

  useDocumentTitle(`${album?.name ?? 'Album'} | Navi Terminal Player`)

  return (
    <TerminalPanel
      title={album?.name ?? 'Album'}
      rightSlot={<span className="text-[11px]">{formatAlbumMeta(album?.year, album?.songCount)}</span>}
    >
      {albumQuery.isLoading ? <LoadingRows /> : null}
      {!albumQuery.isLoading && !album ? <EmptyState title="Album not found." /> : null}

      {album ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button className="terminal-button" type="button" onClick={() => setQueue(tracks, 0, true)}>
              play album
            </button>
            <button className="terminal-button" type="button" onClick={() => addToQueue(tracks)}>
              add album to queue
            </button>
            <span className="text-terminal-muted">{album.artist ?? 'Unknown artist'}</span>
          </div>
          <div className="space-y-1">
            {tracks.map((song, index) => (
              <div key={song.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-2 border border-terminal-text/20 px-2 py-1">
                <span className="text-[11px] text-terminal-muted">{song.track ?? index + 1}</span>
                <button className="truncate text-left text-sm" type="button" onClick={() => setQueue(tracks, index, true)}>
                  {song.title}
                </button>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-terminal-muted">{formatDuration(song.duration ?? 0)}</span>
                  <button className="terminal-button px-1 py-0" type="button" onClick={() => addToQueue([song])}>
                    +q
                  </button>
                  <AddToPlaylistMenu songId={song.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </TerminalPanel>
  )
}
