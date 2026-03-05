import { useQuery } from '@tanstack/react-query'

import { EmptyState } from '@/components/common/EmptyState'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PlaylistView } from '@/pages/PlaylistView/PlaylistView'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'

export const Favorites = () => {
  useDocumentTitle('Favorites | Navi Terminal Player')

  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const openLyricsPanel = useUiStore((state) => state.openLyricsPanel)

  const query = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getStarred()
    },
    staleTime: 5 * 60_000,
  })

  const tracks = query.data ?? []

  return (
    <TerminalPanel title="Favorites">
      {!query.isLoading && tracks.length === 0 ? (
        <EmptyState title="No favorites found." hint="Star tracks in Navidrome to populate this page." />
      ) : (
        <PlaylistView
          title="Favorites"
          tracks={tracks}
          isLoading={query.isLoading}
          onPlayTrack={(_, index) => setQueue(tracks, index, true)}
          onQueueTrack={(track) => addToQueue([track])}
          onOpenLyrics={(track) => openLyricsPanel(track)}
        />
      )}
    </TerminalPanel>
  )
}
