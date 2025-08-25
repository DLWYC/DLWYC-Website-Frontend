import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import Logo from "../../assets/main_logo.svg";
//import Alert from "../../components/Alert/Alert";
//import Input from "../../components/Inputs/Inputs";
import NavBar from "../../components/Nav_Bar/Nav_Bar";
import Footer from "../../components/Footer/Footer"

export default function Glogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
     const res = await axios.post("https://api.dlwyouth.org/api/dashboard/Glogin", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/udashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    localStorage.setItem("token", credentialResponse.credential);
    navigate("/udashboard");
  };

  return (
    <>
    <NavBar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

        {/* Google OAuth */}
        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        <p className="text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
        </div>
      </div>
    <Footer />
    </>
  );
}
