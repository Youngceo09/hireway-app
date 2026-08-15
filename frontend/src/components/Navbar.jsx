import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, LogOut, X, AlertCircle } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showConfirm, setShowConfirm] = useState(false);

  const executeLogout = () => {
    localStorage.clear();
    setShowConfirm(false);
    window.location.href = "/";
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 px-6 lg:px-12 flex justify-between items-center sticky top-0 z-50 h-[72px]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
            <Briefcase size={22} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">HireWay</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link to="/" className="hover:text-blue-600 transition">Explore</Link>
          <Link to="/my-applications" className="hover:text-blue-600 transition">Track Apps</Link>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link to="/login" className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100/50 px-4 py-2 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition">
                <LayoutDashboard size={18} className="text-blue-600" />
                Dashboard
              </Link>
              <button onClick={() => setShowConfirm(true)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 bg-slate-100/50 rounded-xl hover:bg-red-50 transition-all">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Logout?</h3>
            <p className="text-slate-500 font-medium mb-8">Are you sure you want to end your current session?</p>
            <div className="flex flex-col gap-3">
              <button onClick={executeLogout} className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all">Yes, Logout</button>
              <button onClick={() => setShowConfirm(false)} className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}