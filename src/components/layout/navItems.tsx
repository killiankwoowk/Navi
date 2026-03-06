import type { LucideIcon } from 'lucide-react'
import { Clock3, Heart, Home, Library, ListMusic, Search, Settings, Sparkles, Users } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const desktopNavItems: NavItem[] = [
  { to: '/library', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/artists', label: 'Artists', icon: Users },
  { to: '/albums', label: 'Albums', icon: Library },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/recently-played', label: 'Recently Played', icon: Clock3 },
  { to: '/most-played', label: 'Most Played', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const mobileNavItems: NavItem[] = [
  { to: '/library', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/albums', label: 'Library', icon: Library },
  { to: '/playlists', label: 'Playlists', icon: ListMusic },
  { to: '/settings', label: 'Settings', icon: Settings },
]

