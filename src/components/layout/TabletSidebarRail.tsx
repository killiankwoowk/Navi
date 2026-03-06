import { NavLink } from 'react-router-dom'

import { desktopNavItems } from '@/components/layout/navItems'

export const TabletSidebarRail = () => (
  <aside className="terminal-panel h-full min-h-0">
    <div className="terminal-heading text-center">#</div>
    <nav className="space-y-1 p-2">
      {desktopNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex min-h-11 items-center justify-center border px-2 py-2 transition-colors duration-fast ${
              isActive
                ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                : 'border-terminal-text/15 text-terminal-muted hover:border-terminal-text/45 hover:text-terminal-text'
            }`
          }
          aria-label={item.label}
          title={item.label}
        >
          <item.icon size={16} />
        </NavLink>
      ))}
    </nav>
  </aside>
)

