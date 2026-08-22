import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, PlusCircle, Users, TrendingUp, Clock, Save, GraduationCap, BookOpen, Bell } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview'); // Switches between Stats and Profile
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
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

  // 2. Fetch Stats for Students
  useEffect(() => {
    if (!user || user.role !== 'student') return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const api = import.meta.env.VITE_API_URL;
        const headers = { Authorization: `Bearer ${token}` };
        const resM = await axios.get(`${api}/api/jobs/match`, { headers });
        const resA = await axios.get(`${api}/api/applications/my-applications`, { headers });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (e) { console.log("Stats error"); }
    };
    fetchStats();
  }, [user]);

  // 3. Save Profile Logic
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const api = import.meta.env.VITE_API_URL;
      const skillsArray = profileData.skills.split(',').map(s => s.trim());
      const res = await axios.put(`${api}/api/auth/profile`, 
        { ...profileData, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("✅ Profile Updated!");
      setTab('overview');
    } catch (err) { alert("Save failed."); }
    setLoading(false);
  };

  if (!user) return <div className="p-20 text-center font-black text-blue-600 animate-pulse">Loading HireWay...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* MOBILE NAV: This allows you to switch to the Profile tab on a phone */}
      <nav className="lg:hidden bg-white border-b border-slate-100 p-4 flex justify-around sticky top-0 z-50 shadow-sm">
        <button onClick={() => setTab('overview')} className={`flex flex-col items-center gap-1 text-[10px] font-black ${tab === 'overview' ? 'text-blue-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={20} /> HOME
        </button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] font-black ${tab === 'profile' ? 'text-blue-600' : 'text-slate-300'}`}>
            <User size={20} /> PROFILE
          </button>
        )}
        <button onClick={() => navigate(user.role === 'employer' ? '/manage-applicants' : '/my-applications')} className="flex flex-col items-center gap-1 text-[10px] font-black text-slate-300">
          <Clock size={20} /> {user.role === 'employer' ? 'LIST' : 'APPS'}
        </button>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r border-slate-100 p-10">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
              <LayoutDashboard size={20} /> Overview
            </button>
            {user.role === 'student' && (
              <button onClick={() => setTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${tab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <User size={20} /> My Profile
              </button>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-6 lg:p-12">
          <header className="flex justify-between items-center mb-10">
             <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Control Center</h1>
             <div className="bg-white p-2 px-4 rounded-full border text-xs font-bold text-blue-600 uppercase">{user.role}</div>
          </header>

          {tab === 'overview' ? (
            <div className="space-y-6">
              {user.role === 'employer' ? (
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6">Employer Hub</h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => navigate('/post-job')} className="bg-blue-600 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900">
                      <PlusCircle size={20}/> Post Job
                    </button>
                    <button onClick={() => navigate('/manage-applicants')} className="bg-white/10 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                      <Users size={20}/> View Applicants
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <TrendingUp className="text-blue-600 mb-6" size={32}/>
                    <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Live Matches</p>
                    <h3 className="text-6xl font-black text-slate-900 mt-2">{stats.matches}</h3>
                  </div>
                  <div onClick={() => navigate('/my-applications')} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer active