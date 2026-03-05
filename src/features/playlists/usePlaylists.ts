import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'

const key = {
  list: ['playlists'] as const,
  detail: (id: string) => ['playlist', id] as const,
}

export const usePlaylistsQuery = () =>
  useQuery({
    queryKey: key.list,
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getPlaylists()
    },
    staleTime: 5 * 60_000,
  })

export const usePlaylistDetailQuery = (id: string) =>
  useQuery({
    queryKey: key.detail(id),
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.getPlaylist(id)
    },
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
  })

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string; songIds?: string[] }) => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.createPlaylist(payload.name, payload.songIds)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key.list })
    },
  })
}

export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { playlistId: string; songId: string }) => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.updatePlaylist({
        playlistId: payload.playlistId,
        songIdToAdd: [payload.songId],
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: key.list })
      queryClient.invalidateQueries({ queryKey: key.detail(variables.playlistId) })
    },
  })
}

export const useRemoveSongFromPlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { playlistId: string; songIndex: number }) => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.updatePlaylist({
        playlistId: payload.playlistId,
        songIndexToRemove: [payload.songIndex],
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: key.detail(variables.playlistId) })
      queryClient.invalidateQueries({ queryKey: key.list })
    },
  })
}
