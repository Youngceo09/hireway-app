import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell } from 'lucide-react';
import ProfileEditor from '../components/ProfileEditor';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  
  const user = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'student') {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem('token');
          const api = import.meta.env.VITE_API_URL;
          const headers = { Authorization: `Bearer ${token}` };
          const resM = await axios.get(`${api}/api/jobs/match`, { headers });
          const resA = await axios.get(`${api}/api/applications/my-applications`, { headers });
          setStats({ matches: resM.data.length, applied: resA.data.length });
        } catch (e) { console.log("Stats failed") }
      };
      fetchStats();
    }
  }, [user, navigate]);

  if (!user) return <div className="p-20 text-center font-bold">Checking Session...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      {/* MOBILE NAV */}
      <nav className="lg:hidden bg-white border-b p-4 flex justify-around sticky top-0 z-40 shadow-sm">
        <button onClick={() => setTab('overview')} className={`p-2 rounded-xl ${tab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-slate-300'}`}><LayoutDashboard size={24} /></button>
        {user.role === 'student' && <button onClick={() => setTab('profile')} className={`p-2 rounded-xl ${tab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-300'}`}><User size={24} /></button>}
        <button onClick={() => navigate('/my-applications')} className="p-2 text-slate-300"><Clock size={24} /></button>
      </nav>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-72 bg-white border-r p-8 hidden lg:block sticky top-[72px] h-[calc(100vh-72px)]">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutDashboard size={22} /> Overview</button>
          {user.role === 'student' && <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><User size={22} /> Profile</button>}
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">HireWay Control</h1>
        {tab === 'overview' ? (
          <div className="space-y-6">
            {user.role === 'employer' ? (
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Recruiter Hub</h2>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigate('/post-job')} className="bg-blue-600 p-4 rounded-xl font-bold">Post New Job</button>
                  <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 p-4 rounded-xl font-bold">View Applicants</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border shadow-sm"><TrendingUp className="text-blue-600 mb-4" size={32}/><p className="text-slate-400 font-bold text-xs uppercase">Matches</p><h3 className="text-4xl font-black">{stats.matches}</h3></div>
                <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2rem] border shadow-sm cursor-pointer"><Clock className="text-purple-600 mb-4" size={32}/><p className="text-slate-400 font-bold text-xs uppercase">Applied</p><h3 className="text-4xl font-black">{stats.applied}</h3></div>
              </div>
            )}
          </div>
        ) : <ProfileEditor />}
      </main>
    </div>
  );
}