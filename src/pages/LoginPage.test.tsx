import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from '@/pages/LoginPage'

const loginMock = vi.fn().mockResolvedValue(undefined)
const navigateMock = vi.fn()

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: loginMock,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockClear()
    navigateMock.mockClear()
  })

  it('submits server credentials', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.clear(screen.getByLabelText('Server URL'))
    await user.type(screen.getByLabelText('Server URL'), 'http://localhost:4533')
    await user.type(screen.getByLabelText('Username'), 'admin')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'CONNECT' }))

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith({
        serverUrl: 'http://localhost:4533',
        username: 'admin',
        password: 'secret',
      }),
    )
  })
})
