import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import EventsPage from './pages/Events/Events'
import DisplayEvent from './pages/Events/DisplayEvents'
import AboutPage from './pages/About/About'
import ChaplainsPage from './pages/About/Chaplains'
import ChairmanPage from './pages/About/Chairmans'
import GalleryPage from './pages/Gallery/Gallery'

// Not Found
import NotFound from "./pages/404/NotFound";


// Registration
import Registration from './pages/Registration/Registration'
import RegistrationUnit from './pages/Registration/RegistrationUnit'
import Success from './pages/Success/Success'
import PaymentSuccess from './pages/Success/PaymentSuccess'


// Dashboard
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
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
            
            {/* Registration */}
            <Route path='/registration' element={<Registration />} />
            <Route path='/registration/verify' element={<Success />} />
            {/* <Route path='/payment/successful' element={<PaymentSuccess />} /> */}


            {/* Dashboard */}
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />


          </Routes>
      </Router>
      
    </div>
  )
}

export default App
