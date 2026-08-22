import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ matches: 0, applied: 0 });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = import.meta.env.VITE_API_URL || "https://hireway-app.onrender.com";
        const resM = await axios.get(`${api}/api/jobs/match`, { headers: { Authorization: `Bearer ${token}` } });
        const resA = await axios.get(`${api}/api/applications/my-applications`, { headers: { Authorization: `Bearer ${token}` } });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (e) { console.log("Stats error"); }
    };
    fetchStats();
  }, [user]);

  if (!user) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">Dashboard</h1>
      <p className="text-slate-400 font-bold text-xs mb-10 uppercase tracking-widest">User: {user.name}</p>

      {user.role === 'employer' ? (
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl text-center">
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-blue-400">Recruiter Hub</h2>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/post-job')} className="bg-blue-600 py-4 rounded-2xl font-bold">Post New Job</button>
            <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 py-4 rounded-2xl font-bold">View Applicants</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <p className="text-blue-600 font-black text-xs uppercase mb-2">Smart Matches</p>
            <h3 className="text-6xl font-black text-slate-900">{stats.matches}</h3>
          </div>
          <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm cursor-pointer">
            <p className="text-purple-600 font-black text-xs uppercase mb-2">Applied</p>
            <h3 className="text-6xl font-black text-slate-900">{stats.applied}</h3>
          </div>
        </div>
      )}
    </div>
  );
}