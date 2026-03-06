import type { Album } from '@/api/types'
import { ResponsiveGrid } from '@/components/common/ResponsiveGrid'
import { AlbumCard } from '@/components/home/AlbumCard'

interface ResponsiveAlbumGridProps {
  albums: Album[]
  coverUrlForAlbum: (album: Album) => string | undefined
  onPlayAlbum: (album: Album) => void
  onQueueAlbum: (album: Album) => void
  onOpenAlbum: (albumId: string) => void
}

export const ResponsiveAlbumGrid = ({
  albums,
  coverUrlForAlbum,
  onPlayAlbum,
  onQueueAlbum,
  onOpenAlbum,
}: ResponsiveAlbumGridProps) => (
  <ResponsiveGrid
    items={albums}
    keyFor={(album) => album.id}
    renderItem={(album) => (
      <AlbumCard
        album={album}
        coverUrl={coverUrlForAlbum(album)}
        onPlay={() => onPlayAlbum(album)}
        onQueue={() => onQueueAlbum(album)}
        onOpen={() => onOpenAlbum(album.id)}
      />
    )}
  />
)

