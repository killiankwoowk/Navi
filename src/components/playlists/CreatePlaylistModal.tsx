import type { FormEvent } from 'react'
import { useState } from 'react'

interface CreatePlaylistModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  isBusy?: boolean
}

export const CreatePlaylistModal = ({ open, onClose, onSubmit, isBusy }: CreatePlaylistModalProps) => {
  const [name, setName] = useState('')

  if (!open) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return
    await onSubmit(name.trim())
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/70 p-4">
      <div className="mx-auto mt-20 max-w-md terminal-panel">
        <div className="terminal-heading"># Create Playlist</div>
        <form onSubmit={handleSubmit} className="space-y-3 p-4">
          <label className="block text-xs uppercase tracking-[0.15em] text-terminal-muted" htmlFor="playlist-name">
            Playlist Name
          </label>
          <input
            id="playlist-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="terminal-input"
            placeholder="Late Night Session"
            autoFocus
          />
          <div className="flex items-center justify-end gap-2">
            <button type="button" className="terminal-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="terminal-button" disabled={isBusy || !name.trim()}>
              {isBusy ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
