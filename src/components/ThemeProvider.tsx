import { useEffect, type ReactNode } from 'react'

import { useSettingsStore } from '@/store/settingsStore'

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useSettingsStore((state) => state.theme)

  useEffect(() => {
    const body = document.body
    if (theme === 'nothing') {
      body.classList.add('theme-nothing')
    } else {
      body.classList.remove('theme-nothing')
    }
  }, [theme])

  return <>{children}</>
}
