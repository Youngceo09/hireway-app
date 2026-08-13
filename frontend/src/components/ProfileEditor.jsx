import React, { useState } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

export default function ProfileEditor() {
  const [profile, setProfile] = useState({ university: '', programme: '', skills: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const skillsArray = profile.skills.split(',').map(s => s.trim());
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/profile`, 
        { ...profile, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile Saved! Go to home to see updated match scores.");
    } catch (err) { alert("Error updating profile"); }
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Student Profile</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <input placeholder="University" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setProfile({...profile, university: e.target.value})} />
        <input placeholder="Programme" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setProfile({...profile, programme: e.target.value})} />
        <textarea placeholder="Skills (React, CSS, Node...)" className="w-full p-4 bg-slate-50 border rounded-2xl h-32" onChange={(e) => setProfile({...profile, skills: e.target.value})} />
        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"><Save size={20}/> Update Matching Profile</button>
      </form>
    </div>
  );
}