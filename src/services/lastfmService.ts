import { md5 } from '@/utils/crypto'

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/'

export interface LastfmSession {
  key: string
  name: string
}

export interface LastfmClientConfig {
  apiKey: string
  apiSecret: string
  sessionKey: string
  username?: string
}

export interface LastfmNowPlayingInput {
  artist: string
  track: string
  album?: string
  duration?: number
}

export interface LastfmScrobbleInput {
  artist: string
  track: string
  album?: string
  duration?: number
  timestamp: number
}

const buildSignature = (params: Record<string, string>, secret: string): string => {
  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join('')
  return md5(`${signatureBase}${secret}`)
}

const postLastfm = async <T>(params: Record<string, string>, secret?: string): Promise<T> => {
  const payload = {
    ...params,
    format: 'json',
  }

  const { format: _format, ...signatureParams } = payload
  void _format

  const signedPayload = secret
    ? {
        ...payload,
        api_sig: buildSignature(signatureParams, secret),
      }
    : payload

  const response = await fetch(LASTFM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(signedPayload),
  })

  const data = (await response.json()) as { error?: number; message?: string } & T
  if (data.error) {
    throw new Error(data.message ?? 'Last.fm API error')
  }
  return data
}

export const getLastfmAuthUrl = (apiKey: string, token: string, callbackUrl: string): string => {
  const params = new URLSearchParams({ api_key: apiKey, token, cb: callbackUrl })
  return `https://www.last.fm/api/auth/?${params.toString()}`
}

export const getLastfmAuthToken = async (apiKey: string, apiSecret: string): Promise<string> => {
  const params: Record<string, string> = {
    api_key: apiKey,
    method: 'auth.getToken',
    format: 'json',
  }
  const payload = await postLastfm<{ token: string }>(params, apiSecret)
  return payload.token
}

export const getLastfmSession = async (apiKey: string, apiSecret: string, token: string): Promise<LastfmSession> => {
  const payload = await postLastfm<{ session: LastfmSession }>(
    {
      api_key: apiKey,
      method: 'auth.getSession',
      token,
      format: 'json',
    },
    apiSecret,
  )
  return payload.session
}

export const createLastfmClient = ({ apiKey, apiSecret, sessionKey }: LastfmClientConfig) => ({
  updateNowPlaying: async (input: LastfmNowPlayingInput): Promise<void> => {
    await postLastfm(
      {
        api_key: apiKey,
        method: 'track.updateNowPlaying',
        sk: sessionKey,
        artist: input.artist,
        track: input.track,
        album: input.album ?? '',
        duration: input.duration ? String(Math.round(input.duration)) : '',
        format: 'json',
      },
      apiSecret,
    )
  },
  scrobble: async (input: LastfmScrobbleInput): Promise<void> => {
    await postLastfm(
      {
        api_key: apiKey,
        method: 'track.scrobble',
        sk: sessionKey,
        artist: input.artist,
        track: input.track,
        album: input.album ?? '',
        duration: input.duration ? String(Math.round(input.duration)) : '',
        timestamp: String(input.timestamp),
        format: 'json',
      },
      apiSecret,
    )
  },
})
