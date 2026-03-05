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
- Library browsing: artists, artist detail, album detail, album dashboard
- Real-time search (artists/albums/songs)
- Persistent global player (play/pause, seek, prev/next, shuffle, repeat, volume)
- Queue add/remove/reorder (drag-drop + buttons)
- Sleep timer (15/30/60 + cancel)
- Playlist view/create and song add/remove
- Playlist list/grid toggle with virtualization
- Lyrics panel with sync/follow controls and fallback sources
- Favorites / Most Played / Recently Played pages
- Audio quality control (`auto`, `low`, `medium`, `high`) via `maxBitRate`
- Cover art via `getCoverArt.view`
- Stream playback via `/rest/stream.view`

## Run

```bash
pnpm install
pnpm dev
```

Default login server is prefilled to `https://music.dobymick.me`.
You can override it with:

```bash
# .env.local
VITE_DEFAULT_NAVIDROME_URL=https://your-navidrome-host
VITE_GENIUS_API_KEY=your_genius_api_key_here
VITE_DEFAULT_AUDIO_QUALITY=auto
```

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
```
