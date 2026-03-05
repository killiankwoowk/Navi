import { useEffect, useMemo } from 'react'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'
import { audioEngine } from '@/player/audioEngine'
import { getCurrentQueueItem } from '@/player/playback'
import { usePlayerStore } from '@/store/playerStore'
import { useUiStore } from '@/store/uiStore'
import { getSongCoverArtId } from '@/utils/image'

import { QueuePanel } from '@/components/player/QueuePanel'
import { NowPlaying } from '@/components/player/NowPlaying'
import { ProgressBar } from '@/components/player/ProgressBar'
import { TransportControls } from '@/components/player/TransportControls'
import { VolumeControl } from '@/components/player/VolumeControl'
import { SleepTimerControl } from '@/components/sleep/SleepTimerControl'

export const BottomPlayer = () => {
  const queue = usePlayerStore((state) => state.queue)
  const currentIndex = usePlayerStore((state) => state.currentIndex)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const progress = usePlayerStore((state) => state.progress)
  const duration = usePlayerStore((state) => state.duration)
  const shuffle = usePlayerStore((state) => state.shuffle)
  const repeat = usePlayerStore((state) => state.repeat)
  const volume = usePlayerStore((state) => state.volume)
  const sleepTimer = usePlayerStore((state) => state.sleepTimer)

  const playIndex = usePlayerStore((state) => state.playIndex)
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue)
  const reorderQueue = usePlayerStore((state) => state.reorderQueue)
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

  const queuePanelOpen = useUiStore((state) => state.queuePanelOpen)
  const setQueuePanelOpen = useUiStore((state) => state.setQueuePanelOpen)

  const currentItem = useMemo(() => getCurrentQueueItem(queue, currentIndex), [currentIndex, queue])
  const client = useMemo(() => getNavidromeClientOrNull(), [])

  const coverUrl = useMemo(() => {
    const coverArtId = getSongCoverArtId(currentItem?.track)
    if (!coverArtId || !client) return undefined
    return client.getCoverArtUrl(coverArtId, 120)
  }, [client, currentItem])

  useEffect(() => {
    audioEngine.setVolume(volume)
  }, [volume])

  useEffect(() => {
    if (!currentItem || !client) {
      audioEngine.pause()
      return
    }
    audioEngine.load(client.getStreamUrl(currentItem.track.id))
  }, [client, currentItem])

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
    const offEnded = audioEngine.on('ended', () => next())
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

  return (
    <>
      <footer className="terminal-panel sticky bottom-0 mx-3 mb-3 mt-3 p-3">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_2fr_1fr] lg:items-center">
          <NowPlaying track={currentItem?.track ?? null} coverUrl={coverUrl} />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TransportControls
                isPlaying={isPlaying}
                shuffle={shuffle}
                repeat={repeat}
                onTogglePlay={togglePlay}
                onPrevious={() => {
                  previous(audioEngine.element.currentTime)
                  if (audioEngine.element.currentTime > 5) {
                    audioEngine.seek(0)
                  }
                }}
                onNext={next}
                onToggleShuffle={toggleShuffle}
                onCycleRepeat={cycleRepeat}
              />
              <VolumeControl volume={volume} onChange={setVolume} />
            </div>
            <ProgressBar
              progress={progress}
              duration={duration}
              onSeek={(value) => {
                audioEngine.seek(value)
                setProgress(value)
              }}
            />
          </div>
          <div className="space-y-2 text-right">
            <SleepTimerControl
              endsAt={sleepTimer.endsAt}
              durationMinutes={sleepTimer.durationMinutes}
              onSetTimer={setSleepTimer}
              onCancel={clearSleepTimer}
            />
            <div className="text-xs text-terminal-muted">
              [{currentIndex + 1}/{queue.length || 0}] {currentItem?.track.album ?? '--'}
            </div>
          </div>
        </div>
      </footer>
      {queuePanelOpen ? (
        <QueuePanel
          queue={queue}
          currentIndex={currentIndex}
          onSelect={playIndex}
          onRemove={removeFromQueue}
          onMove={reorderQueue}
          onClose={() => setQueuePanelOpen(false)}
        />
      ) : null}
    </>
  )
}
