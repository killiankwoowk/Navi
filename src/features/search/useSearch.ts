import { useQuery } from '@tanstack/react-query'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'

export const useSearchQuery = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const client = getNavidromeClientOrNull()
      if (!client) throw new Error('Not authenticated')
      return client.search3(query)
    },
    enabled: query.trim().length > 0,
    staleTime: 15_000,
  })
