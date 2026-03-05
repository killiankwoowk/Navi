import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'

interface TerminalPanelProps extends PropsWithChildren {
  title: string
  rightSlot?: React.ReactNode
  className?: string
  bodyClassName?: string
}

export const TerminalPanel = ({ title, rightSlot, className, bodyClassName, children }: TerminalPanelProps) => (
  <section className={clsx('terminal-panel', className)}>
    <header className="terminal-heading flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-terminal-accent">$</span>
        <span>{title}</span>
      </div>
      {rightSlot}
    </header>
    <div className={clsx('p-3', bodyClassName)}>{children}</div>
  </section>
)
