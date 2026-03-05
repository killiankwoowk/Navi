import { useEffect } from 'react'

import { usePlayerStore } from '@/store/playerStore'

export const useKeyboardShortcuts = () => {
  const togglePlay = usePlayerStore((state) => state.togglePlay)
  const next = usePlayerStore((state) => state.next)
  const previous = usePlayerStore((state) => state.previous)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return

      if (event.code === 'Space') {
        event.preventDefault()
        togglePlay()
      }

      if (event.code === 'ArrowRight' && event.shiftKey) {
        next()
      }

      if (event.code === 'ArrowLeft' && event.shiftKey) {
        previous()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, previous, togglePlay])
}
