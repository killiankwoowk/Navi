import type { FormEvent } from 'react'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { AddToPlaylistMenu } from '@/components/playlists/AddToPlaylistMenu'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useSearchQuery } from '@/features/search/useSearch'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useViewportMode } from '@/hooks/useViewportMode'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'
import { SEARCH_DEBOUNCE_MS } from '@/utils/constants'
import { formatDuration } from '@/utils/format'

export const SearchPage = () => {
  useDocumentTitle('Search | Navi Terminal Player')

  const viewportMode = useViewportMode()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)
  const searchQuery = useSearchQuery(debouncedQuery)
  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const mobileSearchTab = useUiStore((state) => state.mobileSearchTab)
  const setMobileSearchTab = useUiStore((state) => state.setMobileSearchTab)

  const syncQueryParam = (value: string) => {
    if (!value.trim()) {
      setSearchParams({})
      return
    }
    setSearchParams({ q: value.trim() })
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    syncQueryParam(query)
  }

  const songs = useMemo(() => searchQuery.data?.song ?? [], [searchQuery.data?.song])
  const isMobile = viewportMode === 'mobile'

  return (
    <TerminalPanel
      title="Search"
      rightSlot={
        <form className="flex items-center gap-2" onSubmit={onSubmit}>
          <input
            className={`terminal-input ${isMobile ? 'h-11 w-44' : 'h-8 w-52'} px-2 text-[11px] uppercase tracking-[0.12em]`}
            placeholder="query"
            value={query}
            aria-label="Search query"
            onChange={(event) => {
              syncQueryParam(event.target.value)
            }}
          />
          <button className={`terminal-button ${isMobile ? 'min-h-11' : 'h-8'} px-2`} type="submit">
            search
          </button>
        </form>
      }
    >
      {isMobile ? (
        <div className="mb-3 flex items-center gap-1">
          {(['songs', 'albums', 'artists'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`terminal-button min-h-11 px-2 py-1 ${mobileSearchTab === tab ? 'border-terminal-accent text-terminal-accent' : ''}`}
              onClick={() => setMobileSearchTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}

      {searchQuery.isFetching ? <LoadingRows rows={4} /> : null}
      {!searchQuery.isFetching && !debouncedQuery.trim() ? <EmptyState title="Type to search artists, albums, songs." /> : null}
      {searchQuery.data ? (
        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'xl:grid-cols-3'}`}>
          {(mobileSearchTab === 'artists' || !isMobile) && (
            <section className="space-y-2">
              <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">artists</h3>
              {(searchQuery.data.artist ?? []).map((artist) => (
                <Link
                  key={artist.id}
                  to={`/artist/${artist.id}`}
                  className="block min-h-11 border border-terminal-text/25 px-2 py-2 text-sm hover:border-terminal-accent hover:text-terminal-accent"
                >
                  {artist.name}
                </Link>
              ))}
            </section>
          )}
          {(mobileSearchTab === 'albums' || !isMobile) && (
            <section className="space-y-2">
              <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">albums</h3>
              {(searchQuery.data.album ?? []).map((album) => (
                <Link
                  key={album.id}
                  to={`/album/${album.id}`}
                  className="block min-h-11 border border-terminal-text/25 px-2 py-2 text-sm hover:border-terminal-accent hover:text-terminal-accent"
                >
                  {album.name}
                </Link>
              ))}
            </section>
          )}
          {(mobileSearchTab === 'songs' || !isMobile) && (
            <section className="space-y-2">
              <h3 className="m-0 text-xs uppercase tracking-[0.15em] text-terminal-muted">songs</h3>
              {songs.map((song, index) => (
                <div key={song.id} className="grid grid-cols-[1fr_auto] items-center gap-1 border border-terminal-text/25 px-2 py-1">
                  <Link
                    to={`/song/${song.id}`}
                    className="min-h-11 truncate text-left text-sm focus:outline-none focus:ring-2 focus:ring-terminal-green"
                    aria-label={`Open song ${song.title}`}
                  >
                    {song.title}
                  </Link>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-terminal-muted">{formatDuration(song.duration ?? 0)}</span>
                    <button
                      className="terminal-button min-h-11 px-1 py-0"
                      type="button"
                      onClick={() => setQueue(songs, index, true)}
                      aria-label={`Play ${song.title}`}
                    >
                      play
                    </button>
                    <button className="terminal-button min-h-11 px-1 py-0" type="button" onClick={() => addToQueue([song])}>
                      +q
                    </button>
                    <AddToPlaylistMenu songId={song.id} />
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      ) : null}
    </TerminalPanel>
  )
}
