import { useState } from 'react'

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
        className="terminal-button focus:outline-none focus:ring-2 focus:ring-terminal-green"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        type="button"
        aria-label="Open add to playlist menu"
      >
        [ +playlist ]
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-2 min-w-48 border border-terminal-text/40 bg-black/95 p-1 text-xs">
          {!playlists.length ? (
            <div className="px-2 py-1 text-terminal-muted">No playlists</div>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="block w-full border border-transparent px-2 py-1 text-left hover:border-terminal-accent hover:text-terminal-accent"
                type="button"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void addToPlaylist(playlist.id)
                }}
              >
                {playlist.name}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
