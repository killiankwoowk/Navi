import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { Profile } from '@/pages/Profile'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUsageStore } from '@/store/usageStore'

describe('Profile', () => {
  beforeEach(() => {
    useAuthStore.setState({
      serverUrl: 'https://music.dobymick.me',
      username: 'Doby Mick',
      password: 'secret',
      isAuthenticated: true,
    })

    useSettingsStore.setState({
      audioQuality: 'auto',
      gaplessEnabled: false,
      crossfadeSeconds: 0,
      defaultSleepTimer: 'off',
      lyricsEnabled: true,
      lyricsSource: 'auto',
      lyricsFontSize: 16,
      lyricsSyncOffsetMs: 0,
      lyricsFollowMode: true,
      geniusApiKeyOverride: '',
      themeMode: 'terminal-dark',
      fontMode: 'jetbrains',
      analyticsEnabled: false,
    })

    useUsageStore.setState({
      entries: {
        one: {
          song: { id: 'one', title: 'Track One', artist: 'Artist A' },
          playCount: 3,
          lastPlayedAt: 100,
        },
        two: {
          song: { id: 'two', title: 'Track Two', artist: 'Artist B' },
          playCount: 2,
          lastPlayedAt: 200,
        },
      },
    })
  })

  it('renders usage stats without entering a render loop', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
    )

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Doby Mick')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Artist A')).toBeInTheDocument()
  })
})
