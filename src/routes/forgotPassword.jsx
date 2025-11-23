import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowLeftCircle } from 'lucide-react'
import { useState } from 'react';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/forgotPassword')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleError = (e) => {
    const error = e.response.data;
    return error;
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/forgotPassword`, {
        email: email,
      });

      if (result) {
        toast.success("Email Sent Successfully");
      } else {
        toast.error("Sorry Something Went Wrong");
      }
    } catch (err) {
      const error = handleError(err);
      toast.error(error);
      // set
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-rubik">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
          //   value={email}
          //   onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            // type="submit"
            className="w-full bg-primary-main text-white py-2 rounded-lg cursor-pointer hover:bg-reddish duration-100 transition-all"
          //   onClick={handleLogin}
          >
          {/* {loginIsLoading ? <span class="loader"></span> : "Login"} */}
          Reset Password 
          </button>


          <Link
            to="/userlogin"
            className="w-full flex bg-reddish justify-center gap-3 text-white py-2 rounded-lg cursor-pointer duration-100 transition-all"
          >
          <ArrowLeftCircle  /> Back To Login
          </Link>

        </div>



        </div>
      </div>
  )
}
