import type { QueueItem } from '@/api/types'

export const getCurrentQueueItem = (queue: QueueItem[], currentIndex: number): QueueItem | null => {
  if (!queue.length || currentIndex < 0 || currentIndex >= queue.length) {
    return null
  }
  return queue[currentIndex]
}
