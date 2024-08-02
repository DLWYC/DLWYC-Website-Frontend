import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import Registration from './pages/Registration/Registration'

// Pages


function App() {

  return (
    
    <div>
      <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/registration' element={<Registration />} />
          </Routes>
      </Router>
    </div>
    
  )
}

export default App
