import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ matches: 0, applied: 0 });
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ university: '', programme: '', skills: '' });

  // HARDCODED API URL to ensure phone connectivity
  const API_URL = "https://hireway-app.onrender.com";

  useEffect(() => {
    // 1. Safe User Loading with Error Catching
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setProfile({
          university: parsed.studentProfile?.university || '',
          programme: parsed.studentProfile?.programme || '',
          skills: parsed.studentProfile?.skills?.join(', ') || ''
        });
      } else {
        navigate('/login');
      }
    } catch (e) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // 2. Fetch Stats only if student
    if (!user || user.role !== 'student') return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const resM = await axios.get(`${API_URL}/api/jobs/match`, { headers });
        const resA = await axios.get(`${API_URL}/api/applications/my-applications`, { headers });
        setStats({ matches: resM.data.length, applied: resA.data.length });
      } catch (err) { console.log("Fetch failed"); }
    };
    fetchStats();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const skillsArray = profile.skills.split(',').map(s => s.trim());
      const res = await axios.put(`${API_URL}/api/auth/profile`, 
        { ...profile, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("Profile Saved!");
      setTab('overview');
    } catch (err) { alert("Save Failed"); }
  };

  if (!user) return <div style={{padding: '50px', textAlign: 'center'}}>Loading App...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'sans-serif' }}>
      
      {/* MOBILE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'white', padding: '15px', borderBottom: '1px solid #eee' }}>
        <button onClick={() => setTab('overview')} style={{ border: 'none', background: 'none', fontWeight: 'bold', color: tab === 'overview' ? '#2563eb' : '#999' }}>🏠 HOME</button>
        {user.role === 'student' && (
          <button onClick={() => setTab('profile')} style={{ border: 'none', background: 'none', fontWeight: 'bold', color: tab === 'profile' ? '#2563eb' : '#999' }}>👤 PROFILE</button>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a' }}>DASHBOARD</h1>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>User: {user.name} ({user.role})</p>

        {tab === 'overview' ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {user.role === 'employer' ? (
              <div style={{ backgroundColor: '#0f172a', padding: '30px', borderRadius: '25px', color: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '22px' }}>Recruiter Hub</h2>
                <button onClick={() => navigate('/post-job')} style={{ marginTop: '20px', width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}>POST JOB</button>
                <button onClick={() => navigate('/manage-applicants')} style={{ marginTop: '10px', width: '100%', padding: '15px', backgroundColor: '#334155', color: 'white', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}>VIEW APPLICANTS</button>
              </div>
            ) : (
              <>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>MATCHES</p>
                  <h3 style={{ fontSize: '40px', margin: '5px 0' }}>{stats.matches}</h3>
                </div>
                <div onClick={() => navigate('/my-applications')} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#7c3aed' }}>APPLIED</p>
                  <h3 style={{ fontSize: '40px', margin: '5px 0' }}>{stats.applied}</h3>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', border: '1px solid #e2e8f0' }}>
            <h2 style