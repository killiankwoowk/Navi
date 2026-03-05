import { describe, expect, it } from 'vitest'

import { parseLrc } from '@/utils/parseLRC'

describe('parseLrc', () => {
  it('parses time tags and sorts output entries', () => {
    const input = `
[00:10.00]line one
[00:02.500][00:05.000]line two
invalid line
`
    const entries = parseLrc(input)

    expect(entries).toEqual([
      { time: 2500, text: 'line two' },
      { time: 5000, text: 'line two' },
      { time: 10000, text: 'line one' },
    ])
  })

  it('ignores lines without timestamp tags', () => {
    const entries = parseLrc('plain text only')
    expect(entries).toEqual([])
  })
})
