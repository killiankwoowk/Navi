import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { getNavidromeClientOrNull } from '@/features/auth/useAuth'

interface AddToPlaylistModalProps {
  songId: string
  onClose: () => void
}

export const AddToPlaylistModal = ({ songId, onClose }: AddToPlaylistModalProps) => {
  const client = useMemo(() => getNavidromeClientOrNull(), [])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { data: playlists = [] } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      if (!client) return []
      return client.getPlaylists()
    },
    staleTime: 5 * 60 * 1000,
  })

  const filtered = playlists.filter((playlist) => playlist.name.toLowerCase().includes(query.toLowerCase()))

  const handleAdd = async () => {
    if (!client || !selectedId) return
    setIsSaving(true)
    try {
      await client.updatePlaylist({ playlistId: selectedId, songIdToAdd: [songId] })
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreate = async () => {
    if (!client || !newName.trim()) return
    setIsSaving(true)
    try {
      const playlist = await client.createPlaylist(newName.trim(), [songId])
      setSelectedId(playlist.id)
      setCreating(false)
      setNewName('')
      onClose()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-nothing-800 rounded-lg p-6 w-full max-w-md border border-nothing-700">
        <h2 className="text-xl font-semibold mb-4 text-nothing-100">Add to Playlist</h2>
        <input
          type="text"
          placeholder="Find a playlist"
          className="w-full bg-nothing-700 border border-nothing-600 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-accent text-nothing-100"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="button"
          className="w-full text-left p-2 rounded-md hover:bg-nothing-700 mb-4 text-nothing-100"
          onClick={() => setCreating((value) => !value)}
        >
          + Create new playlist
        </button>
        {creating ? (
          <div className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="New playlist name"
              className="w-full bg-nothing-700 border border-nothing-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-accent text-nothing-100"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
            <button
              type="button"
              className="px-3 py-2 rounded-md bg-accent text-white"
              disabled={isSaving || !newName.trim()}
              onClick={handleCreate}
            >
              Create and add
            </button>
          </div>
        ) : null}
        <ul className="max-h-60 overflow-y-auto space-y-1">
          {filtered.map((playlist) => (
            <li key={playlist.id}>
              <button
                type="button"
                className={`w-full text-left p-2 rounded-md ${
                  selectedId === playlist.id ? 'bg-nothing-700 border border-accent' : 'hover:bg-nothing-700'
                }`}
                onClick={() => setSelectedId(playlist.id)}
              >
                {playlist.name}
              </button>
            </li>
          ))}
          {!filtered.length ? <li className="text-sm text-nothing-300">No playlists found.</li> : null}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-nothing-600 hover:bg-nothing-500 text-nothing-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-accent text-white disabled:opacity-50"
            onClick={handleAdd}
            disabled={!selectedId || isSaving}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
