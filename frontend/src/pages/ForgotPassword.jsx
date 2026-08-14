import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      alert("Success! Check your Gmail.");
    } catch (err) { alert("Email not found."); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-black mb-6">Forgot Password?</h2>
        <form onSubmit={handleForgot} className="space-y-4">
          <input required type="email" placeholder="Enter your email" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" onChange={(e) => setEmail(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Send Reset Link</button>
        </form>
        <Link to="/login" className="block text-center mt-6 text-slate-400 text-sm font-bold">Back to Login</Link>
      </div>
    </div>
  );
}