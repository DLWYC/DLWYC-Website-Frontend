import { RouterProvider } from '@tanstack/react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/lib/AuthContext'
import { router } from '@/router'


function App() {
  const auth = useAuth()

  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <ToastContainer newestOnTop={false} closeOnClick rtl={false} />
    </>
  )
}

export default App