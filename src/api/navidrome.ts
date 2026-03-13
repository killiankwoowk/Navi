import { buildAuthQuery, createRestUrl } from '@/api/auth'

import { createApiClient } from './client'
import type {
  Album,
  ArtistIndex,
  LyricsPayload,
  NavidromeClient,
  Playlist,
  Search3Result,
  Song,
  StreamOptions,
  SubsonicCredentials,
  UpdatePlaylistInput,
} from './types'

const arrayify = <T>(value?: T | T[]): T[] => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const stripTimestampTags = (lyricsText: string): string => lyricsText.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, '').trim()

export const createNavidromeClient = (credentials: SubsonicCredentials): NavidromeClient => {
  const { instance, unwrap } = createApiClient(credentials)

  const getAlbum = async (id: string): Promise<Album> => {
    const response = await instance.get('/getAlbum.view', {
      params: { id },
    })
    const data = unwrap<{ album: Album }>(response.data)
    return {
      ...data.album,
      song: arrayify(data.album.song),
    }
  }

  const getAlbumList = async (type = 'alphabeticalByName', size = 50, offset = 0): Promise<Album[]> => {
    const response = await instance.get('/getAlbumList.view', {
      params: { type, size, offset },
    })
    const data = unwrap<{ albumList?: { album?: Album | Album[] } }>(response.data)
    return arrayify(data.albumList?.album)
  }

  const songsFromAlbumType = async (type: string, limit: number): Promise<Song[]> => {
    const albums = await getAlbumList(type, Math.max(20, limit), 0).catch(() => [])
    if (!albums.length) return []

    const detailedAlbums = await Promise.all(
      albums.slice(0, Math.min(albums.length, 12)).map((album) => getAlbum(album.id).catch(() => null)),
    )

    return detailedAlbums
      .flatMap((album) => album?.song ?? [])
      .filter((song) => Boolean(song.id))
      .slice(0, limit)
  }

  const streamViewUrl = (songId: string, opts?: StreamOptions): string => {
    const auth = buildAuthQuery(credentials)
    const params = new URLSearchParams({
      ...auth,
      id: songId,
    })

    if (opts?.maxBitRate) {
      params.set('maxBitRate', String(opts.maxBitRate))
    }

    if (opts?.format) {
      params.set('format', opts.format)
    }

    return `${createRestUrl(credentials.serverUrl)}/stream.view?${params.toString()}`
  }

  const getCoverArt = (coverArtId: string, size = 360): string => {
    const auth = buildAuthQuery(credentials)
    const params = new URLSearchParams({
      ...auth,
      id: coverArtId,
      size: String(size),
    })

    return `${createRestUrl(credentials.serverUrl)}/getCoverArt.view?${params.toString()}`
  }

  const parseLyricsResponse = (payload: Record<string, unknown>): LyricsPayload | null => {
    const lyricsContainer = (payload.lyrics ?? payload.lyricsList ?? payload) as Record<string, unknown>
    const plainCandidate = (lyricsContainer.value ??
      lyricsContainer.lyrics ??
      payload.value ??
      payload.lyrics) as string | undefined
    const syncedCandidate = (lyricsContainer.synced ?? lyricsContainer.lrc ?? payload.syncedLyrics) as string | undefined

    const plain = typeof plainCandidate === 'string' ? plainCandidate : null
    let synced = typeof syncedCandidate === 'string' ? syncedCandidate : null

    if (!synced && plain && /\[\d{1,2}:\d{2}/.test(plain)) {
      synced = plain
    }

    if (!plain && !synced) {
      return null
    }

    return {
      plain: plain ?? (synced ? stripTimestampTags(synced) : null),
      synced,
      provider: 'server',
    }
  }

  return {
    login: async () => {
      await instance.get('/getArtists.view').then((response) => unwrap(response.data))
    },
    getArtists: async () => {
      const response = await instance.get('/getArtists.view')
      const data = unwrap<{ artists?: { index?: ArtistIndex | ArtistIndex[] } }>(response.data)
      return arrayify(data.artists?.index).map((index) => ({
        ...index,
        artist: arrayify(index.artist),
      }))
    },
    getArtist: async (id: string) => {
      const response = await instance.get('/getArtist.view', {
        params: { id },
      })
      const data = unwrap<{ artist: { id: string; name: string; album?: Album | Album[]; song?: Song | Song[] } }>(response.data)
      return {
        artist: {
          id: data.artist.id,
          name: data.artist.name,
        },
        album: arrayify(data.artist.album),
        song: arrayify(data.artist.song),
      }
    },
    getAlbum,
    getAlbumList,
    getSong: async (id: string) => {
      const response = await instance.get('/getSong.view', {
        params: { id },
      })
      const data = unwrap<{ song: Song }>(response.data)
      return data.song
    },
    search3: async (query: string, artistCount = 10, albumCount = 10, songCount = 20) => {
      const response = await instance.get('/search3.view', {
        params: { query, artistCount, albumCount, songCount },
      })
      const data = unwrap<{ searchResult3?: { artist?: unknown[]; album?: unknown[]; song?: unknown[] } }>(response.data)
      return {
        artist: (data.searchResult3?.artist ?? []) as Search3Result['artist'],
        album: (data.searchResult3?.album ?? []) as Search3Result['album'],
        song: (data.searchResult3?.song ?? []) as Search3Result['song'],
      }
    },
    getStarred: async () => {
      try {
        const response = await instance.get('/getStarred.view')
        const data = unwrap<{ starred?: { song?: Song | Song[] }; starred2?: { song?: Song | Song[] } }>(response.data)
        return arrayify(data.starred2?.song ?? data.starred?.song)
      } catch {
        return []
      }
    },
    getMostPlayed: async (limit = 50) => {
      try {
        const response = await instance.get('/getMostPlayed.view', { params: { count: limit } })
        const data = unwrap<{
          mostPlayed?: { song?: Song | Song[] }
          topSongs?: { song?: Song | Song[] }
          song?: Song | Song[]
        }>(response.data)
        const directSongs = arrayify(data.mostPlayed?.song ?? data.topSongs?.song ?? data.song)
        if (directSongs.length) return directSongs.slice(0, limit)
      } catch {
        // Graceful fallback below.
      }

      return songsFromAlbumType('frequent', limit)
    },
    getRecentSongs: async (limit = 50) => {
      try {
        const response = await instance.get('/getRecentSongs.view', { params: { count: limit } })
        const data = unwrap<{ recentSongs?: { song?: Song | Song[] }; song?: Song | Song[] }>(response.data)
        const directSongs = arrayify(data.recentSongs?.song ?? data.song)
        if (directSongs.length) return directSongs.slice(0, limit)
      } catch {
        // Graceful fallback below.
      }

      return songsFromAlbumType('recent', limit)
    },
    getLyrics: async (artist, title, songId) => {
      const attempts: Array<() => Promise<Record<string, unknown>>> = []

      if (songId) {
        attempts.push(async () => {
          const response = await instance.get('/getLyricsBySongId.view', {
            params: { id: songId },
          })
          return unwrap<Record<string, unknown>>(response.data)
        })
      }

      if (artist || title) {
        attempts.push(async () => {
          const response = await instance.get('/getLyrics.view', {
            params: { artist, title },
          })
          return unwrap<Record<string, unknown>>(response.data)
        })
      }

      for (const runAttempt of attempts) {
        try {
          const payload = await runAttempt()
          const parsed = parseLyricsResponse(payload)
          if (parsed) return parsed
        } catch {
          // Continue to the next source.
        }
      }

      return null
    },
    getPlaylists: async () => {
      const response = await instance.get('/getPlaylists.view')
      const data = unwrap<{ playlists?: { playlist?: Playlist | Playlist[] } }>(response.data)
      return arrayify(data.playlists?.playlist)
    },
    getPlaylist: async (id: string) => {
      const response = await instance.get('/getPlaylist.view', {
        params: { id },
      })
      const data = unwrap<{ playlist: Playlist }>(response.data)
      return {
        ...data.playlist,
        entry: arrayify(data.playlist.entry),
      }
    },
    createPlaylist: async (name: string, songIds = []) => {
      const response = await instance.get('/createPlaylist.view', {
        params: {
          name,
          songId: songIds,
        },
        paramsSerializer: {
          indexes: null,
        },
      })
      const data = unwrap<{ playlist: Playlist }>(response.data)
      return data.playlist
    },
    updatePlaylist: async (input: UpdatePlaylistInput) => {
      await instance.get('/updatePlaylist.view', {
        params: {
          playlistId: input.playlistId,
          name: input.name,
          comment: input.comment,
          public: typeof input.public === 'boolean' ? String(input.public) : undefined,
          songIdToAdd: input.songIdToAdd,
          songIndexToRemove: input.songIndexToRemove,
        },
        paramsSerializer: {
          indexes: null,
        },
      })
    },
    scrobble: async (songId: string, submission = true) => {
      await instance.get('/scrobble.view', {
        params: {
          id: songId,
          submission: submission ? 'true' : 'false',
        },
      })
    },
    streamViewUrl,
    getStreamUrl: streamViewUrl,
    getCoverArt,
    getCoverArtUrl: getCoverArt,
  }
}
