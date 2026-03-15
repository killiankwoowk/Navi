# Navi Terminal Player

Spotify-style Navidrome web frontend with a terminal/CLI visual theme.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Typography plugin
- Zustand state management
- React Router
- Axios + Subsonic/OpenSubsonic API
- React Query caching
- dnd-kit queue reordering
- Vitest + RTL + Playwright smoke

## Features

- Login to Navidrome using Subsonic token auth (`u`, `t`, `s`)
- Library browsing: artists, artist detail, album detail, song detail, album dashboard
- Real-time search (artists/albums/songs)
- Persistent global player (play/pause, seek, prev/next, shuffle, repeat, volume)
- Queue add/remove/reorder (drag-drop + buttons)
- Sleep timer (15/30/60 + cancel)
- Playlist view/create and song add/remove
- Playlist list/grid toggle with virtualization
- Lyrics panel with sync/follow controls and fallback sources
- Favorites / Most Played / Recently Played pages
- Profile and Settings pages (quality, sleep default, lyrics, theme/font, privacy import/export)
- Scrobble support via Navidrome (`scrobble.view`) with in-player confirmation counter
- Audio quality control (`auto`, `low`, `medium`, `high`) via `maxBitRate`
- Cover art via `getCoverArt.view`
- Stream playback via `/rest/stream.view`
- Linkable lists: albums, artists, and songs link to their detail pages

## Run

```bash
pnpm install
pnpm dev
```

Default login server is prefilled to `https://music.dobymick.me`.
You can override it with:

```bash
# .env.local
VITE_DEFAULT_NAVIDROME_URL=https://music.dobymick.me
VITE_GENIUS_API_KEY=
VITE_DEFAULT_AUDIO_QUALITY=auto
```

Settings page also supports a local Genius key override (`Settings -> Lyrics`), stored in browser localStorage when entered.

### Last.fm scrobbling

Last.fm authentication is handled by your Navidrome server. Configure it in the Navidrome admin UI.  
This client only reports playback via `scrobble.view` and shows a session scrobble counter in the player.

## Documentation

Technical architecture, data flow, and integration notes live here:
[TECHNICAL.md](/d:/Navi/docs/TECHNICAL.md)

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Live E2E smoke (optional)

Set:

- `E2E_BASE_URL`
- `E2E_NAVIDROME_URL`
- `E2E_NAVIDROME_USER`
- `E2E_NAVIDROME_PASSWORD`

Then run:

```bash
pnpm test:e2e
```

Additional E2E flow:

```bash
pnpm test:e2e -- tests/e2e/playback.spec.ts
pnpm test:e2e -- tests/e2e/album-navigation.spec.ts
```
