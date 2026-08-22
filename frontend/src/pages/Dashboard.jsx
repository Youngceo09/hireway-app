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
  
  // State for the Profile Form
  const [profileData, setProfileData] = useState({ university: '', programme: '', skills: '' });

  // 1. Load user data safely
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
        navigate('/login');
      }
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  // 2. Fetch Stats
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
        console.log("Stats sync error");
      }
    };
    fetchStats();
  }, [user]);

  // 3. Handle Profile Save
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
      alert("Update failed. Check your internet.");
    }
    setLoading(false);
  };

  // 4. CRASH PREVENTION
  if (!user) return <div className="p-20 text-center font-bold text-blue-600">Verifying...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* MOBILE NAV */}
      <nav className="lg:hidden bg-white border-b p-4 flex justify-around sticky top-0 z-50 shadow-sm">
        <button onClick={() => setTab('overview')} className={`p-2 ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}><LayoutDashboard size={24} /></button>
        {user.role === 'student' && <button onClick={() => setTab('profile')} className={`p-2 ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}><User size={24} /></button>}
        <button onClick={() => navigate('/my-applications')} className="p-2 text-slate-300"><Clock size={24} /></button>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 p-10">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><LayoutDashboard size={20} /> Overview</button>
            {user.role === 'student' && <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><User size={20} /> Profile</button>}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 lg:p-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Dashboard</h1>

          {tab === 'overview' ? (
            <div className="space-y-6">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-6">Recruitment Hub</h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 p-4 rounded-2xl font-bold">Post Job</button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 p-4 rounded-2xl font-bold">View Applicants</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center sm:text-left">
                    <TrendingUp className="text-blue-600 mb-4 mx-auto sm:mx-0" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase">Matches</p>
                    <h3 className="text-5xl font-black text-slate-900 mt-1">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer text-center sm:text-left">
                    <Clock className="text-purple-600 mb-4 mx-auto sm:mx-0" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase">Applied</p>
                    <h3 className="text-5xl font-black text-slate-900 mt-1">{stats.applied}</h3>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-black mb-8 uppercase text-slate-900">Edit Profile</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <input required placeholder="University" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"
                  value={profileData.university} onChange={(e) => setProfileData({...profileData, university: e.target.value})} />
                <input required placeholder="Programme" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none"
                  value={profileData.programme} onChange={(e) => setProfileData({...profileData, programme: e.target.value})} />
                <textarea required placeholder="Skills (comma separated)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none h-32"
                  value={profileData.skills} onChange={(e) => setProfileData({...profileData, skills: e.target.value})} />
                <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}