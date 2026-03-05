import { describe, expect, it } from 'vitest'

import type { QueueItem } from '@/api/types'
import { buildShuffleOrder, reorderQueueItems, resolveNextIndex, resolvePreviousIndex } from '@/player/queue'

describe('queue helpers', () => {
  it('reorders items and preserves all entries', () => {
    const queue: QueueItem[] = [
      { queueId: 'a', track: { id: '1', title: 'One' } },
      { queueId: 'b', track: { id: '2', title: 'Two' } },
      { queueId: 'c', track: { id: '3', title: 'Three' } },
    ]

    const reordered = reorderQueueItems(queue, 0, 2)
    expect(reordered.map((item) => item.queueId)).toEqual(['b', 'c', 'a'])
  })

  it('resolves next index with repeat-all at queue end', () => {
    expect(resolveNextIndex(2, 3, 'all', false, [])).toBe(0)
  })

  it('resolves previous index with repeat-all at queue start', () => {
    expect(resolvePreviousIndex(0, 3, 'all', false, [])).toBe(2)
  })

  it('builds shuffle order anchored at current index', () => {
    const order = buildShuffleOrder(8, 3)
    expect(order[0]).toBe(3)
    expect(new Set(order).size).toBe(8)
  })
})
