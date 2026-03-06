import type { QueueItem } from '@/api/types'
import { resolveCurrentIndex } from '@/player/queue'

export const getCurrentQueueItem = (queue: QueueItem[], currentTrackId: string | null): QueueItem | null => {
  const currentIndex = resolveCurrentIndex(queue, currentTrackId)
  if (!queue.length || currentIndex < 0 || currentIndex >= queue.length) {
    return null
  }
  return queue[currentIndex]
}
