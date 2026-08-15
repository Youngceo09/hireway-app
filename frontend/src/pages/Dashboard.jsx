import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell, ArrowRight } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/login');
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const matchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, { headers });
        const appRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers });
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Dashboard sync error") }
    };
    if(user?.role === 'student') fetchStats();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      {/* MOBILE NAV (Visible only on phones) */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-5 flex justify-around sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}><LayoutDashboard size={20} /> Home</button>
        {user.role === 'student' && <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}><User size={20} /> Profile</button>}
        <button onClick={() => navigate('/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-black uppercase text-slate-300"><Clock size={20} /> Apps</button>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Overview</button>
          {user.role === 'student' && <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}><User size={22} /> Academic Profile</button>}
          <button onClick={() => navigate('/my-applications')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"><Clock size={22} /> My Applications</button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter">Control Center</h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Welcome, {user.name} • {user.role}</p>
            </div>
            <button className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-400 shadow-sm"><Bell size={24} /></button>
        </header>

        {tab === 'overview' ? (
          <>
            {user.role === 'employer' ? (
              <div className="bg-slate-900 p-10 lg:p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-2">Recruitment Hub</h2>
                    <p className="text-slate-400 font-medium mb-10">You have active student matches waiting for review.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-900 transition-transform active:scale-95"><PlusCircle size={22}/> Publish Job</button>
                      <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 backdrop-blur-md transition-all active:scale-95"><Users size={22}/> Candidate List</button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <TrendingUp className="text-blue-600 mb-6" size={40}/>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Live Matches</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 group transition-all">
                    <Clock className="text-purple-600 mb-6" size={40}/>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Submitted</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter group-hover:text-blue-600">{stats.applied}</h3>
                  </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex justify-between items-center shadow-xl">
                    <div>
                      <h3 className="text-xl font-bold">Profile Strength: 85%</h3>
                      <p className="text-slate-400 text-sm mt-1">Matched roles are prioritized based on your skills.</p>
                    </div>
                    <button onClick={() => setTab('profile')} className="bg-white text-slate-900 p-4 rounded-2xl font-black hover:bg-blue-50 transition active:scale-95"><ArrowRight size={24}/></button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
             <ProfileEditor />
          </div>
        )}
      </main>
    </div>
  );
}