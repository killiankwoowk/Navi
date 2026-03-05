import type { AudioQuality } from '@/api/types'

/**
 * Builds a Subsonic stream URL with optional max bitrate.
 */
export function getStreamUrl({
  baseUrl,
  songId,
  username,
  token,
  maxBitRate,
}: {
  baseUrl: string
  songId: string
  username: string
  token: string
  maxBitRate?: number | 'auto'
}) {
  const u = encodeURIComponent(username)
  const t = encodeURIComponent(token)
  const params = new URLSearchParams({ id: songId, u, t })
  if (maxBitRate && maxBitRate !== 'auto') params.set('maxBitRate', String(maxBitRate))
  return `${baseUrl.replace(/\/$/, '')}/rest/stream.view?${params.toString()}`
}

/**
 * Maps UI audio-quality presets to Subsonic maxBitRate values.
 */
export const getMaxBitRateForQuality = (quality: AudioQuality): number | undefined => {
  switch (quality) {
    case 'low':
      return 128
    case 'medium':
      return 192
    case 'high':
      return 320
    default:
      return undefined
  }
}
