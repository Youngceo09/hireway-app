import React, { useState } from 'react';
import axios from 'axios';
import { Save, GraduationCap, BookOpen, Cpu, Map } from 'lucide-react';

export default function ProfileEditor() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    university: '',
    programme: '',
    skills: '', 
    locationPreference: ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const skillsArray = profile.skills.split(',').map(s => s.trim());
      
      await axios.put('http://localhost:5000/api/auth/profile', 
        { ...profile, skills: skillsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Profile Updated Successfully!");
      window.location.reload(); 
    } catch (err) {
      alert("Error updating profile. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <GraduationCap className="text-blue-600" /> Academic Profile
      </h2>
      
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">University</label>
            <input type="text" placeholder="e.g. KNUST" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500"
                onChange={(e) => setProfile({...profile, university: e.target.value})} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Programme</label>
            <input type="text" placeholder="e.g. Computer Science" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500"
                onChange={(e) => setProfile({...profile, programme: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Skills (Separate with commas)</label>
          <textarea placeholder="e.g. React, JavaScript, Node.js" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 h-32"
            onChange={(e) => setProfile({...profile, skills: e.target.value})} />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <Save size={20} /> {loading ? "Saving..." : "Update Smart Profile"}
        </button>
      </form>
    </div>
  );
}