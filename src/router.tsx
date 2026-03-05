/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react'
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/store/authStore'

const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const LibraryPage = lazy(() => import('@/pages/LibraryPage').then((module) => ({ default: module.LibraryPage })))
const ArtistsPage = lazy(() => import('@/pages/ArtistsPage').then((module) => ({ default: module.ArtistsPage })))
const ArtistDetailPage = lazy(() => import('@/pages/ArtistDetailPage').then((module) => ({ default: module.ArtistDetailPage })))
const AlbumDetailPage = lazy(() => import('@/pages/AlbumDetailPage').then((module) => ({ default: module.AlbumDetailPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then((module) => ({ default: module.SearchPage })))
const PlaylistsPage = lazy(() => import('@/pages/PlaylistsPage').then((module) => ({ default: module.PlaylistsPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

const PageLoader = () => (
  <div className="terminal-grid min-h-screen p-6">
    <div className="terminal-panel p-4 text-sm text-terminal-muted">$ loading...</div>
  </div>
)

const AuthenticatedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <AppShell />
}

const LoginLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/library" replace />
  }
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginLayout />
      </Suspense>
    ),
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthenticatedLayout />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/library" replace />,
      },
      {
        path: '/library',
        element: <LibraryPage />,
      },
      {
        path: '/artists',
        element: <ArtistsPage />,
      },
      {
        path: '/artist/:id',
        element: <ArtistDetailPage />,
      },
      {
        path: '/album/:id',
        element: <AlbumDetailPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/playlists',
        element: <PlaylistsPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])
