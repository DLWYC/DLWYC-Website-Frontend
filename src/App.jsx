import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import Glogin from './pages/Login/Glogin'
import Signup from './pages/Login/SignUp'
import UDashboard from './pages/Dashboard/UDashboard'
// Pages

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

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
            <Route path= '/glogin'element={<Glogin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route
            path="/udashboard"
          element={
            <ProtectedRoute>
              <UDashboard />
            </ProtectedRoute>
          }
        />


          </Routes>
      </Router>
      
    </div>
  )
}

export default App
