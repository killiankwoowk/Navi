import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CoverArtImage } from '@/components/common/CoverArtImage'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useSongQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useViewportMode } from '@/hooks/useViewportMode'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'
import { formatDuration } from '@/utils/format'
import { getCoverSizeForViewport } from '@/utils/image'

export const SongDetailPage = () => {
  const { id = '' } = useParams()
  const songQuery = useSongQuery(id)
  const song = songQuery.data
  const viewportMode = useViewportMode()
  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const openLyricsPanel = useUiStore((state) => state.openLyricsPanel)

  useDocumentTitle(`${song?.title ?? 'Song'} | Navi Terminal Player`)

  const coverSize = getCoverSizeForViewport(viewportMode, 'hero')
  const coverUrl = useMemo(() => {
    if (!song || !client) return undefined
    const coverId = song.coverArt || song.albumId || song.id
    return coverId ? client.getCoverArt(coverId, coverSize) : undefined
  }, [client, coverSize, song])

  return (
    <TerminalPanel title={song?.title ?? 'Song'}>
      {songQuery.isLoading ? <LoadingRows /> : null}
      {!songQuery.isLoading && !song ? <EmptyState title="Song not found." /> : null}

      {song ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(220px,320px)_minmax(0,1fr)]">
          <section className="space-y-3">
            <CoverArtImage
              src={coverUrl}
              alt={`${song.title} cover art`}
              className="w-full overflow-hidden border border-terminal-text/30"
              imageClassName="aspect-square"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={() => setQueue([song], 0, true)}>
                play song
              </button>
              <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={() => addToQueue([song])}>
                add to queue
              </button>
              <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={() => openLyricsPanel(song)}>
                lyrics
              </button>
            </div>
          </section>

          <section className="space-y-2 text-xs">
            <div>
              <div className="text-terminal-muted">artist</div>
              {song.artistId ? (
                <Link
                  to={`/artist/${song.artistId}`}
                  className="text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-green"
                  aria-label={`Open artist ${song.artist ?? 'Unknown artist'}`}
                >
                  {song.artist ?? 'Unknown artist'}
                </Link>
              ) : (
                <div className="text-terminal-text">{song.artist ?? 'Unknown artist'}</div>
              )}
            </div>
            <div>
              <div className="text-terminal-muted">album</div>
              {song.albumId ? (
                <Link
                  to={`/album/${song.albumId}`}
                  className="text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-green"
                  aria-label={`Open album ${song.album ?? 'Unknown album'}`}
                >
                  {song.album ?? 'Unknown album'}
                </Link>
              ) : (
                <div className="text-terminal-text">{song.album ?? 'Unknown album'}</div>
              )}
            </div>
            {song.genre ? (
              <div>
                <div className="text-terminal-muted">genre</div>
                <div className="text-terminal-text">{song.genre}</div>
              </div>
            ) : null}
            {song.year ? (
              <div>
                <div className="text-terminal-muted">year</div>
                <div className="text-terminal-text">{song.year}</div>
              </div>
            ) : null}
            <div>
              <div className="text-terminal-muted">duration</div>
              <div className="text-terminal-text">{formatDuration(song.duration ?? 0)}</div>
            </div>
          </section>
        </div>
      ) : null}
    </TerminalPanel>
  )
}
