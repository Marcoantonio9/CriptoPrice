import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './components/layout'
import { Home } from './pages/home'
import { Details } from './pages/details'
import { NotFound } from './pages/notFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/details/:cripto',
        element: <Details />
      },
      {
        path: '*',
        element: <NotFound />
      },
    ]
  }
])

export { router }