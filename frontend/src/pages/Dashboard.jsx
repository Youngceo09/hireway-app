import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// We use basic text instead of icons for a second to see if the icons are causing the crash
export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Try to get user from localStorage carefully
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        navigate('/login');
      }
    } catch (e) {
      console.error("Storage error");
      navigate('/login');
    }
    setIsReady(true);
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'student') return;
      try {
        const token = localStorage.getItem('token');
        const apiBase = import.meta.env.VITE_API_URL;
        const resMatch = await axios.get(`${apiBase}/api/jobs/match`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resApps = await axios.get(`${apiBase}/api/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({ matches: resMatch.data.length, applied: resApps.data.length });
      } catch (err) {
        console.log("Stats fetch failed");
      }
    };
    if (user) fetchStats();
  }, [user]);

  // If we are checking the login, show a plain white background with a message
  if (!isReady || !user) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* SIMPLE MOBILE NAV */}
      <div className="flex justify-around bg-white border-b p-4 lg:hidden sticky top-0 z-50">
        <button onClick={() => setTab('overview')} className={`font-bold ${tab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}>HOME</button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`font-bold ${tab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>PROFILE</button>
        )}
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-white border-r p-8">
           <button onClick={() => setTab('overview')} className="block w-full text-left py-2 font-bold">Overview</button>
           <button onClick={() => setTab('profile')} className="block w-full text-left py-2 font-bold">Profile</button>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-6 lg:p-10">
          <h1 className="text-3xl font-black mb-4 uppercase">Dashboard</h1>
          <p className="mb-8 text-slate-500 font-bold">Welcome, {user.name}</p>

          {tab === 'overview' ? (
            <div className="space-y-4">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                  <h2 className="text-xl font-bold mb-4">Employer Hub</h2>
                  <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-6 py-2 rounded-xl font-bold">Post Job</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <p className="text-xs text-slate-400 font-bold">MATCHES</p>
                    <h3 className="text-3xl font-black">{stats.matches}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <p className="text-xs text-slate-400 font-bold">APPLIED</p>
                    <h3 className="text-3xl font-black">{stats.applied}</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-white p-6 rounded-3xl border">
                <p>Profile Editor goes here</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}