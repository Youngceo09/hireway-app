import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Briefcase, PlusCircle, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
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
        const matchRes = await axios.get('http://localhost:5000/api/jobs/match', { headers });
        const appRes = await axios.get('http://localhost:5000/api/applications/my-applications', { headers });
        setStats({ matches: matchRes.data.length, applied: appRes.data.length });
      } catch (err) { console.log("Stat fetch error") }
    };
    if(user?.role === 'student') fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen">
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

      <main className="flex-1 p-10">
        {tab === 'overview' ? (
          <>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome, {user?.name}</h1>
            <p className="text-slate-500 font-bold mb-10 uppercase tracking-widest text-xs">Role: {user?.role}</p>

            {user?.role === 'employer' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-4">Recruitment Hub</h2>
                  <div className="flex gap-4">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <PlusCircle size={20}/> Post Job
                    </button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <Users size={20}/> Applicants
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <TrendingUp className="text-blue-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Smart Matches</p>
                   <h3 className="text-5xl font-black mt-2">{stats.matches}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm" onClick={() => navigate('/my-applications')} style={{cursor:'pointer'}}>
                   <Clock className="text-purple-600 mb-4" size={32}/>
                   <p className="text-slate-400 font-bold text-xs uppercase">Applications</p>
                   <h3 className="text-5xl font-black mt-2">{stats.applied}</h3>
                </div>
              </div>
            )}
          </>
        ) : (
          <ProfileEditor />
        )}
      </main>
    </div>
  );
}