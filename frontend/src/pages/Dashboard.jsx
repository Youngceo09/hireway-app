import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Save, Bell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({ university: '', programme: '', skills: '' });

  // 1. SAFE DATA LOADING (Prevents White Screen Crash)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setProfileData({
          university: parsedUser.studentProfile?.university || '',
          programme: parsedUser.studentProfile?.programme || '',
          skills: parsedUser.studentProfile?.skills?.join(', ') || ''
        });
      } else {
        // If no user is found, send them to login
        navigate('/login');
      }
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  // 2. FETCH STATS (Only if logged in as student)
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiBase = import.meta.env.VITE_API_URL || 'https://hireway-app.onrender.com';
        const headers = { Authorization: `Bearer ${token}` };
        
        const resM = await axios.get(`${apiBase}/api/jobs/match`, { headers });
        const resA = await axios.get(`${apiBase}/api/applications/my-applications`, { headers });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (e) {
        console.log("Stats fetch failed - Backend waking up...");
      }
    };
    fetchStats();
  }, [user]);

  // 3. INTERNAL PROFILE SAVE
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'https://hireway-app.onrender.com';
      const skillsArray = profileData.skills.split(',').map(s => s.trim());
      
      const res = await axios.put(`${apiBase}/api/auth/profile`, 
        { ...profileData, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("✅ Profile Updated!");
      setTab('overview');
    } catch (err) {
      alert("Update failed. Check your connection.");
    }
    setLoading(false);
  };

  // 4. PREVENT CRASH IF USER IS NULL
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* MOBILE NAV (Top icons for phones) */}
      <nav className="lg:hidden bg-white border-b p-4 flex justify-around sticky top-0 z-50 shadow-sm">
        <button onClick={() => setTab('overview')} className={`p-2 rounded-xl ${tab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-slate-300'}`}>
          <LayoutDashboard size={24} />
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`p-2 rounded-xl ${tab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-300'}`}>
            <User size={24} />
          </button>
        )}
        <button onClick={() => navigate('/my-applications')} className="p-2 text-slate-300"><Clock size={24} /></button>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 p-10">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20} /> Overview
            </button>
            {user.role === 'student' && (
              <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                <User size={20} /> Profile
              </button>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 lg:p-12">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase">HireWay Hub</h1>
              <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Logged in as {user.name}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border text-slate-300"><Bell size={20} /></div>
          </header>

          {tab === 'overview' ? (
            <div className="space-y-6">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-6">Recruitment Center</h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 p-4 rounded-2xl font-bold shadow-lg">Post New Job</button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 p-4 rounded-2xl font-bold hover:bg-white/20 transition">View Applicants</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <TrendingUp className="text-blue-600 mb-4" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase">Smart Matches</p>
                    <h3 className="text-5xl font-black text-slate-900 mt-2">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-400 transition-all">
                    <Clock className="text-purple-600 mb-4" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase">Submitted</p>
                    <h3 className="text-5xl font-black text-slate-900 mt-2">{stats.applied}</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl">
              <h2 className="text-2xl font-black mb-8 uppercase text-slate-900">Academic Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                  <input required value={profileData.university} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-600 font-bold"
                    onChange={(e) => setProfileData({...profileData, university: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Programme</label>
                  <input required value={profileData.programme} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-600 font-bold"
                    onChange={(e) => setProfileData({...profileData, programme: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (comma separated)</label>
                  <textarea required value={profileData.skills} className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-600 h-32 font-bold"
                    onChange={(e) => setProfileData({...profileData, skills: e.target.value})} />
                </div>
                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">
                  {loading ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}