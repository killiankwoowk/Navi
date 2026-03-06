import { useState } from 'react'
import { clsx } from 'clsx'

import { useIntersectionImage } from '@/hooks/useIntersectionImage'

interface CoverArtImageProps {
  src?: string
  alt: string
  className?: string
  imageClassName?: string
  fallbackLabel?: string
}

export const CoverArtImage = ({
  src,
  alt,
  className,
  imageClassName,
  fallbackLabel = '[ no cover ]',
}: CoverArtImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const { targetRef, isVisible } = useIntersectionImage()

  const shouldRenderImage = Boolean(src) && !failed && isVisible

  return (
    <div ref={targetRef} className={clsx('relative', className)}>
      {shouldRenderImage ? (
        <img
          src={src}
          alt={alt}
          className={clsx('h-full w-full object-cover transition-opacity duration-fast', loaded ? 'opacity-100' : 'opacity-70', imageClassName)}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      {!shouldRenderImage || !loaded ? (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center border border-terminal-text/25 bg-black/40 text-[10px] uppercase tracking-[0.14em] text-terminal-muted">
          {fallbackLabel}
        </div>
      ) : null}
    </div>
  )
}

