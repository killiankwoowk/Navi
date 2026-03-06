import { NavLink } from 'react-router-dom'

import { mobileNavItems } from '@/components/layout/navItems'

export const MobileNavBar = () => (
  <nav className="terminal-panel fixed bottom-0 left-0 right-0 z-40 border-x-0 border-b-0 px-1 pb-[calc(0.3rem+env(safe-area-inset-bottom))] pt-1 md:hidden">
    <div className="grid grid-cols-5 gap-1">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex min-h-12 flex-col items-center justify-center gap-1 border px-1 py-1 text-[10px] uppercase tracking-[0.08em] ${
              isActive
                ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                : 'border-terminal-text/15 text-terminal-muted'
            }`
          }
          aria-label={item.label}
        >
          <item.icon size={15} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
)

