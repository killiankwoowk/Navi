import { useEffect, useMemo, useRef } from 'react'

import type { Song, ViewportMode } from '@/api/types'
import { LyricsPanel } from '@/components/Lyrics/LyricsPanel'
import { DesktopPlayerBar } from '@/components/player/DesktopPlayerBar'
import { FullPlayer } from '@/components/player/FullPlayer'
import { MiniPlayer } from '@/components/player/MiniPlayer'
import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { audioEngine } from '@/player/audioEngine'
import { createScrobbleController } from '@/player/PlayerController'
import { getCurrentQueueItem } from '@/player/playback'
import { createLastfmClient } from '@/services/lastfmService'
import { usePlayerStore } from '@/store/playerStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUiStore } from '@/store/uiStore'
import { useUsageStore } from '@/store/usageStore'
import { getSongCoverArtId } from '@/utils/image'
import { getMaxBitRateForQuality } from '@/utils/stream'

interface BottomPlayerProps {
  viewportMode: ViewportMode
}

export const BottomPlayer = ({ viewportMode }: BottomPlayerProps) => {
  const queue = usePlayerStore((state) => state.queue)
  const currentTrackId = usePlayerStore((state) => state.currentTrackId)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const progress = usePlayerStore((state) => state.progress)
  const duration = usePlayerStore((state) => state.duration)
  const shuffle = usePlayerStore((state) => state.shuffle)
  const repeat = usePlayerStore((state) => state.repeat)
  const volume = usePlayerStore((state) => state.volume)
  const sleepTimer = usePlayerStore((state) => state.sleepTimer)

  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const previous = usePlayerStore((state) => state.previous)
  const toggleShuffle = usePlayerStore((state) => state.toggleShuffle)
  const cycleRepeat = usePlayerStore((state) => state.cycleRepeat)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const setProgress = usePlayerStore((state) => state.setProgress)
  const setDuration = usePlayerStore((state) => state.setDuration)
  const setPlaying = usePlayerStore((state) => state.setPlaying)
  const setSleepTimer = usePlayerStore((state) => state.setSleepTimer)
  const clearSleepTimer = usePlayerStore((state) => state.clearSleepTimer)
  const checkSleepTimer = usePlayerStore((state) => state.checkSleepTimer)
  const incrementPlay = useUsageStore((state) => state.incrementPlay)
  const audioQuality = useSettingsStore((state) => state.audioQuality)
  const defaultSleepTimer = useSettingsStore((state) => state.defaultSleepTimer)
  const lastfmEnabled = useSettingsStore((state) => state.lastfmEnabled)
  const lastfmApiKey = useSettingsStore((state) => state.lastfmApiKey)
  const lastfmApiSecret = useSettingsStore((state) => state.lastfmApiSecret)
  const lastfmUsername = useSettingsStore((state) => state.lastfmUsername)
  const lastfmSessionKey = useSettingsStore((state) => state.lastfmSessionKey)

  const lyricsPanelOpen = useUiStore((state) => state.lyricsPanelOpen)
  const lyricsTargetSong = useUiStore((state) => state.lyricsTargetSong)
  const openLyricsPanel = useUiStore((state) => state.openLyricsPanel)
  const closeLyricsPanel = useUiStore((state) => state.closeLyricsPanel)
  const streamQualityWarning = useUiStore((state) => state.streamQualityWarning)
  const setStreamQualityWarning = useUiStore((state) => state.setStreamQualityWarning)
  const desktopQueueCollapsed = useUiStore((state) => state.desktopQueueCollapsed)
  const setDesktopQueueCollapsed = useUiStore((state) => state.setDesktopQueueCollapsed)
  const setMobileQueueOpen = useUiStore((state) => state.setMobileQueueOpen)
  const mobilePlayerExpanded = useUiStore((state) => state.mobilePlayerExpanded)
  const setMobilePlayerExpanded = useUiStore((state) => state.setMobilePlayerExpanded)

  const currentIndex = useMemo(() => queue.findIndex((item) => item.track.id === currentTrackId), [currentTrackId, queue])
  const currentItem = useMemo(() => getCurrentQueueItem(queue, currentTrackId), [currentTrackId, queue])
  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const maxBitRate = useMemo(() => getMaxBitRateForQuality(audioQuality), [audioQuality])
  const lastTrackedSongIdRef = useRef<string | null>(null)
  const warnedBitrateProbeRef = useRef<Set<string>>(new Set())
  const scrobbleControllerRef = useRef(
    createScrobbleController({
      nowPlaying: async () => {},
      submit: async () => {},
    }),
  )
  const lyricsSong = lyricsTargetSong ?? currentItem?.track ?? null

  const coverUrl = useMemo(() => {
    const coverArtId = getSongCoverArtId(currentItem?.track)
    if (!coverArtId || !client) return undefined
    const size = viewportMode === 'mobile' ? 600 : viewportMode === 'tablet' ? 400 : 200
    return client.getCoverArt(coverArtId, size)
  }, [client, currentItem, viewportMode])

  useEffect(() => {
    audioEngine.setVolume(volume)
  }, [volume])

  const lastfmClient = useMemo(() => {
    if (!lastfmEnabled || !lastfmApiKey || !lastfmApiSecret || !lastfmSessionKey) return null
    return createLastfmClient({
      apiKey: lastfmApiKey,
      apiSecret: lastfmApiSecret,
      sessionKey: lastfmSessionKey,
      username: lastfmUsername,
    })
  }, [lastfmApiKey, lastfmApiSecret, lastfmEnabled, lastfmSessionKey, lastfmUsername])

  const scrobbleClient = useMemo(
    () => ({
      nowPlaying: async (track: Song) => {
        if (client) {
          await client.scrobble(track.id, false).catch(() => null)
        }
        if (lastfmClient && track.artist && track.title) {
          await lastfmClient
            .updateNowPlaying({
              artist: track.artist,
              track: track.title,
              album: track.album,
              duration: track.duration,
            })
            .catch(() => null)
        }
      },
      submit: async (track: Song, startedAt: number) => {
        if (client) {
          await client.scrobble(track.id, true).catch(() => null)
        }
        if (lastfmClient && track.artist && track.title) {
          await lastfmClient
            .scrobble({
              artist: track.artist,
              track: track.title,
              album: track.album,
              duration: track.duration,
              timestamp: Math.floor(startedAt / 1000),
            })
            .catch(() => null)
        }
      },
    }),
    [client, lastfmClient],
  )

  useEffect(() => {
    scrobbleControllerRef.current.setClient(scrobbleClient)
  }, [scrobbleClient])

  const currentTrackKey = currentItem?.track.id ?? null

  useEffect(() => {
    scrobbleControllerRef.current.setTrack(currentItem?.track ?? null)
  }, [currentItem?.track, currentTrackKey])

  useEffect(() => {
    if (!currentTrackKey || !isPlaying) return
    scrobbleControllerRef.current.onPlay()
  }, [currentTrackKey, isPlaying])

  useEffect(() => {
    if (!currentTrackKey) return
    scrobbleControllerRef.current.onProgress(progress, duration)
  }, [currentTrackKey, duration, progress])

  useEffect(() => {
    if (!currentItem || !client) {
      audioEngine.pause()
      return
    }
    audioEngine.load(client.streamViewUrl(currentItem.track.id, { maxBitRate }))
  }, [client, currentItem, maxBitRate])

  useEffect(() => {
    if (!currentItem || !isPlaying) return
    if (lastTrackedSongIdRef.current === currentItem.track.id) return
    incrementPlay(currentItem.track)
    lastTrackedSongIdRef.current = currentItem.track.id
  }, [currentItem, incrementPlay, isPlaying])

  useEffect(() => {
    if (!currentItem || !client || !maxBitRate) return
    if (!currentItem.track.bitrate || !currentItem.track.duration) return
    if (currentItem.track.bitrate <= maxBitRate + 16) return

    const probeKey = `${currentItem.track.id}-${maxBitRate}`
    if (warnedBitrateProbeRef.current.has(probeKey)) return

    const streamUrl = client.streamViewUrl(currentItem.track.id, { maxBitRate })
    fetch(streamUrl, { method: 'HEAD' })
      .then((response) => {
        const contentLength = Number(response.headers.get('content-length') ?? '0')
        if (!contentLength) return
        const expectedSourceBytes = (currentItem.track.bitrate! * 1000 * currentItem.track.duration!) / 8
        const closeToSource = Math.abs(contentLength - expectedSourceBytes) / expectedSourceBytes < 0.12
        if (closeToSource) {
          const warning = `Server may ignore maxBitRate=${maxBitRate} for ${currentItem.track.title}.`
          setStreamQualityWarning(warning)
          console.warn(`[Navi] ${warning}`)
        }
      })
      .catch(() => {
        // Best effort.
      })
      .finally(() => {
        warnedBitrateProbeRef.current.add(probeKey)
      })
  }, [client, currentItem, maxBitRate, setStreamQualityWarning])

  useEffect(() => {
    if (!currentItem) return

    if (isPlaying) {
      audioEngine.play().catch(() => setPlaying(false))
      return
    }

    audioEngine.pause()
  }, [currentItem, isPlaying, setPlaying])

  useEffect(() => {
    const offTimeUpdate = audioEngine.on('timeupdate', () => setProgress(audioEngine.element.currentTime))
    const offLoaded = audioEngine.on('loadedmetadata', () => setDuration(audioEngine.element.duration || 0))
    const offEnded = audioEngine.on('ended', () => {
      scrobbleControllerRef.current.onEnded()
      next()
    })
    const offError = audioEngine.on('error', () => setPlaying(false))

    return () => {
      offTimeUpdate()
      offLoaded()
      offEnded()
      offError()
    }
  }, [next, setDuration, setPlaying, setProgress])

  useEffect(() => {
    const timer = window.setInterval(() => {
      checkSleepTimer()
    }, 1000)
    return () => window.clearInterval(timer)
  }, [checkSleepTimer])

  const handleToggleQueue = () => {
    if (viewportMode === 'desktop') {
      setDesktopQueueCollapsed(!desktopQueueCollapsed)
      return
    }
    setMobileQueueOpen(true)
  }

  const handleToggleLyrics = () => {
    if (lyricsPanelOpen) {
      closeLyricsPanel()
      return
    }
    openLyricsPanel(currentItem?.track ?? null)
  }

  return (
    <>
      {viewportMode === 'mobile' ? (
        <>
          <MiniPlayer
            track={currentItem?.track ?? null}
            isPlaying={isPlaying}
            queueCount={queue.length}
            onTogglePlay={togglePlay}
            onExpand={() => setMobilePlayerExpanded(true)}
            onOpenQueue={handleToggleQueue}
          />
          <FullPlayer
            open={mobilePlayerExpanded}
            track={currentItem?.track ?? null}
            coverUrl={coverUrl}
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeat={repeat}
            progress={progress}
            duration={duration}
            queueCount={queue.length}
            onClose={() => setMobilePlayerExpanded(false)}
            onTogglePlay={togglePlay}
            onPrevious={() => {
              previous(audioEngine.element.currentTime)
              if (audioEngine.element.currentTime > 5) audioEngine.seek(0)
            }}
            onNext={next}
            onToggleShuffle={toggleShuffle}
            onCycleRepeat={cycleRepeat}
            onSeek={(value) => {
              audioEngine.seek(value)
              setProgress(value)
            }}
            onToggleLyrics={handleToggleLyrics}
            onOpenQueue={handleToggleQueue}
          />
        </>
      ) : (
        <DesktopPlayerBar
          track={currentItem?.track ?? null}
          coverUrl={coverUrl}
          queueLength={queue.length}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          shuffle={shuffle}
          repeat={repeat}
          progress={progress}
          duration={duration}
          volume={volume}
          defaultSleepTimer={defaultSleepTimer}
          queueActive={!desktopQueueCollapsed}
          lyricsActive={lyricsPanelOpen}
          onTogglePlay={togglePlay}
          onPrevious={() => {
            previous(audioEngine.element.currentTime)
            if (audioEngine.element.currentTime > 5) audioEngine.seek(0)
          }}
          onNext={next}
          onToggleShuffle={toggleShuffle}
          onCycleRepeat={cycleRepeat}
          onSeek={(value) => {
            audioEngine.seek(value)
            setProgress(value)
          }}
          onVolumeChange={setVolume}
          onSetSleepTimer={setSleepTimer}
          onCancelSleepTimer={clearSleepTimer}
          sleepEndsAt={sleepTimer.endsAt}
          sleepDurationMinutes={sleepTimer.durationMinutes}
          onToggleLyrics={handleToggleLyrics}
          onToggleQueue={handleToggleQueue}
          warningMessage={streamQualityWarning}
        />
      )}
      {lyricsPanelOpen ? (
        <LyricsPanel
          open={lyricsPanelOpen}
          song={lyricsSong}
          currentTimeSec={progress}
          isPlaying={isPlaying}
          onClose={closeLyricsPanel}
        />
      ) : null}
    </>
  )
}
