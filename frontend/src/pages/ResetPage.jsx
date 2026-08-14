import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
      alert("Password Updated Successfully!");
      navigate('/login');
    } catch (err) {
      alert("Invalid or expired reset link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">New Password</h2>
          <p className="text-slate-500 text-sm">Enter your new secure password below.</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <input 
            required 
            type="password" 
            placeholder="Minimum 6 characters" 
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}