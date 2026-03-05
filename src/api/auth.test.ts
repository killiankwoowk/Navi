import { describe, expect, it } from 'vitest'

import { buildAuthQuery } from '@/api/auth'
import { md5 } from '@/utils/crypto'

describe('buildAuthQuery', () => {
  it('builds required Subsonic auth parameters', () => {
    const auth = buildAuthQuery({
      serverUrl: 'http://localhost:4533',
      username: 'admin',
      password: 'secret',
    })

    expect(auth.u).toBe('admin')
    expect(auth.v).toBe('1.16.1')
    expect(auth.c).toBe('navi-terminal')
    expect(auth.f).toBe('json')
    expect(auth.s).toHaveLength(8)
    expect(auth.t).toBe(md5(`secret${auth.s}`))
  })
})
