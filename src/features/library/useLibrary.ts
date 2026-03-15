import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'

export const libraryQueryKeys = {
  artists: ['artists'] as const,
  artist: (id: string) => ['artist', id] as const,
  album: (id: string) => ['album', id] as const,
  song: (id: string) => ['song', id] as const,
  albums: (type: string, size: number, offset: number) => ['albums', type, size, offset] as const,
}

export const useArtistsQuery = () =>
  useQuery({
    queryKey: libraryQueryKeys.artists,
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getArtists()
    },
    staleTime: 5 * 60_000,
  })

export const useArtistQuery = (id: string) =>
  useQuery({
    queryKey: libraryQueryKeys.artist(id),
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getArtist(id)
    },
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  })

export const useAlbumQuery = (id: string) =>
  useQuery({
    queryKey: libraryQueryKeys.album(id),
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getAlbum(id)
    },
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  })

export const useSongQuery = (id: string) =>
  useQuery({
    queryKey: libraryQueryKeys.song(id),
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getSong(id)
    },
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  })

export const useAlbumListQuery = (type = 'alphabeticalByName', size = 60, offset = 0) =>
  useQuery({
    queryKey: libraryQueryKeys.albums(type, size, offset),
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getAlbumList(type, size, offset)
    },
    staleTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  })
