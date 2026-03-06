import { useEffect, useMemo, useRef } from 'react'

import type { LyricsSource, Song } from '@/api/types'
import { useSettingsStore } from '@/store/settingsStore'
import { formatDuration } from '@/utils/format'

import { useLyrics } from './useLyrics'

interface LyricsPanelProps {
  open: boolean
  song: Song | null
  currentTimeSec: number
  isPlaying: boolean
  onClose: () => void
}

export const LyricsPanel = ({ open, song, currentTimeSec, isPlaying, onClose }: LyricsPanelProps) => {
  const setLyricsEnabled = useSettingsStore((state) => state.setLyricsEnabled)
  const lyricsEnabled = useSettingsStore((state) => state.lyricsEnabled)
  const lyricsSource = useSettingsStore((state) => state.lyricsSource)
  const setLyricsSource = useSettingsStore((state) => state.setLyricsSource)
  const lyricsFontSize = useSettingsStore((state) => state.lyricsFontSize)
  const setLyricsFontSize = useSettingsStore((state) => state.setLyricsFontSize)
  const lyricsSyncOffsetMs = useSettingsStore((state) => state.lyricsSyncOffsetMs)
  const setLyricsSyncOffsetMs = useSettingsStore((state) => state.setLyricsSyncOffsetMs)
  const lyricsFollowMode = useSettingsStore((state) => state.lyricsFollowMode)
  const setLyricsFollowMode = useSettingsStore((state) => state.setLyricsFollowMode)

  const { entries, plainText, sourceLabel, isSynced, isLoading, hasLyrics } = useLyrics(song)
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([])

  const adjustedTimeMs = Math.max(0, currentTimeSec * 1000 + lyricsSyncOffsetMs)
  const activeLineIndex = useMemo(() => {
    if (!isSynced || entries.length === 0) return -1
    const nextIndex = entries.findIndex((entry) => entry.time > adjustedTimeMs)
    if (nextIndex <= 0) return 0
    return nextIndex - 1
  }, [adjustedTimeMs, entries, isSynced])

  useEffect(() => {
    if (!lyricsFollowMode || activeLineIndex < 0 || !isPlaying) return
    const targetLine = lineRefs.current[activeLineIndex]
    targetLine?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeLineIndex, isPlaying, lyricsFollowMode])

  if (!open) return null

  return (
    <aside className="terminal-panel fixed inset-2 z-40 flex flex-col md:inset-auto md:bottom-24 md:right-3 md:h-[min(70vh,520px)] md:w-[min(480px,96vw)]">
      <header className="terminal-heading flex items-center justify-between gap-2">
        <span>lyrics | {song?.title ?? 'No track'}</span>
        <button className="terminal-button px-2 py-0.5" type="button" onClick={onClose} aria-label="Close lyrics panel">
          close
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2 border-b border-terminal-text/20 p-2 text-[11px]">
        <label className="flex items-center gap-2 text-terminal-muted">
          <input
            type="checkbox"
            checked={lyricsEnabled}
            onChange={(event) => setLyricsEnabled(event.target.checked)}
            aria-label="Enable lyrics"
          />
          enabled
        </label>
        <label className="flex items-center gap-2 text-terminal-muted">
          source
          <select
            className="border border-terminal-text/35 bg-black/40 px-1 py-0.5 text-[11px] text-terminal-text"
            value={lyricsSource}
            onChange={(event) => setLyricsSource(event.target.value as LyricsSource)}
            aria-label="Lyrics source"
          >
            <option value="auto">auto</option>
            <option value="genius">genius</option>
            <option value="local">local</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-terminal-muted">
          size
          <input
            type="range"
            min={12}
            max={28}
            value={lyricsFontSize}
            onChange={(event) => setLyricsFontSize(Number(event.target.value))}
            aria-label="Lyrics font size"
          />
        </label>
        <label className="flex items-center gap-2 text-terminal-muted">
          offset
          <input
            type="number"
            value={lyricsSyncOffsetMs}
            onChange={(event) => setLyricsSyncOffsetMs(Number(event.target.value))}
            className="w-20 border border-terminal-text/35 bg-black/40 px-1 py-0.5 text-[11px] text-terminal-text"
            aria-label="Lyrics sync offset in milliseconds"
          />
        </label>
        <label className="col-span-2 flex items-center gap-2 text-terminal-muted">
          <input
            type="checkbox"
            checked={lyricsFollowMode}
            onChange={(event) => setLyricsFollowMode(event.target.checked)}
            aria-label="Follow active lyric line"
          />
          follow active line
        </label>
      </div>

      <div className="flex items-center justify-between border-b border-terminal-text/20 px-3 py-1 text-[11px] text-terminal-muted">
        <span>source: {sourceLabel}</span>
        <span>
          {isSynced ? `synced @ ${formatDuration(adjustedTimeMs / 1000)}` : 'unsynced'}
        </span>
      </div>

      <div className="overflow-auto p-3" style={{ fontSize: `${lyricsFontSize}px` }}>
        {isLoading ? <p className="m-0 text-terminal-muted">Loading lyrics...</p> : null}
        {!isLoading && !hasLyrics ? <p className="m-0 text-terminal-muted">No lyrics available.</p> : null}
        {!isLoading && hasLyrics ? (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <p
                key={`${entry.time}-${index}`}
                ref={(element) => {
                  lineRefs.current[index] = element
                }}
                className={`m-0 transition-colors ${
                  activeLineIndex === index ? 'lyrics-line-active font-semibold' : 'text-terminal-text'
                }`}
              >
                {entry.text || '...'}
              </p>
            ))}
            {!entries.length && plainText ? <pre className="m-0 whitespace-pre-wrap text-terminal-text">{plainText}</pre> : null}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
