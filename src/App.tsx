import { RouterProvider } from 'react-router-dom'

import { ThemeProvider } from '@/components/ThemeProvider'
import { router } from '@/router'

export const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
)
