import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, PlusCircle, Users, TrendingUp, Clock } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  
  // 1. Get user with safe fallback
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Security Check
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 3. Fetch Data safely
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'student') return;
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const api = import.meta.env.VITE_API_URL;
        
        const mRes = await axios.get(`${api}/api/jobs/match`, config);
        const aRes = await axios.get(`${api}/api/applications/my-applications`, config);
        
        setStats({ matches: mRes.data.length, applied: aRes.data.length });
      } catch (err) { console.log("Stats error") }
    };
    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* MOBILE NAV (Visible only on phone) */}
      <div className="lg:hidden bg-white border-b p-4 flex justify-around sticky top-0 z-40 shadow-sm">
        <button onClick={() => setTab('overview')} className={`p-2 rounded-xl ${tab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
          <LayoutDashboard size={24} />
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`p-2 rounded-xl ${tab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}>
            <User size={24} />
          </button>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block">
        <div className="space-y-4">
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

      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-8">Dashboard</h1>

        {tab === 'overview' ? (
          <div>
            {user.role === 'employer' ? (
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6">Employer Hub</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                      <PlusCircle size={20}/> Post Job
                    </button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                      <Users size={20}/> Applicants
                    </button>
                  </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                   <TrendingUp className="text-blue-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Smart Matches</p>
                   <h3 className="text-4xl font-black mt-2 text-slate-900">{stats.matches}</h3>
                </div>
                <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-200 transition-all">
                   <Clock className="text-purple-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Applications</p>
                   <h3 className="text-4xl font-black mt-2 text-slate-900">{stats.applied}</h3>
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