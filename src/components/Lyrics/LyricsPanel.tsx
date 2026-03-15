import { useEffect, useRef, useState } from 'react'

import type { LyricsSource, Song } from '@/api/types'
import { useViewportMode } from '@/hooks/useViewportMode'
import { useSettingsStore } from '@/store/settingsStore'
import { useLyrics } from './useLyrics'

interface LyricsPanelProps {
  open: boolean
  song: Song | null
  currentTimeSec: number
  isPlaying: boolean
  onClose: () => void
}

export const LyricsPanel = ({ open, song, onClose }: LyricsPanelProps) => {
  const viewportMode = useViewportMode()
  const setLyricsEnabled = useSettingsStore((state) => state.setLyricsEnabled)
  const lyricsEnabled = useSettingsStore((state) => state.lyricsEnabled)
  const lyricsSource = useSettingsStore((state) => state.lyricsSource)
  const setLyricsSource = useSettingsStore((state) => state.setLyricsSource)
  const lyricsFontSize = useSettingsStore((state) => state.lyricsFontSize)
  const setLyricsFontSize = useSettingsStore((state) => state.setLyricsFontSize)
  const setLyricsSyncOffsetMs = useSettingsStore((state) => state.setLyricsSyncOffsetMs)
  const [showControls, setShowControls] = useState(false)

  const { entries, plainText, sourceLabel, isLoading, hasLyrics } = useLyrics(song)
  const lineRefs = useRef<Array<HTMLParagraphElement | null>>([])

  useEffect(() => {
    if (!open) return
    setLyricsEnabled(true)
  }, [open, setLyricsEnabled])

  if (!open) return null

  const isMobile = viewportMode === 'mobile'

  return (
    <aside
      className={`fixed z-[60] flex flex-col ${
        isMobile
          ? 'inset-0 bg-black/95 p-4'
          : 'bottom-24 right-3 h-[min(70vh,560px)] w-[min(520px,96vw)] rounded border border-nothing-700 bg-nothing-800'
      }`}
    >
      <header className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-nothing-300">Lyrics</div>
          <div className="truncate text-sm text-nothing-100">{song?.title ?? 'No track'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="terminal-button min-h-11 px-2 py-1" type="button" onClick={onClose} aria-label="Close lyrics">
            close
          </button>
        </div>
      </header>

      {isMobile ? (
        <div className="mt-4 h-1 w-full rounded-full bg-nothing-700" />
      ) : (
        <button
          type="button"
          className="mt-2 self-start text-[11px] text-nothing-300"
          onClick={() => setShowControls((value) => !value)}
        >
          {showControls ? 'hide controls' : 'show controls'}
        </button>
      )}

      {showControls ? (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-nothing-700 p-2 text-[11px] text-nothing-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={lyricsEnabled} onChange={(event) => setLyricsEnabled(event.target.checked)} />
            enabled
          </label>
          <label className="flex items-center gap-2">
            source
            <select
              className="border border-nothing-600 bg-nothing-700 px-1 py-0.5 text-[11px] text-nothing-100"
              value={lyricsSource}
              onChange={(event) => setLyricsSource(event.target.value as LyricsSource)}
            >
              <option value="auto">auto</option>
              <option value="genius">genius</option>
              <option value="local">local</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            size
            <input
              type="range"
              min={12}
              max={28}
              value={lyricsFontSize}
              onChange={(event) => setLyricsFontSize(Number(event.target.value))}
            />
          </label>
          <label className="flex items-center gap-2">
            offset (disabled)
            <input
              type="number"
              value={0}
              onChange={(event) => setLyricsSyncOffsetMs(Number(event.target.value))}
              className="w-20 border border-nothing-600 bg-nothing-700 px-1 py-0.5 text-[11px] text-nothing-100 opacity-50"
              disabled
            />
          </label>
        </div>
      ) : null}

      <div className="mt-2 flex items-center justify-between text-[11px] text-nothing-300">
        <span>source: {sourceLabel}</span>
        <span>plain</span>
      </div>

      <div
        className="mt-4 flex-1 overflow-auto px-2 text-center leading-relaxed"
        style={{ fontSize: `${Math.max(18, lyricsFontSize)}px` }}
      >
        {isLoading ? <p className="m-0 text-nothing-300">Loading lyrics...</p> : null}
        {!isLoading && !hasLyrics ? <p className="m-0 text-nothing-300">No lyrics available.</p> : null}
        {!isLoading && hasLyrics ? (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <p
                key={`${entry.time}-${index}`}
                ref={(element) => {
                  lineRefs.current[index] = element
                }}
                className="m-0 text-nothing-100 text-lg md:text-xl"
              >
                {entry.text || '...'}
              </p>
            ))}
        {!entries.length && plainText ? <pre className="m-0 whitespace-pre-wrap text-nothing-100">{plainText}</pre> : null}
      </div>
    ) : null}
      </div>
    </aside>
  )
}
