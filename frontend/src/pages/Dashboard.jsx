import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const matchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, { headers });
        const appRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers });
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Stat fetch error") }
    };
    if(user?.role === 'student') fetchStats();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* 1. DESKTOP SIDEBAR (Hidden on Phones) */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={22} /> Overview
          </button>
          {user?.role === 'student' && (
            <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              <User size={22} /> My Profile
            </button>
          )}
        </div>
      </aside>

      {/* 2. MOBILE NAVIGATION (Only shows on Phones) */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-around sticky top-0 z-40">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-xs font-bold ${tab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} /> Overview
        </button>
        {user?.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-xs font-bold ${tab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
            <User size={20} /> Profile
          </button>
        )}
        <button onClick={() => navigate('/my-applications')} className="flex flex-col items-center gap-1 text-xs font-bold text-slate-400">
          <Clock size={20} /> Apps
        </button>
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Account: {user?.role}</p>
            </div>
            <button className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-400 shadow-sm">
                <Bell size={20} />
            </button>
        </header>

        {tab === 'overview' ? (
          <>
            {user?.role === 'employer' ? (
              <div className="bg-slate-900 p-8 lg:p-12 rounded-[2rem] lg:rounded-[3rem] text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-2">Recruitment Hub</h2>
                  <p className="text-slate-400 mb-8">Manage your jobs and applicants.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <PlusCircle size={20}/> Post Job
                    </button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Users size={20}/> Applicants
                    </button>
                  </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <TrendingUp className="text-blue-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Smart Matches</p>
                   <h3 className="text-4xl font-black mt-2">{stats.matches}</h3>
                </div>
                <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 transition-all">
                   <Clock className="text-purple-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Applications</p>
                   <h3 className="text-4xl font-black mt-2">{stats.applied}</h3>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <ProfileEditor />
          </div>
        )}
      </main>
    </div>
  );
}