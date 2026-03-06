import { useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window'

import type { Song } from '@/api/types'

import { PlaylistCard } from './PlaylistCard'

interface PlaylistGridProps {
  tracks: Song[]
  mode: 'list' | 'grid'
  height?: number
  resolveCoverUrl: (track: Song) => string | undefined
  onPlayTrack: (track: Song, index: number) => void
  onQueueTrack: (track: Song) => void
  onOpenLyrics: (track: Song) => void
  onRemoveTrack?: (track: Song, index: number) => void
}

interface RowData {
  tracks: Song[]
  columns: number
  mode: 'list' | 'grid'
  resolveCoverUrl: (track: Song) => string | undefined
  onPlayTrack: (track: Song, index: number) => void
  onQueueTrack: (track: Song) => void
  onOpenLyrics: (track: Song) => void
  onRemoveTrack?: (track: Song, index: number) => void
}

const listItemSize = 96
const gridItemHeight = 300
const gridMinColumnWidth = 240
const virtualizedThreshold = 200

const PlaylistRow = ({ data, index, style }: ListChildComponentProps<RowData>) => {
  if (data.mode === 'list') {
    const track = data.tracks[index]
    return (
      <div style={style} className="px-1 py-1">
        <PlaylistCard
          track={track}
          mode="list"
          coverUrl={data.resolveCoverUrl(track)}
          onPlay={() => data.onPlayTrack(track, index)}
          onQueue={() => data.onQueueTrack(track)}
          onLyrics={() => data.onOpenLyrics(track)}
          onRemove={data.onRemoveTrack ? () => data.onRemoveTrack?.(track, index) : undefined}
        />
      </div>
    )
  }

  const start = index * data.columns
  const rowTracks = data.tracks.slice(start, start + data.columns)
  const rowStyle = { ...style, display: 'grid', gridTemplateColumns: `repeat(${data.columns}, minmax(0, 1fr))` }

  return (
    <div style={rowStyle} className="gap-2 px-1 py-1">
      {rowTracks.map((track, cellIndex) => {
        const trackIndex = start + cellIndex
        return (
          <PlaylistCard
            key={track.id}
            track={track}
            mode="grid"
            coverUrl={data.resolveCoverUrl(track)}
            onPlay={() => data.onPlayTrack(track, trackIndex)}
            onQueue={() => data.onQueueTrack(track)}
            onLyrics={() => data.onOpenLyrics(track)}
            onRemove={data.onRemoveTrack ? () => data.onRemoveTrack?.(track, trackIndex) : undefined}
          />
        )
      })}
    </div>
  )
}

export const PlaylistGrid = ({
  tracks,
  mode,
  height = 560,
  resolveCoverUrl,
  onPlayTrack,
  onQueueTrack,
  onOpenLyrics,
  onRemoveTrack,
}: PlaylistGridProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(900)
  const useVirtualizedList = mode === 'grid' || tracks.length >= virtualizedThreshold

  useEffect(() => {
    if (!viewportRef.current) return

    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 900)
      if (nextWidth > 0) {
        setWidth(nextWidth)
      }
    })

    observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [])

  const columns = useMemo(() => {
    if (mode !== 'grid') return 1
    return Math.max(1, Math.floor(width / gridMinColumnWidth))
  }, [mode, width])

  const itemCount = mode === 'list' ? tracks.length : Math.ceil(tracks.length / columns)
  const itemSize = mode === 'list' ? listItemSize : gridItemHeight

  const rowData = useMemo<RowData>(
    () => ({
      tracks,
      columns,
      mode,
      resolveCoverUrl,
      onPlayTrack,
      onQueueTrack,
      onOpenLyrics,
      onRemoveTrack,
    }),
    [columns, mode, onOpenLyrics, onPlayTrack, onQueueTrack, onRemoveTrack, resolveCoverUrl, tracks],
  )

  if (!useVirtualizedList && mode === 'list') {
    return (
      <div ref={viewportRef} className="playlist-viewport max-h-[65vh] space-y-1 overflow-auto p-1">
        {tracks.map((track, index) => (
          <PlaylistCard
            key={track.id}
            track={track}
            mode="list"
            coverUrl={resolveCoverUrl(track)}
            onPlay={() => onPlayTrack(track, index)}
            onQueue={() => onQueueTrack(track)}
            onLyrics={() => onOpenLyrics(track)}
            onRemove={onRemoveTrack ? () => onRemoveTrack(track, index) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div ref={viewportRef} className="playlist-viewport h-full w-full">
      <List
        className="terminal-carousel"
        width={width}
        height={height}
        itemCount={itemCount}
        itemSize={itemSize}
        itemData={rowData}
        itemKey={(index, data) => {
          if (data.mode === 'list') return data.tracks[index]?.id ?? `row-${index}`
          return data.tracks[index * data.columns]?.id ?? `row-${index}`
        }}
      >
        {PlaylistRow}
      </List>
    </div>
  )
}
