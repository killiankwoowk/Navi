import { buildAuthQuery, createRestUrl } from '@/api/auth'

import { createApiClient } from './client'
import type {
  Album,
  ArtistIndex,
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

export const createNavidromeClient = (credentials: SubsonicCredentials): NavidromeClient => {
  const { instance, unwrap } = createApiClient(credentials)

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
    getAlbum: async (id: string) => {
      const response = await instance.get('/getAlbum.view', {
        params: { id },
      })
      const data = unwrap<{ album: Album }>(response.data)
      return {
        ...data.album,
        song: arrayify(data.album.song),
      }
    },
    getAlbumList: async (type = 'alphabeticalByName', size = 50, offset = 0) => {
      const response = await instance.get('/getAlbumList.view', {
        params: { type, size, offset },
      })
      const data = unwrap<{ albumList?: { album?: Album | Album[] } }>(response.data)
      return arrayify(data.albumList?.album)
    },
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
    getStreamUrl: (songId: string, opts?: StreamOptions) => {
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
    },
    getCoverArtUrl: (coverArtId: string, size = 360) => {
      const auth = buildAuthQuery(credentials)
      const params = new URLSearchParams({
        ...auth,
        id: coverArtId,
        size: String(size),
      })

      return `${createRestUrl(credentials.serverUrl)}/getCoverArt.view?${params.toString()}`
    },
  }
}
