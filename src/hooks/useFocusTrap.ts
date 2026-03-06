import { type RefObject, useEffect } from 'react'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface UseFocusTrapOptions {
  active: boolean
  containerRef: RefObject<HTMLElement>
  initialFocusRef?: RefObject<HTMLElement>
  onClose?: () => void
}

export const useFocusTrap = ({ active, containerRef, initialFocusRef, onClose }: UseFocusTrapOptions) => {
  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    if (!container) return
    const previousFocus = document.activeElement as HTMLElement | null

    const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    const firstElement = initialFocusRef?.current ?? focusables[0]
    const lastElement = focusables[focusables.length - 1] ?? firstElement
    firstElement?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab' || focusables.length === 0) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [active, containerRef, initialFocusRef, onClose])
}
