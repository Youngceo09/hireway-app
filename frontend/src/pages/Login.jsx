import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Changed to use the live Render link automatically
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/'); 
      window.location.reload(); 
    } catch (err) {
      alert("Invalid Credentials. Please check your email and password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8">Login to your HireWay account</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="Email Address" required className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition">Login</button>
        </form>
        <p className="mt-8 text-sm">New to HireWay? <Link to="/register" className="text-blue-600 font-bold">Create Account</Link></p>
      </div>
    </div>
  );
}