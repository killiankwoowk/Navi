import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { createNavidromeClient } from '@/api/navidrome'
import type { NavidromeClient, SubsonicCredentials } from '@/api/types'
import { setAuthFailureHandler } from '@/api/client'
import { useAuthStore } from '@/store/authStore'

const getCredentialsFromStore = (): SubsonicCredentials | null => {
  const { serverUrl, username, password, isAuthenticated } = useAuthStore.getState()
  if (!isAuthenticated || !serverUrl || !username || !password) return null
  return { serverUrl, username, password }
}

export const getNavidromeClientOrNull = (): NavidromeClient | null => {
  const creds = getCredentialsFromStore()
  return creds ? createNavidromeClient(creds) : null
}

export const useAuth = () => {
  const navigate = useNavigate()
  const serverUrl = useAuthStore((state) => state.serverUrl)
  const username = useAuthStore((state) => state.username)
  const password = useAuthStore((state) => state.password)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setSession = useAuthStore((state) => state.setSession)
  const clearSession = useAuthStore((state) => state.clearSession)

  const client = useMemo(() => {
    if (!isAuthenticated || !serverUrl || !username || !password) return null
    return createNavidromeClient({
      serverUrl,
      username,
      password,
    })
  }, [isAuthenticated, password, serverUrl, username])

  const login = useCallback(async (credentials: SubsonicCredentials) => {
    const trialClient = createNavidromeClient(credentials)
    await trialClient.login()
    setSession(credentials)
  }, [setSession])

  const logout = useCallback(() => {
    clearSession()
    navigate('/login')
  }, [clearSession, navigate])

  const bindAuthFailure = useCallback(() => {
    setAuthFailureHandler(() => {
      clearSession()
      navigate('/login')
    })
    return () => setAuthFailureHandler(null)
  }, [clearSession, navigate])

  return {
    serverUrl,
    username,
    password,
    isAuthenticated,
    client,
    login,
    logout,
    bindAuthFailure,
  }
}
