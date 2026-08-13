import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Refresh to clear state
  };

  return (
    <nav className="bg-white border-b border-slate-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Briefcase size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">HireWay</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        <Link to="/" className="hover:text-blue-600 transition">Find Jobs</Link>
        <Link to="/" className="hover:text-blue-600 transition">Internships</Link>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
              Create Account
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-5">
            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition">
              <LayoutDashboard size={18} className="text-blue-600" />
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}