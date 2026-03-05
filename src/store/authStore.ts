import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthSession } from '@/api/types'

interface AuthStoreState extends AuthSession {
  setSession: (session: Pick<AuthSession, 'serverUrl' | 'username' | 'password'>) => void
  clearSession: () => void
}

const initialState: AuthSession = {
  serverUrl: '',
  username: '',
  password: '',
  isAuthenticated: false,
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: (session) =>
        set({
          ...session,
          isAuthenticated: true,
        }),
      clearSession: () => set(initialState),
    }),
    {
      name: 'navi-auth',
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        username: state.username,
        password: state.password,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
