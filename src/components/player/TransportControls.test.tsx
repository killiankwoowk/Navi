import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { TransportControls } from '@/components/player/TransportControls'

describe('TransportControls', () => {
  it('calls play toggle when play button is clicked', () => {
    const onTogglePlay = vi.fn()
    render(
      <TransportControls
        isPlaying={false}
        shuffle={false}
        repeat="off"
        onTogglePlay={onTogglePlay}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        onToggleShuffle={vi.fn()}
        onCycleRepeat={vi.fn()}
      />,
    )

    const playButton = screen.getAllByRole('button')[2]
    fireEvent.click(playButton)
    expect(onTogglePlay).toHaveBeenCalled()
  })
})
