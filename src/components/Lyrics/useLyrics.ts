import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { LyricsEntry, Song } from '@/api/types'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { useSettingsStore } from '@/store/settingsStore'
import { parseLrc } from '@/utils/parseLRC'

interface LyricsState {
  entries: LyricsEntry[]
  plainText: string | null
  sourceLabel: string
  isSynced: boolean
}

const emptyState: LyricsState = {
  entries: [],
  plainText: null,
  sourceLabel: 'none',
  isSynced: false,
}

const toUnsyncedEntries = (text: string): LyricsEntry[] =>
  text
    .split('\n')
    .map((line, index) => ({ time: index * 4000, text: line.trim() }))
    .filter((line) => line.text.length > 0)

const parseLyricsText = (lyricsText: string): { entries: LyricsEntry[]; isSynced: boolean } => {
  if (/\[\d{1,2}:\d{2}/.test(lyricsText)) {
    const entries = parseLrc(lyricsText)
    return {
      entries,
      isSynced: entries.length > 0,
    }
  }

  return {
    entries: toUnsyncedEntries(lyricsText),
    isSynced: false,
  }
}

const decodeHtmlEntities = (value: string): string => {
  const element = document.createElement('textarea')
  element.innerHTML = value
  return element.value
}

const fetchGeniusLyrics = async (song: Song, apiKey: string): Promise<string | null> => {
  const artist = song.artist ?? ''
  const title = song.title ?? ''
  if (!title.trim()) return null

  const searchResponse = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(`${artist} ${title}`)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  if (!searchResponse.ok) return null

  const searchPayload = (await searchResponse.json()) as {
    response?: { hits?: Array<{ result?: { path?: string } }> }
  }

  const path = searchPayload.response?.hits?.[0]?.result?.path
  if (!path) return null

  const lyricsPageResponse = await fetch(`https://genius.com${path}`)
  if (!lyricsPageResponse.ok) return null

  const lyricsPage = await lyricsPageResponse.text()
  const doc = new DOMParser().parseFromString(lyricsPage, 'text/html')
  const lyricsNodes = Array.from(doc.querySelectorAll('[data-lyrics-container="true"]'))
  if (lyricsNodes.length > 0) {
    return lyricsNodes.map((node) => decodeHtmlEntities(node.textContent ?? '')).join('\n').trim()
  }

  return null
}

export const useLyrics = (song: Song | null) => {
  const lyricsEnabled = useSettingsStore((state) => state.lyricsEnabled)
  const lyricsSource = useSettingsStore((state) => state.lyricsSource)

  const query = useQuery({
    queryKey: ['lyrics', song?.id, lyricsSource],
    enabled: Boolean(song?.id) && lyricsEnabled,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<LyricsState> => {
      if (!song) return emptyState

      const geniusApiKey = (import.meta.env.VITE_GENIUS_API_KEY as string | undefined)?.trim()
      const client = getNavidromeClientOrNull()

      if (lyricsSource !== 'local' && geniusApiKey) {
        try {
          const geniusLyrics = await fetchGeniusLyrics(song, geniusApiKey)
          if (geniusLyrics) {
            const parsed = parseLyricsText(geniusLyrics)
            return {
              entries: parsed.entries,
              plainText: geniusLyrics,
              sourceLabel: 'genius',
              isSynced: parsed.isSynced,
            }
          }
        } catch {
          // Fall through to server/local sources.
        }
      }

      if (lyricsSource !== 'genius' && client) {
        const serverLyrics = await client.getLyrics(song.artist, song.title, song.id).catch(() => null)
        if (serverLyrics?.synced || serverLyrics?.plain) {
          const candidateText = serverLyrics.synced ?? serverLyrics.plain ?? ''
          const parsed = parseLyricsText(candidateText)
          return {
            entries: parsed.entries,
            plainText: serverLyrics.plain ?? candidateText,
            sourceLabel: serverLyrics.provider,
            isSynced: parsed.isSynced,
          }
        }
      }

      const localCandidate = song.syncedLyrics ?? song.lyrics ?? song.unsyncedLyrics ?? ''
      if (localCandidate.trim()) {
        const parsed = parseLyricsText(localCandidate)
        return {
          entries: parsed.entries,
          plainText: localCandidate,
          sourceLabel: 'local',
          isSynced: parsed.isSynced,
        }
      }

      return emptyState
    },
  })

  return useMemo(
    () => ({
      entries: query.data?.entries ?? [],
      plainText: query.data?.plainText ?? null,
      sourceLabel: query.data?.sourceLabel ?? 'none',
      isSynced: query.data?.isSynced ?? false,
      isLoading: query.isLoading,
      hasLyrics: Boolean(query.data?.entries?.length || query.data?.plainText),
    }),
    [query.data, query.isLoading],
  )
}
