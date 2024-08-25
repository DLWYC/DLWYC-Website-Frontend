import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Registration from './pages/Registration/Registration'
import EventsPage from './pages/Events/Events'
import AboutPage from './pages/About/About'
import ChaplainsPage from './pages/About/Chaplains'
import GalleryPage from './pages/Gallery/Gallery'
import Success from './pages/Success/Success'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// Pages
const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>

    <div>
      <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/about/chaplains' element={<ChaplainsPage />} />
            <Route path='/events' element={<EventsPage />} />
            <Route path='/gallery' element={<GalleryPage />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/registration/success' element={<Success />} />
          </Routes>
      </Router>
    </div>
    {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}

export default App
