import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      alert("Registration Successful! Now Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border w-full max-w-md">
        <h2 className="text-3xl font-black text-center mb-8">Create Account</h2>
        
        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button type="button" onClick={() => setFormData({...formData, role: 'student'})}
            className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
            Student
          </button>
          <button type="button" onClick={() => setFormData({...formData, role: 'employer'})}
            className={`flex-1 py-3 rounded-xl font-bold transition ${formData.role === 'employer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input required type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input required type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Sign Up</button>
        </form>
        <p className="text-center mt-6 text-sm">Have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
}