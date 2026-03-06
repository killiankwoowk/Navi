import { NavLink } from 'react-router-dom'

const links = [
  { to: '/library', label: '> Home' },
  { to: '/favorites', label: '> Favorites' },
  { to: '/most-played', label: '> Most Played' },
  { to: '/recently-played', label: '> Recently Played' },
  { to: '/artists', label: '> Artists' },
  { to: '/search', label: '> Search' },
  { to: '/playlists', label: '> Playlists' },
  { to: '/profile', label: '> Profile' },
  { to: '/settings', label: '> Settings' },
]

export const Sidebar = () => (
  <aside className="terminal-panel h-full min-h-0">
    <div className="terminal-heading"># Navigation</div>
    <nav className="space-y-1 p-2 text-xs uppercase tracking-[0.15em]">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block border px-2 py-2 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-terminal-green ${
              isActive
                ? 'border-terminal-accent bg-terminal-accent/10 text-terminal-accent'
                : 'border-terminal-text/15 text-terminal-muted hover:border-terminal-text/45 hover:text-terminal-text'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)
