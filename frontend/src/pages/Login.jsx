import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/'); 
      window.location.reload(); 
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border w-full max-w-md">
        <h2 className="text-3xl font-black text-center mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Access your HireWay account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="email" placeholder="Email Address" required className="w-full pl-12 p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-600" onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full pl-12 pr-12 p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-600" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</Link>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
        <p className="text-center mt-8 text-sm text-slate-600">
          New to HireWay? <Link to="/register" className="text-blue-600 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
}