# Technical Documentation - Navi Terminal Player

This document describes the frontend architecture, data flow, and integration points for the terminal-style Navidrome client.

## Overview

Navi Terminal Player is a React 18 + TypeScript + Vite client for Navidrome using the Subsonic/OpenSubsonic API. The UI mimics a modern streaming layout while keeping a terminal aesthetic (monospace fonts, ASCII styling, neon accents). The player is global and persistent across routes, and state is managed with Zustand and React Query.

## Architecture

- **UI Shell**: `AppShell` composes `TopBar`, responsive layout, and `BottomPlayer`. Sidebar and queue behaviors are responsive by viewport.
- **Routing**: React Router `createBrowserRouter` with protected routes. `/login` is gated; all other routes require authentication.
- **Detail pages**: `/album/:id`, `/artist/:id`, `/song/:id` provide deep links from lists and search.
- **State**:
  - `authStore` for credentials + auth status.
  - `playerStore` for queue, playback, shuffle/repeat, progress, sleep timer.
  - `uiStore` for layout state and UI flags (including scrobble counter).
  - `settingsStore` for user preferences (quality, lyrics, theme, privacy).

## Data Flow

1. User logs in with server URL + credentials.
2. `createNavidromeClient` builds an Axios instance and auth parameters (`u`, `t`, `s`, `v`).
3. React Query caches list/album/playlist data, while the player store manages queue and playback.
4. The audio engine uses a single `HTMLAudioElement`, and player state updates from engine events.

## API Integration

Base path: `/rest` (same-origin or reverse proxy).

Key endpoints used:
- `getArtists.view`, `getArtist.view`
- `getAlbum.view`, `getAlbumList.view`
- `getSong.view`, `stream.view`
- `search3.view`
- `getPlaylists.view`, `getPlaylist.view`
- `createPlaylist.view`, `updatePlaylist.view`
- `getCoverArt.view`
- `scrobble.view`

### Scrobble Behavior

- A "now playing" event is sent at track start (`submission=false`).
- A submission is sent when `progress >= min(50% of duration, 240s)`, or on track end if not yet submitted.
- The UI increments a session-only scrobble counter after a successful submission.
- Last.fm authentication is handled on the Navidrome server, not the client.

## Player System

- `audioEngine` manages playback and emits `timeupdate`, `loadedmetadata`, `ended`, and `error` events.
- `playerStore` is the source of truth for playback state and queue.
- Repeat modes: `off`, `all`, `one`.
- Shuffle uses a deterministic order map for consistent next/previous behavior.

## Queue

- Queue items are stored with stable `queueId`.
- Drag and drop reorder is implemented with `dnd-kit`.
- Save queue as playlist and clear queue are supported in the queue UI.

## UI + Theming

- Tailwind CSS with a terminal palette and monospace fonts.
- ASCII headers, terminal buttons, and neon highlights.
- Responsive layout adapts interactions by breakpoint (mobile vs tablet vs desktop).
- Lists render semantic links for albums, artists, and songs, with action buttons isolated from navigation.

## Performance

- Route-level lazy loading.
- React Query caching with sensible `staleTime`.
- Virtualized list/grid rendering for large collections.

## Testing

- Unit tests: Vitest + React Testing Library.
- E2E: Playwright.
- Core areas covered: player controls, queue behavior, playlist grid, scrobble logic, and responsive layout.

## Environment Variables

- `VITE_DEFAULT_NAVIDROME_URL`
- `VITE_GENIUS_API_KEY`
- `VITE_DEFAULT_AUDIO_QUALITY`

E2E (optional):
- `E2E_BASE_URL`
- `E2E_NAVIDROME_URL`
- `E2E_NAVIDROME_USER`
- `E2E_NAVIDROME_PASSWORD`
