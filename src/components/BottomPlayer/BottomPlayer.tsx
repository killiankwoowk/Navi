import { useMemo } from 'react'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { getCurrentQueueItem } from '@/player/playback'
import { usePlayerStore } from '@/store/playerStore'
import { getSongCoverArtId } from '@/utils/image'

import { Scrubber } from './Scrubber'

export const BottomPlayer = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const previous = usePlayerStore((state) => state.previous)

  const currentItem = useMemo(() => getCurrentQueueItem(queue, currentTrackId), [currentTrackId, queue])
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const coverUrl = useMemo(() => {
    const coverArtId = getSongCoverArtId(currentItem?.track)
    if (!coverArtId || !client) return undefined
    return client.getCoverArt(coverArtId, 200)
  }, [client, currentItem])

  if (!currentItem) return null

  return (
    <footer className="bg-nothing-800 border-t border-nothing-700 h-20 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        <img
          src={coverUrl}
          alt={`${currentItem.track.title} cover`}
          className="w-14 h-14 rounded-sm object-cover bg-nothing-700"
        />
        <div className="min-w-0">
          <p className="font-semibold text-nothing-100 truncate">{currentItem.track.title}</p>
          <p className="text-sm text-nothing-300 truncate">{currentItem.track.artist ?? 'Unknown Artist'}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-nothing-300 hover:text-nothing-100 focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={() => previous(0)}
            aria-label="Previous track"
          >
            prev
          </button>
          <button
            type="button"
            className="bg-accent text-white rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? 'pause' : 'play'}
          </button>
          <button
            type="button"
            className="text-nothing-300 hover:text-nothing-100 focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={next}
            aria-label="Next track"
          >
            next
          </button>
        </div>
        <Scrubber />
      </div>

      <div className="flex items-center justify-end gap-4 w-1/4 text-nothing-300">
        <span className="text-xs">queue</span>
        <span className="text-xs">volume</span>
      </div>
    </footer>
  )
}
