import { useState } from 'react'
import { ListPlus, X } from 'lucide-react'

import { useAddSongToPlaylist, usePlaylistsQuery } from '@/features/playlists/usePlaylists'

interface AddToPlaylistMenuProps {
  songId: string
}

export const AddToPlaylistMenu = ({ songId }: AddToPlaylistMenuProps) => {
  const [open, setOpen] = useState(false)
  const playlistsQuery = usePlaylistsQuery()
  const addSongMutation = useAddSongToPlaylist()

  const playlists = playlistsQuery.data ?? []

  const addToPlaylist = async (playlistId: string) => {
    await addSongMutation.mutateAsync({
      playlistId,
      songId,
    })
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        className="terminal-button focus:outline-none focus:ring-2 focus:ring-accent"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        type="button"
        aria-label="Open add to playlist menu"
      >
        <ListPlus size={12} />
        add to playlist
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 min-w-48 rounded border border-nothing-700 bg-nothing-800 p-1 text-xs shadow-lg">
          {!playlists.length ? (
            <div className="px-2 py-1 text-nothing-300">No playlists</div>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void addToPlaylist(playlist.id)
                }}
              >
                <ListPlus size={12} />
                {playlist.name}
              </button>
            ))
          )}
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-nothing-700"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setOpen(false)
            }}
          >
            <X size={12} />
            Close
          </button>
        </div>
      ) : null}
    </div>
  )
}
