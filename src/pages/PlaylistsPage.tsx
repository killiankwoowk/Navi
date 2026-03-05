import { useMemo, useState } from 'react'

import { CreatePlaylistModal } from '@/components/playlists/CreatePlaylistModal'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingRows } from '@/components/common/LoadingRows'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { PlaylistView } from '@/pages/PlaylistView/PlaylistView'
import { useCreatePlaylist, usePlaylistDetailQuery, usePlaylistsQuery, useRemoveSongFromPlaylist } from '@/features/playlists/usePlaylists'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'

export const PlaylistsPage = () => {
  useDocumentTitle('Playlists | Navi Terminal Player')

  const [selectedId, setSelectedId] = useState<string>('')
  const [createOpen, setCreateOpen] = useState(false)

  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const openLyricsPanel = useUiStore((state) => state.openLyricsPanel)

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
            {playlistDetailQuery.data ? (
              <PlaylistView
                title={playlistDetailQuery.data.name}
                tracks={tracks}
                isLoading={playlistDetailQuery.isLoading}
                onPlayTrack={(_, index) => setQueue(tracks, index, true)}
                onQueueTrack={(track) => addToQueue([track])}
                onOpenLyrics={(track) => openLyricsPanel(track)}
                onRemoveTrack={(_, index) =>
                  removeSongMutation.mutate({
                    playlistId: selectedPlaylistId,
                    songIndex: index,
                  })
                }
              />
            ) : null}
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
