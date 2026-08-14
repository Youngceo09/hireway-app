import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, LogOut, AlertCircle, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // 1. State to control the Logout Confirmation Modal
  const [showConfirm, setShowConfirm] = useState(false);

  const executeLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowConfirm(false);
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <>
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
              <Link to="/login" className="text-sm font-semibold text-slate-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg">
                Create Account
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-5">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <LayoutDashboard size={18} className="text-blue-600" />
                Dashboard
              </Link>
              {/* 2. Button now triggers the modal instead of logging out immediately */}
              <button onClick={() => setShowConfirm(true)} className="text-slate-400 hover:text-red-500 transition-all">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. MODERN LOGOUT CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Dark Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirm(false)}
          ></div>

          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors"
            >
                <X size={20} />
            </button>

            <div className="text-center">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">Wait a second!</h3>
              <p className="text-slate-500 font-medium mb-8">Are you sure you want to log out of your account?</p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={executeLogout}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                  Yes, Log me out
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-slate-50 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}