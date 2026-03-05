import { md5, randomSalt } from '@/utils/crypto'
import { API_CLIENT_NAME, API_FORMAT, API_VERSION } from '@/utils/constants'

import type { SubsonicCredentials } from './types'

export interface AuthQueryParams {
  u: string
  t: string
  s: string
  v: string
  c: string
  f: string
}

export const buildAuthQuery = (credentials: SubsonicCredentials): AuthQueryParams => {
  const s = randomSalt()
  const t = md5(`${credentials.password}${s}`)

  return {
    u: credentials.username,
    t,
    s,
    v: API_VERSION,
    c: API_CLIENT_NAME,
    f: API_FORMAT,
  }
}

export const normalizeServerUrl = (serverUrl: string): string => {
  const trimmed = serverUrl.trim()
  if (!trimmed) return ''

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return withProtocol.replace(/\/+$/, '')
}

export const createRestUrl = (serverUrl: string): string => `${normalizeServerUrl(serverUrl)}/rest`
