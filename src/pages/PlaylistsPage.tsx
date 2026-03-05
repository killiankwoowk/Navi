import { useMemo, useState } from 'react'

import { CreatePlaylistModal } from '@/components/playlists/CreatePlaylistModal'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { useCreatePlaylist, usePlaylistDetailQuery, usePlaylistsQuery, useRemoveSongFromPlaylist } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { formatDuration } from '@/utils/format'

export const PlaylistsPage = () => {
  useDocumentTitle('Playlists | Navi Terminal Player')

  const [selectedId, setSelectedId] = useState<string>('')
  const [createOpen, setCreateOpen] = useState(false)

  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)

  const playlistsQuery = usePlaylistsQuery()
  const selectedPlaylistId = selectedId || playlistsQuery.data?.[0]?.id || ''
  const playlistDetailQuery = usePlaylistDetailQuery(selectedPlaylistId)
  const createPlaylist = useCreatePlaylist()
  const removeSongMutation = useRemoveSongFromPlaylist()

  const tracks = useMemo(() => playlistDetailQuery.data?.entry ?? [], [playlistDetailQuery.data?.entry])

  return (
    <>
      <TerminalPanel
        title="Playlists"
        rightSlot={
          <button className="terminal-button h-8" type="button" onClick={() => setCreateOpen(true)}>
            + create
          </button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-1">
            {playlistsQuery.isLoading ? <LoadingRows rows={4} /> : null}
            {(playlistsQuery.data ?? []).map((playlist) => (
              <button
                key={playlist.id}
                className={`block w-full border px-3 py-2 text-left text-sm ${
                  playlist.id === selectedPlaylistId
                    ? 'border-terminal-accent text-terminal-accent'
                    : 'border-terminal-text/20 hover:border-terminal-accent/70'
                }`}
                type="button"
                onClick={() => setSelectedId(playlist.id)}
              >
                {playlist.name}
                <span className="ml-2 text-[11px] text-terminal-muted">[{playlist.songCount ?? 0}]</span>
              </button>
            ))}
            {!playlistsQuery.isLoading && (playlistsQuery.data?.length ?? 0) === 0 ? (
              <EmptyState title="No playlists yet." hint="Create one from the button above." />
            ) : null}
          </aside>
          <section className="space-y-1">
            {playlistDetailQuery.isLoading ? <LoadingRows rows={6} /> : null}
            {!playlistDetailQuery.isLoading && !playlistDetailQuery.data ? <EmptyState title="Select a playlist." /> : null}
            {tracks.map((track, index) => (
              <div key={track.id} className="grid grid-cols-[26px_1fr_auto] items-center gap-2 border border-terminal-text/20 px-2 py-1">
                <span className="text-[11px] text-terminal-muted">{index + 1}</span>
                <button className="truncate text-left text-sm" type="button" onClick={() => setQueue(tracks, index, true)}>
                  {track.title}
                </button>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-terminal-muted">{formatDuration(track.duration ?? 0)}</span>
                  <button className="terminal-button px-1 py-0" type="button" onClick={() => addToQueue([track])}>
                    +q
                  </button>
                  <button
                    className="terminal-button px-1 py-0"
                    type="button"
                    onClick={() =>
                      removeSongMutation.mutate({
                        playlistId: selectedPlaylistId,
                        songIndex: index,
                      })
                    }
                  >
                    rm
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </TerminalPanel>
      <CreatePlaylistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        isBusy={createPlaylist.isPending}
        onSubmit={async (name) => {
          await createPlaylist.mutateAsync({ name })
        }}
      />
    </>
  )
}
