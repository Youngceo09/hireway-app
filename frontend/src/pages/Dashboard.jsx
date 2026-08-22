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

  // 1. SAFE DATA LOADING
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
      console.error("Critical Auth Error");
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  // 2. SAFE API CALLS
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
        console.log("Stats fetch failed - Backend might be sleeping");
      }
    };
    fetchStats();
  }, [user]);

  // 3. INTERNAL PROFILE SAVE (No external file needed)
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
      alert("✅ Cloud Sync Successful!");
      setTab('overview');
    } catch (err) {
      alert("Update failed. Check internet.");
    }
    setLoading(false);
  };

  if (!user) return <div className="p-20 text-center font-bold">Verifying Session...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* MOBILE TOP NAV */}
      <nav className="lg:hidden bg-white border-b p-4 flex justify-around sticky top-0 z-50 shadow-sm">
        <button onClick={() => setTab('overview')} className={`p-2 ${tab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`}><LayoutDashboard size={24} /></button>
        {user.role === 'student' && <button onClick={() => setTab('profile')} className={`p-2 ${tab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}><User size={24} /></button>}
        <button onClick={() => navigate('/my-applications')} className="p-2 text-slate-400"><Clock size={24} /></button>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-72 bg-white border-r p-10">
          <div className="space-y-4">
            <button onClick={() => setTab('overview')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold ${tab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}><LayoutDashb