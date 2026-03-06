import type { AxiosError } from 'axios'

export interface AuthSession {
  serverUrl: string
  username: string
  password: string
  isAuthenticated: boolean
}

export interface SubsonicCredentials {
  serverUrl: string
  username: string
  password: string
}

export interface SubsonicResponse<T> {
  'subsonic-response': {
    status: 'ok' | 'failed'
    version: string
    type?: string
    serverVersion?: string
    openSubsonic?: boolean
    error?: {
      code: number
      message: string
    }
  } & T
}

export interface Artist {
  id: string
  name: string
  albumCount?: number
  coverArt?: string
}

export interface ArtistIndex {
  name: string
  artist?: Artist[]
}

export interface Song {
  id: string
  title: string
  album?: string
  albumId?: string
  artist?: string
  artistId?: string
  duration?: number
  track?: number
  year?: number
  genre?: string
  coverArt?: string
  suffix?: string
  bitrate?: number
  starred?: string
  playCount?: number
  lyrics?: string
  syncedLyrics?: string
  unsyncedLyrics?: string
}

export interface Album {
  id: string
  name: string
  artist?: string
  artistId?: string
  coverArt?: string
  songCount?: number
  duration?: number
  year?: number
  genre?: string
  song?: Song[]
}

export interface Playlist {
  id: string
  name: string
  songCount?: number
  duration?: number
  coverArt?: string
  created?: string
  changed?: string
  entry?: Song[]
}

export interface Search3Result {
  artist: Artist[]
  album: Album[]
  song: Song[]
}

export type RepeatMode = 'off' | 'all' | 'one'
export type AudioQuality = 'auto' | 'low' | 'medium' | 'high'
export type LyricsSource = 'auto' | 'genius' | 'local'
export type ThemeMode = 'terminal-dark' | 'terminal-contrast'
export type FontMode = 'jetbrains' | 'fira'
export type SleepTimerDefault = 'off' | 15 | 30 | 60

export interface LyricsEntry {
  time: number
  text: string
}

export interface LyricsPayload {
  plain: string | null
  synced: string | null
  provider: 'server' | 'genius' | 'local' | 'none'
}

export interface QueueItem {
  queueId: string
  track: Song
}

export interface SleepTimerState {
  endsAt: number | null
  durationMinutes: number | null
}

export interface PlayerState {
  queue: QueueItem[]
  currentTrackId: string | null
  currentIndex: number
  isPlaying: boolean
  shuffle: boolean
  repeat: RepeatMode
  volume: number
  progress: number
  duration: number
  shuffleOrder: number[]
  sleepTimer: SleepTimerState
}

export interface UsageEntry {
  song: Song
  playCount: number
  lastPlayedAt: number
}

export interface SubsonicApiError {
  code: number
  message: string
  type: 'auth' | 'request' | 'network' | 'unknown'
}

export interface UpdatePlaylistInput {
  playlistId: string
  name?: string
  comment?: string
  public?: boolean
  songIdToAdd?: string[]
  songIndexToRemove?: number[]
}

export interface StreamOptions {
  maxBitRate?: number
  format?: string
}

export interface NavidromeClient {
  login: () => Promise<void>
  getArtists: () => Promise<ArtistIndex[]>
  getArtist: (id: string) => Promise<{ artist: Artist; album: Album[]; song: Song[] }>
  getAlbum: (id: string) => Promise<Album>
  getAlbumList: (type?: string, size?: number, offset?: number) => Promise<Album[]>
  getSong: (id: string) => Promise<Song>
  search3: (query: string, artistCount?: number, albumCount?: number, songCount?: number) => Promise<Search3Result>
  getStarred: () => Promise<Song[]>
  getMostPlayed: (limit?: number) => Promise<Song[]>
  getRecentSongs: (limit?: number) => Promise<Song[]>
  getLyrics: (artist?: string, title?: string, songId?: string) => Promise<LyricsPayload | null>
  getPlaylists: () => Promise<Playlist[]>
  getPlaylist: (id: string) => Promise<Playlist>
  createPlaylist: (name: string, songIds?: string[]) => Promise<Playlist>
  updatePlaylist: (input: UpdatePlaylistInput) => Promise<void>
  streamViewUrl: (songId: string, opts?: StreamOptions) => string
  getStreamUrl: (songId: string, opts?: StreamOptions) => string
  getCoverArt: (coverArtId: string, size?: number) => string
  getCoverArtUrl: (coverArtId: string, size?: number) => string
}

export type AxiosApiError = AxiosError<SubsonicResponse<Record<string, unknown>>>
