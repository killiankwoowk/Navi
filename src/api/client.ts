import axios from 'axios'

import { buildAuthQuery, createRestUrl } from '@/api/auth'

import type { AxiosApiError, SubsonicApiError, SubsonicCredentials, SubsonicResponse } from './types'

let onAuthFailure: (() => void) | null = null

export const setAuthFailureHandler = (handler: (() => void) | null) => {
  onAuthFailure = handler
}

export const normalizeSubsonicError = (error: unknown): SubsonicApiError => {
  const axiosError = error as AxiosApiError

  if (!axiosError.response) {
    return {
      code: -1,
      message: axiosError.message || 'Network error',
      type: 'network',
    }
  }

  const payload = axiosError.response.data?.['subsonic-response']
  if (payload?.error) {
    const type = payload.error.code === 40 ? 'auth' : 'request'
    return {
      code: payload.error.code,
      message: payload.error.message,
      type,
    }
  }

  return {
    code: axiosError.response.status,
    message: axiosError.message || 'Unknown API error',
    type: 'unknown',
  }
}

export const createApiClient = (credentials: SubsonicCredentials) => {
  const instance = axios.create({
    baseURL: createRestUrl(credentials.serverUrl),
    timeout: 20000,
  })

  instance.interceptors.request.use((config) => {
    const auth = buildAuthQuery(credentials)
    config.params = {
      ...(config.params ?? {}),
      ...auth,
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized = normalizeSubsonicError(error)
      if (normalized.type === 'auth' && onAuthFailure) {
        onAuthFailure()
      }
      return Promise.reject(normalized)
    },
  )

  const unwrap = <T>(payload: SubsonicResponse<T>): T => {
    const response = payload['subsonic-response']

    if (response.status === 'failed' && response.error) {
      throw {
        code: response.error.code,
        message: response.error.message,
        type: response.error.code === 40 ? 'auth' : 'request',
      } satisfies SubsonicApiError
    }

    return response
  }

  return {
    instance,
    unwrap,
  }
}
