import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration Successful! Please Login.");
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join HireWay today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
            <button type="button" onClick={() => setFormData({...formData, role: 'student'})}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${formData.role === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
              Student
            </button>
            <button type="button" onClick={() => setFormData({...formData, role: 'employer'})}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${formData.role === 'employer' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
              Employer
            </button>
          </div>
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="text" placeholder="Full Name" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input type="password" placeholder="Password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
            Create Account
          </button>
        </form>
        <p className="text-center mt-8 text-slate-600 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}