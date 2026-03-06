import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface ResponsiveGridProps<T> {
  items: T[]
  keyFor: (item: T) => string
  renderItem: (item: T) => ReactNode
  className?: string
}

export const ResponsiveGrid = <T,>({ items, keyFor, renderItem, className }: ResponsiveGridProps<T>) => (
  <div className={clsx('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6', className)}>
    {items.map((item) => (
      <div key={keyFor(item)} className="min-w-0">
        {renderItem(item)}
      </div>
    ))}
  </div>
)

