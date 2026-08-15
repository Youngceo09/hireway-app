import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, LogIn } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  
  // 1. Safe User Fetch
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Fetch stats if user is a student
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'student') return;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const matchRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, { headers });
        const appRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, { headers });
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Data sync error") }
    };
    fetchStats();
  }, [user]);

  // 3. SHOW THIS IF LOGGED OUT (Prevents blank screen)
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 text-center">
        <div className="bg-blue-50 p-6 rounded-full text-blue-600 mb-6">
          <LogIn size={48} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Session Expired</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Please log in to access your personalized dashboard and smart matches.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 w-full max-w-xs"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* MOBILE NAV */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-around sticky top-0 z-40 shadow-sm">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={22} /> HOME
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}>
            <User size={22} /> PROFILE
          </button>
        )}
        <button onClick={() => navigate('/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Clock size={22} /> APPS
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
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Dashboard</h1>

        {tab === 'overview' ? (
          <div className="space-y-6">
            {user.role === 'employer' ? (
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6">Employer Hub</h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                      <PlusCircle size={20}/> Post New Job
                    </button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 p-4 rounded-xl font-bold flex items-center justify-center gap-2">
                      <Users size={20}/> View Applicants
                    </button>
                  </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <TrendingUp className="text-blue-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Matches Found</p>
                   <h3 className="text-5xl font-black mt-2 text-slate-900">{stats.matches}</h3>
                </div>
                <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer">
                   <Clock className="text-purple-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Applications</p>
                   <h3 className="text-5xl font-black mt-2 text-slate-900">{stats.applied}</h3>
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