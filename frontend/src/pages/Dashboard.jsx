import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell, ArrowRight } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  
  // 1. Get user data safely
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Security Redirect
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 3. Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const matchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, { headers });
        const appRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers });
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Stats fetch failed") }
    };
    if (user?.role === 'student') fetchStats();
  }, []);

  if (!user) return null;

  return (
    // Parent container: stacks vertically on mobile, horizontally on desktop
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* --- MOBILE SUB-NAV (Visible ONLY on phones) --- */}
      <div className="lg:hidden bg-white border-b border-slate-100 p-2 flex justify-around sticky top-[72px] z-40 shadow-sm backdrop-blur-md bg-white/90">
        <button 
          onClick={() => setTab('overview')} 
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${tab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Overview</span>
        </button>

        {user.role === 'student' && (
          <button 
            onClick={() => setTab('profile')} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${tab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
          >
            <User size={20} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Profile</span>
          </button>
        )}

        <button 
          onClick={() => navigate('/my-applications')} 
          className="flex flex-col items-center p-2 text-slate-400 rounded-xl"
        >
          <Clock size={20} />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Apps</span>
        </button>
      </div>

      {/* --- DESKTOP SIDEBAR (Visible ONLY on Laptops/Desktops) --- */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block sticky top-[72px] h-[calc(100vh-72px)]">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={22} /> Overview
          </button>
          {user.role === 'student' && (
            <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <User size={22} /> My Profile
            </button>
          )}
          <button onClick={() => navigate('/my-applications')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all">
            <Clock size={22} /> My Applications
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Welcome back, {user.name}</p>
            </div>
            <button className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-400 shadow-sm relative">
                <Bell size={22} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
        </header>

        {tab === 'overview' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {user.role === 'employer' ? (
              /* EMPLOYER RECRUITMENT HUB */
              <div className="bg-slate-900 p-8 lg:p-16 rounded-[2.5rem] lg:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl lg:text-4xl font-black mb-3">Employer Hub</h2>
                    <p className="text-slate-400 font-medium mb-10 max-w-sm">Publish opportunities and manage your active talent pipeline.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-900 transition-transform active:scale-95">
                        <PlusCircle size={22}/> Post a Job
                      </button>
                      <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 backdrop-blur-md transition-all active:scale-95">
                        <Users size={22}/> Candidate List
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
              </div>
            ) : (
              /* STUDENT STATS & PROGRESS */
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center sm:items-start sm:text-left">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-6"><TrendingUp size={32}/></div>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Live Matches</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">{stats.matches}</h3>
                  </div>
                  
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 group transition-all flex flex-col items-center text-center sm:items-start sm:text-left">
                    <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 mb-6"><Clock size={32}/></div>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Applications</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter group-hover:text-blue-600">{stats.applied}</h3>
                  </div>
                </div>

                <div className="bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
                    <div className="z-10 text-center md:text-left">
                      <h3 className="text-xl font-bold">Profile Strength: 85%</h3>
                      <p className="text-slate-400 text-sm mt-1">Matched roles are prioritized based on your skills.</p>
                    </div>
                    <button onClick={() => setTab('profile')} className="z-10 bg-white text-slate-900 p-4 rounded-2xl font-black hover:bg-blue-50 transition active:scale-95">
                      Complete Now <ArrowRight className="inline-block ml-2" size={20}/>
                    </button>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <ProfileEditor />
          </div>
        )}
      </main>
    </div>
  );
}