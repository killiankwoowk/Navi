import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Disc, Heart, ListPlus, MoreVertical, User } from 'lucide-react'

import type { Playlist, Song } from '@/api/types'
import { formatDuration } from '@/utils/format'

interface SongRowProps {
  song: Song
  indexLabel: number
  playlists: Playlist[]
  onQueue: (song: Song) => void
  onPlay: (song: Song) => void
  onAddToPlaylist: (playlistId: string, songId: string) => void
  onToggleFavorite?: (song: Song, next: boolean) => void
}

export const SongRow = ({ song, indexLabel, playlists, onQueue, onPlay, onAddToPlaylist, onToggleFavorite }: SongRowProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPlaylists, setShowPlaylists] = useState(false)
  const [isStarred, setIsStarred] = useState(Boolean(song.starred))
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(event.target as Node)) return
      setMenuOpen(false)
      setShowPlaylists(false)
    }

    if (menuOpen) {
      document.addEventListener('mousedown', onClick)
    }
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const handleToggleFavorite = async () => {
    const next = !isStarred
    setIsStarred(next)
    onToggleFavorite?.(song, next)
  }

  return (
    <div className="grid grid-cols-[28px_1fr_36px_36px_auto] items-center gap-2 border border-nothing-700 px-2 py-2 text-sm">
      <span className="text-[11px] text-nothing-300">{indexLabel}</span>
      <button
        type="button"
        className="truncate text-left text-nothing-100 focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={`Play song ${song.title}`}
        onClick={() => onPlay(song)}
      >
        {song.title}
      </button>
      <button
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded border border-nothing-700 ${
          isStarred ? 'text-accent' : 'text-nothing-300'
        }`}
        onClick={handleToggleFavorite}
        aria-label={isStarred ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`}
      >
        <Heart size={14} fill={isStarred ? 'currentColor' : 'none'} />
      </button>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded border border-nothing-700 text-nothing-300 hover:text-nothing-100"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={`Open actions for ${song.title}`}
        >
          <MoreVertical size={14} />
        </button>
        {menuOpen ? (
          <div className="absolute right-0 z-30 mt-2 w-44 rounded border border-nothing-700 bg-nothing-800 p-1 text-xs">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
              onClick={() => {
                onQueue(song)
                setMenuOpen(false)
              }}
            >
              <ListPlus size={12} />
              Queue
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
              onClick={() => setShowPlaylists((value) => !value)}
            >
              <ListPlus size={12} />
              Add to playlist
            </button>
            {showPlaylists ? (
              <div className="mt-1 space-y-1 border-t border-nothing-700 pt-1">
                {playlists.length ? (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left hover:bg-nothing-700"
                      onClick={() => {
                        onAddToPlaylist(playlist.id, song.id)
                        setMenuOpen(false)
                        setShowPlaylists(false)
                      }}
                    >
                      {playlist.name}
                    </button>
                  ))
                ) : (
                  <div className="px-2 py-1 text-nothing-300">No playlists</div>
                )}
              </div>
            ) : null}
            {song.artistId ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                onClick={() => {
                  navigate(`/artist/${song.artistId}`)
                  setMenuOpen(false)
                }}
              >
                <User size={12} />
                Go to artist
              </button>
            ) : null}
            {song.albumId ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                onClick={() => {
                  navigate(`/album/${song.albumId}`)
                  setMenuOpen(false)
                }}
              >
                <Disc size={12} />
                Go to album
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <span className="text-xs text-nothing-300">{formatDuration(song.duration ?? 0)}</span>
    </div>
  )
}
