import { Link } from 'react-router-dom'

import { TerminalPanel } from '@/components/common/TerminalPanel'

export const NotFoundPage = () => (
  <div className="terminal-grid flex min-h-screen items-center justify-center p-4">
    <TerminalPanel title="404">
      <p className="m-0 text-sm text-terminal-muted">Path not found.</p>
      <Link to="/library" className="terminal-button mt-3 inline-flex">
        return to library
      </Link>
    </TerminalPanel>
  </div>
)
