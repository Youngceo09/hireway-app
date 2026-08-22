import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Briefcase, MapPin, AlignLeft, Code, ArrowLeft } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '',
    type: 'Internship', workMode: 'Remote', requirements: '', targetedProgramme: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Convert comma-separated string to an array for the backend
      const reqArray = formData.requirements.split(',').map(s => s.trim());
      
      const apiBase = import.meta.env.VITE_API_URL || "https://hireway-app.onrender.com";

      await axios.post(`${apiBase}/api/jobs/post`, 
        { ...formData, requirements: reqArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("🎉 Job Published Successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Make sure you are logged in as an Employer."));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-bold mb-6 text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Dashboard
        </button>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">Post an Opportunity</h1>
        <p className="text-slate-500 mb-10 font-medium">Find the best student talent for your project.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="Job Title (e.g. UX Intern)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold"
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Company Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold"
              onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input required placeholder="Location (City)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold"
              onChange={(e) => setFormData({...formData, location: e.target.value})} />
             <select className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
             </select>
             <select className="p-4 bg-slate-50 border rounded-2xl outline-none font-bold" onChange={(e) => setFormData({...formData, workMode: e.target.value})}>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
             </select>
          </div>

          <textarea required placeholder="Detailed Job Description" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 h-32 font-bold"
            onChange={(e) => setFormData({...formData, description: e.target.value})} />

          <input required placeholder="Required Skills (Comma separated: React, Python, CSS)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold"
            onChange={(e) => setFormData({...formData, requirements: e.target.value})} />

          <input required placeholder="Targeted Academic Programme" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 font-bold"
            onChange={(e) => setFormData({...formData, targetedProgramme: e.target.value})} />

          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2 active:scale-95">
            <Send size={20} /> {loading ? "Publishing..." : "Post Job Now"}
          </button>
        </form>
      </div>
    </div>
  );
}