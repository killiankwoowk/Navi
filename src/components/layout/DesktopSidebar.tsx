import { NavLink } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { desktopNavItems } from '@/components/layout/navItems'

interface DesktopSidebarProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export const DesktopSidebar = ({ collapsed, onToggleCollapsed }: DesktopSidebarProps) => (
  <aside className="terminal-panel h-full min-h-0 overflow-hidden">
    <div className="terminal-heading flex items-center justify-between">
      <span>{collapsed ? '#' : '# Nav'}</span>
      <button
        type="button"
        className="terminal-button min-h-11 px-2 py-1"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>
    </div>
    <nav className={`space-y-1 p-2 text-xs uppercase tracking-[0.15em] text-center ${collapsed ? 'px-1' : ''}`}>
      {desktopNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex min-h-11 items-center justify-center gap-2 border px-2 py-2 text-center transition-colors duration-fast ${
              isActive
                ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                : 'border-terminal-text/15 text-terminal-muted hover:border-terminal-text/45 hover:text-terminal-text'
            } ${collapsed ? 'justify-center px-1' : ''}`
          }
          aria-label={item.label}
        >
          <item.icon size={14} />
          {!collapsed ? <span className="truncate">{item.label}</span> : null}
        </NavLink>
      ))}
    </nav>
  </aside>
)
