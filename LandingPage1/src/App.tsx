import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'

const basePath = import.meta.env.BASE_URL ?? '/'

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App