'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { User } from '@/types'

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get<{ data: User }>('/auth/me')
      return data.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}
