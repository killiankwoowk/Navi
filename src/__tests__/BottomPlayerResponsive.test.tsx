import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { BottomPlayer } from '@/components/layout/BottomPlayer'
import { usePlayerStore } from '@/store/playerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUiStore } from '@/store/uiStore'

describe('BottomPlayer responsive modes', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentTrackId: null,
      currentIndex: -1,
      isPlaying: false,
      shuffle: false,
      repeat: 'off',
      volume: 0.8,
      progress: 0,
      duration: 0,
      shuffleOrder: [],
      sleepTimer: { endsAt: null, durationMinutes: null },
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
    useUiStore.setState({
      mobilePlayerExpanded: false,
      mobileQueueOpen: false,
      mobileSidebarOpen: false,
      desktopQueueCollapsed: false,
      lyricsPanelOpen: false,
      lyricsTargetSong: null,
      streamQualityWarning: null,
      scrobbleCount: 0,
      queuePanelOpen: false,
      compactMode: false,
      libraryAlbumType: 'alphabeticalByName',
      playlistViewMode: 'list',
      mobileSearchTab: 'songs',
      desktopSidebarCollapsed: false,
    })
  })

  it('shows mini player on mobile and expands to full player', async () => {
    const user = userEvent.setup()

    render(<BottomPlayer viewportMode="mobile" />)
    const expandButton = screen.getAllByLabelText('Expand player')[0]
    await user.click(expandButton)

    expect(screen.getByLabelText('Minimize player')).toBeInTheDocument()
  })

  it('shows desktop player bar in desktop mode', () => {
    render(<BottomPlayer viewportMode="desktop" />)
    expect(screen.getByLabelText('Toggle queue panel')).toBeInTheDocument()
  })
})
