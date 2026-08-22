import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Bell, Save, BookOpen, Cpu, Code } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview'); // 'overview' or 'profile'
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    university: '',
    programme: '',
    skills: ''
  });

  // 1. Load user data safely
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Fill form with existing data
      setProfileData({
        university: parsedUser.studentProfile?.university || '',
        programme: parsedUser.studentProfile?.programme || '',
        skills: parsedUser.studentProfile?.skills?.join(', ') || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. Fetch Stats for Students
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = import.meta.env.VITE_API_URL || "https://hireway-app.onrender.com";
        const headers = { Authorization: `Bearer ${token}` };
        const resM = await axios.get(`${api}/api/jobs/match`, { headers });
        const resA = await axios.get(`${api}/api/applications/my-applications`, { headers });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (e) { console.log("Stats fetch sync...") }
    };
    fetchStats();
  }, [user]);

  // 3. Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const api = import.meta.env.VITE_API_URL || "https://hireway-app.onrender.com";
      const skillsArray = profileData.skills.split(',').map(s => s.trim());
      
      const res = await axios.put(`${api}/api/auth/profile`, 
        { ...profileData, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("✅ Profile Updated Successfully!");
      setTab('overview'); // Switch back to stats after saving
    } catch (err) {
      alert("Update failed. Check your internet connection.");
    }
    setLoading(false);
  };

  if (!user) return <div className="p-20 text-center font-black text-blue-600 animate-pulse uppercase">Verifying Session...</div>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC]">
      
      {/* MOBILE NAV (Top bar on phones) */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-around sticky top-[72px] z-40 shadow-sm backdrop-blur-md bg-white/90">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={20} /> Home
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-black uppercase ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}>
            <User size={20} /> Profile
          </button>
        )}
        <button onClick={() => navigate(user.role === 'employer' ? '/manage-applicants' : '/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-black text-slate-300">
          <Clock size={20} /> {user.role === 'employer' ? 'Candidates' : 'Apps'}
        </button>
      </nav>

      {/* DESKTOP SIDEBAR (Visible on laptop) */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 hidden lg:block sticky top-[72px] h-[calc(100vh-72px)]">
        <div className="space-y-3">
          <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
            <LayoutDashboard size={22} /> Overview
          </button>
          {user.role === 'student' && (
            <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <User size={22} /> My Profile
            </button>
          )}
          <button onClick={() => navigate(user.role === 'employer' ? '/manage-applicants' : '/my-applications')} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50">
            <Clock size={22} /> {user.role === 'employer' ? 'Manage Applicants' : 'My Applications'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Control Center</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Active Session: {user.name}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-300 shadow-sm"><Bell size={22} /></div>
        </header>

        {tab === 'overview' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {user.role === 'employer' ? (
              /* --- EMPLOYER HUB --- */
              <div className="bg-slate-900 p-10 lg:p-16 rounded-[2.5rem] lg:rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-3 uppercase tracking-tight">Recruiter Hub</h2>
                    <p className="text-slate-400 font-medium mb-10 max-w-sm">Manage your talent pipeline and publish new roles to students.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-lg shadow-blue-900 transition-transform active:scale-95">
                        <PlusCircle size={22}/> Post Job
                      </button>
                      <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 backdrop-blur-md transition-all active:scale-95">
                        <Users size={22}/> Applicant List
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
              </div>
            ) : (
              /* --- STUDENT STATS --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mb-6 shadow-sm shadow-blue-100"><TrendingUp size={32}/></div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Smart Matches</p>
                  <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">{stats.matches}</h3>
                </div>
                
                <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-blue-300 group transition-all flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 mb-6 shadow-sm shadow-purple-100"><Clock size={32}/></div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Applications</p>
                  <h3 className="text-6xl font-black text-slate-900 mt-2 tracking-tighter group-hover:text-blue-600">{stats.applied}</h3>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- INTEGRATED PROFILE EDITOR (Built into this file) --- */
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase flex items-center gap-3">
                <GraduationCap className="text-blue-600" size={32} /> Student Profile
              </h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input required value={profileData.university} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-slate-700"
                      onChange={(e) => setProfileData({...profileData, university: e.target.value})} placeholder="e.g. KNUST" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Study Programme</label>
                  <div className="relative">
                    <Cpu className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input required value={profileData.programme} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold text-slate-700"
                      onChange={(e) => setProfileData({...profileData, programme: e.target.value})} placeholder="e.g. Computer Science" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Skills (Comma Separated)</label>
                  <div className="relative">
                    <Code className="absolute left-4 top-4 text-slate-300" size={18} />
                    <textarea required value={profileData.skills} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 h-32 font-bold text-slate-700"
                      onChange={(e) => setProfileData({...profileData, skills: e.target.value})} placeholder="e.g. React, JavaScript, Python" />
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Save size={20}/> {loading ? "Syncing..." : "Update Matching Data"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}