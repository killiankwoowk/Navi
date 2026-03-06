import { useEffect, useRef, useState } from 'react'

interface UseIntersectionImageOptions {
  rootMargin?: string
}

export const useIntersectionImage = ({ rootMargin = '240px' }: UseIntersectionImageOptions = {}) => {
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  const targetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isVisible) return

    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return { targetRef, isVisible }
}
