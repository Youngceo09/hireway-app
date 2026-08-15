import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);

  // 1. Load user data safely
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. Fetch Stats
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const getData = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = import.meta.env.VITE_API_URL;
        const headers = { Authorization: `Bearer ${token}` };
        const resM = await axios.get(`${api}/api/jobs/match`, { headers });
        const resA = await axios.get(`${api}/api/applications/my-applications`, { headers });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (e) { console.log("Fetch error"); }
    };
    getData();
  }, [user]);

  if (!user) return <div className="p-20 text-center font-bold text-blue-600">Loading Secure Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* MOBILE NAVIGATION BAR */}
      <div className="flex justify-around bg-white border-b border-slate-200 p-4 lg:hidden sticky top-0 z-50">
        <button onClick={() => setTab('overview')} className={`text-xs font-black uppercase ${tab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}>Stats</button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`text-xs font-black uppercase ${tab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>Edit Profile</button>
        )}
        <button onClick={() => navigate('/my-applications')} className="text-xs font-black uppercase text-slate-400">My Apps</button>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 p-10">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full text-left p-4 rounded-2xl font-bold ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Overview</button>
            <button onClick={() => setTab('profile')} className={`w-full text-left p-4 rounded-2xl font-bold ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>My Profile</button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 lg:p-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Control Center</h1>

          {tab === 'overview' ? (
            <div className="space-y-6">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-6">Employer Hub</h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 p-4 rounded-2xl font-bold">Post a New Job</button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 p-4 rounded-2xl font-bold">View Applicants</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2">Live Matches</p>
                    <h3 className="text-6xl font-black text-slate-900">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm cursor-pointer active:scale-95 transition-transform">
                    <p className="text-purple-600 font-black text-xs uppercase tracking-widest mb-2">Applications</p>
                    <h3 className="text-6xl font-black text-slate-900">{stats.applied}</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* INLINED PROFILE EDITOR - NO EXTERNAL IMPORT NEEDED */
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase">Academic Profile</h2>
              <p className="text-slate-500 mb-8 font-medium italic">Update your skills on your phone instantly.</p>
              <div className="space-y-4">
                 <input placeholder="University Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                 <input placeholder="Study Programme" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
                 <textarea placeholder="Skills (comma separated)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-32" />
                 <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Save Profile Changes</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}