import type { ReactNode } from 'react'

interface CarouselRowProps {
  title: string
  children: ReactNode
}

export const CarouselRow = ({ title, children }: CarouselRowProps) => (
  <section className="space-y-2">
    <header className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-nothing-300">
      <span>{title}</span>
    </header>
    <div className="terminal-carousel flex gap-2 overflow-x-auto pb-2">{children}</div>
  </section>
)
