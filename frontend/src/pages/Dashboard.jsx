import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  
  // 1. Get user data safely with a check
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // 2. Security Redirect: If no user, go to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 3. Fetch Stats only if student
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const headers = { Authorization: `Bearer ${token}` };
        const matchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, { headers });
        const appRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers });
        
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Stats fetch failed") }
    };
    if (user?.role === 'student') fetchStats();
  }, [user]);

  // CRITICAL: If user is not found, stop the code here so it doesn't crash below
  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold">Redirecting to login...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* MOBILE NAV (Always at the top of the dashboard on phones) */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-around sticky top-[72px] z-40 backdrop-blur-md bg-white/90">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={20} /> Home
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}>
            <User size={20} /> Profile
          </button>
        )}
        <button onClick={() => navigate('/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Clock size={20} /> Apps
        </button>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block sticky top-[72px] h-[calc(100vh-72px)]">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={22} /> Overview
          </button>
          {user.role === 'student' && (
            <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              <User size={22} /> My Profile
            </button>
          )}
          <button onClick={() => navigate('/my-applications')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">
            <Clock size={22} /> My Applications
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter">Dashboard</h1>
                <p className="text-slate-400 font-bold text-xs uppercase mt-2">Account: {user.name || 'User'}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border text-slate-300"><Bell size={20} /></div>
        </header>

        {tab === 'overview' ? (
          <div className="animate-in fade-in duration-500">
            {user.role === 'employer' ? (
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Employer Hub</h2>
                    <p className="text-slate-400 mb-8">Manage student applications here.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-3 rounded-xl font-bold">Post Job</button>
                      <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 px-8 py-3 rounded-xl font-bold">Applicants</button>
                    </div>
                  </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                   <TrendingUp className="text-blue-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Smart Matches</p>
                   <h3 className="text-5xl font-black text-slate-900 mt-2">{stats.matches}</h3>
                </div>
                <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2.5rem] border shadow-sm cursor-pointer">
                   <Clock className="text-purple-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Applied</p>
                   <h3 className="text-5xl font-black text-slate-900 mt-2">{stats.applied}</h3>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ProfileEditor />
        )}
      </main>
    </div>
  );
}