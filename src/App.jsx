import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Registration from './pages/Registration/Registration'
import EventsPage from './pages/Events/Events'
import DisplayEvent from './pages/Events/DisplayEvents'
import AboutPage from './pages/About/About'
import ChaplainsPage from './pages/About/Chaplains'
import ChairmanPage from './pages/About/Chairmans'
import GalleryPage from './pages/Gallery/Gallery'
import Success from './pages/Success/Success'
import PaymentSuccess from './pages/Success/PaymentSuccess'

import NotFound from "./pages/404/NotFound";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
// Pages


function App() {

  return (
    <div>
      <Router>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/about/chaplains' element={<ChaplainsPage />} />
            <Route path='/about/chairmans' element={<ChairmanPage />} />
            <Route path='/events' element={<EventsPage />} />
            <Route path='/events/:eventId' element={<DisplayEvent />} />
            <Route path='/gallery' element={<GalleryPage />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/registration/verify' element={<Success />} />
            <Route path='/payment/successful' element={<PaymentSuccess />} />
          </Routes>
      </Router>
      
    </div>
  )
}

export default App
