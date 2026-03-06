import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useArtistsQuery } from '@/features/library/useLibrary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export const ArtistsPage = () => {
  useDocumentTitle('Artists | Navi Terminal Player')

  const [filter, setFilter] = useState('')
  const artistsQuery = useArtistsQuery()

  const artists = useMemo(
    () =>
      (artistsQuery.data ?? [])
        .flatMap((index) => index.artist ?? [])
        .filter((artist) => artist.name.toLowerCase().includes(filter.trim().toLowerCase())),
    [artistsQuery.data, filter],
  )

  return (
    <TerminalPanel
      title="Artists"
      rightSlot={
        <input
          className="terminal-input h-9 w-44 px-2 text-[11px] uppercase tracking-[0.12em]"
          placeholder="filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter artists"
        />
      }
    >
      {artistsQuery.isLoading ? <LoadingRows /> : null}
      {!artistsQuery.isLoading && artists.length === 0 ? <EmptyState title="No artists found." /> : null}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artist/${artist.id}`}
            className="terminal-card flex min-h-20 items-center border border-terminal-text/25 px-3 py-2 text-sm transition-colors hover:border-terminal-accent hover:text-terminal-accent"
          >
            <span className="text-terminal-muted">&gt; </span>
            {artist.name}
          </Link>
        ))}
      </div>
    </TerminalPanel>
  )
}
