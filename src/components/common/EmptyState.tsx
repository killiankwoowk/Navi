interface EmptyStateProps {
  title: string
  hint?: string
}

export const EmptyState = ({ title, hint }: EmptyStateProps) => (
  <div className="terminal-panel p-6 text-sm text-terminal-muted">
    <p className="m-0 text-terminal-text">{title}</p>
    {hint ? <p className="m-0 mt-2">{hint}</p> : null}
  </div>
)
