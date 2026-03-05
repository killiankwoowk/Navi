import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { EmptyState } from '@/components/common/EmptyState'
import { TerminalPanel } from '@/components/common/TerminalPanel'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PlaylistView } from '@/pages/PlaylistView/PlaylistView'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'
import { useUsageStore } from '@/store/usageStore'

export const MostPlayed = () => {
  useDocumentTitle('Most Played | Navi Terminal Player')

  const setQueue = usePlayerStore((state) => state.setQueue)
  const addToQueue = usePlayerStore((state) => state.addToQueue)
  const openLyricsPanel = useUiStore((state) => state.openLyricsPanel)
  const usageEntries = useUsageStore((state) => state.entries)

  const query = useQuery({
    queryKey: ['most-played'],
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getMostPlayed(80)
    },
    staleTime: 5 * 60_000,
  })

  const fallbackTracks = useMemo(
    () =>
      Object.values(usageEntries)
        .sort((a, b) => b.playCount - a.playCount || b.lastPlayedAt - a.lastPlayedAt)
        .map((entry) => entry.song)
        .slice(0, 80),
    [usageEntries],
  )

  const tracks = query.data?.length ? query.data : fallbackTracks

  return (
    <TerminalPanel title="Most Played">
      {!query.isLoading && tracks.length === 0 ? (
        <EmptyState title="No play history yet." hint="Start playing tracks and this page will fill automatically." />
      ) : (
        <PlaylistView
          title={query.data?.length ? 'Server Most Played' : 'Local Usage Fallback'}
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
