import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Save, GraduationCap, BookOpen, Bell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  
  // Profile Editor State
  const [profile, setProfile] = useState({ university: '', programme: '', skills: '' });
  const [loading, setLoading] = useState(false);

  // 1. Load user data safely
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfile({
        university: parsedUser.studentProfile?.university || '',
        programme: parsedUser.studentProfile?.programme || '',
        skills: parsedUser.studentProfile?.skills?.join(', ') || ''
      });
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
      } catch (e) { console.log("Stats sync error"); }
    };
    getData();
  }, [user]);

  // 3. Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const skillsArray = profile.skills.split(',').map(s => s.trim());
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, 
        { ...profile, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local storage so the name/profile stays updated
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("✅ Profile Updated on Cloud!");
      setTab('overview'); // Go back to stats
    } catch (err) {
      alert("Save failed. Check your internet.");
    }
    setLoading(false);
  };

  if (!user) return <div className="p-20 text-center font-black text-blue-600 animate-pulse uppercase">Securing Connection...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* MOBILE NAV (Visible only on phones) */}
      <div className="flex justify-around bg-white border-b border-slate-100 p-4 lg:hidden sticky top-0 z-50 backdrop-blur-md bg-white/90">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-black ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={20} /> HOME
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-black ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}>
            <User size={20} /> PROFILE
          </button>
        )}
        <button onClick={() => navigate('/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-black text-slate-300">
          <Clock size={20} /> APPS
        </button>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 p-10 sticky top-0 h-screen">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20} /> Overview
            </button>
            {user.role === 'student' && (
              <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                <User size={20} /> My Profile
              </button>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 lg:p-12">
          <header className="flex justify-between items-center mb-10">
             <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Control Center</h1>
                <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">Active User: {user.name}</p>
             </div>
             <div className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-300 shadow-sm"><Bell size={20}/></div>
          </header>

          {tab === 'overview' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-10 lg:p-16 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-4 uppercase">Employer Hub</h2>
                    <p className="text-slate-400 mb-10 font-medium max-w-sm">Publish roles and review matching students.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-900 flex items-center justify-center gap-2">
                        <PlusCircle size={20}/> Post Job
                      </button>
                      <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 px-8 py-4 rounded-2xl font-black backdrop-blur-md flex items-center justify-center gap-2">
                        <Users size={20}/> Applicants
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <TrendingUp className="text-blue-600 mb-6" size={32}/>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Live Matches</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer active:scale-95 transition-transform">
                    <Clock className="text-purple-600 mb-6" size={32}/>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Applications</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">{stats.applied}</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- INLINED PROFILE EDITOR --- */
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase flex items-center gap-3">
                <GraduationCap className="text-blue-600" size={28} /> Academic Profile
              </h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input required value={profile.university} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-slate-700"
                      onChange={(e) => setProfile({...profile, university: e.target.value})} placeholder="e.g. KNUST" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Study Programme</label>
                  <input required value={profile.programme} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-slate-700"
                    onChange={(e) => setProfile({...profile, programme: e.target.value})} placeholder="e.g. Computer Engineering" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (Separate with commas)</label>
                  <textarea required value={profile.skills} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 h-32 font-bold text-slate-700"
                    onChange={(e) => setProfile({...profile, skills: e.target.value})} placeholder="e.g. React, Node.js, Python" />
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Save size={20}/> {loading ? "Updating Cloud..." : "Save Smart Profile"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}