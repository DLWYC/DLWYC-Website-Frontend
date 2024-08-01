import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages
import HomePage from './pages/Home/home'

function App() {

  return (
    <div>
      <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
          </Routes>
      </Router>
    </div>
  )
}

export default App
