import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, LogOut, AlertCircle } from 'lucide-react';

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
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 px-4 lg:px-12 flex justify-between items-center sticky top-0 z-50 h-[72px]">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <Briefcase size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">HireWay</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {!user ? (
            <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-600 transition-all">
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              {/* DASHBOARD BUTTON - Now visible on mobile! */}
              <Link to="/dashboard" className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-200">
                <LayoutDashboard size={16} className="text-blue-600" />
                <span className="hidden xs:inline">Dashboard</span>
              </Link>
              
              <button onClick={() => setShowConfirm(true)} className="w-9 h-9 flex items-center justify-center text-slate-400 bg-slate-100/50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center border">
            <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-black mb-2">Logout?</h3>
            <div className="flex flex-col gap-2 mt-6">
              <button onClick={executeLogout} className="bg-red-500 text-white py-3 rounded-2xl font-bold">Yes, Logout</button>
              <button onClick={() => setShowConfirm(false)} className="text-slate-400 font-bold py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}