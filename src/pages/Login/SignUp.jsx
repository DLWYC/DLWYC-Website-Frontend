import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import { GoogleLogin } from "@react-oauth/google";
import NavBar from "../../components/Nav_Bar/Nav_Bar";
import Footer from "../../components/Footer/Footer"

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://api.dlwyouth.org/api/dashboard/Glogin", { name, email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/udashboard");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <>
      <NavBar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
            Sign Up
          </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
  Already have an account?{" "}
   <Link to="/glogin" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    <Footer />
    </>
  );
}
