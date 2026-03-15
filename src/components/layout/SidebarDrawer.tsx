import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { useRef } from 'react'

import { desktopNavItems } from '@/components/layout/navItems'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface SidebarDrawerProps {
  open: boolean
  onClose: () => void
}

export const SidebarDrawer = ({ open, onClose }: SidebarDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    initialFocusRef: closeButtonRef,
    onClose,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Sidebar drawer">
      <button className="absolute inset-0 bg-black/70" type="button" onClick={onClose} aria-label="Close sidebar overlay" />
      <aside ref={panelRef} className="terminal-panel absolute inset-y-0 left-0 w-[min(300px,85vw)] p-3">
        <div className="terminal-heading flex items-center justify-between">
          <span># Navigation</span>
          <button
            ref={closeButtonRef}
            type="button"
            className="terminal-button min-h-11 px-2 py-1"
            onClick={onClose}
            aria-label="Close sidebar drawer"
          >
            <X size={14} />
          </button>
        </div>
        <nav className="space-y-1 p-2 text-xs uppercase tracking-[0.15em] text-center">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex min-h-11 items-center justify-center gap-2 border px-2 py-2 text-center transition-colors duration-fast ${
                  isActive
                    ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                    : 'border-terminal-text/15 text-terminal-muted hover:border-terminal-text/45 hover:text-terminal-text'
                }`
              }
              aria-label={item.label}
            >
              <item.icon size={16} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}
