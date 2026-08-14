import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
      alert("Password Updated!");
      navigate('/login');
    } catch (err) { alert("Link invalid or expired."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-black mb-6">New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input required type="password" placeholder="New Password" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">Update Password</button>
        </form>
      </div>
    </div>
  );
}