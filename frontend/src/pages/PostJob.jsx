import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Briefcase, MapPin, AlignLeft, Code } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '',
    type: 'Internship', workMode: 'Remote', requirements: '', targetedProgramme: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Convert requirements string to array
      const reqArray = formData.requirements.split(',').map(s => s.trim());
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/post`, 
        { ...formData, requirements: reqArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("🚀 Job Published Successfully!");
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || "Check your account role or form fields.";
      alert("Error: " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Create Opportunity</h1>
        <p className="text-slate-500 mb-10 font-medium">Fill in all details to find the best student matches.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="Job Title" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Company Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <input required placeholder="Location (e.g. Kumasi)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500"
              onChange={(e) => setFormData({...formData, location: e.target.value})} />
             <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Full-time">Full-time</option>
             </select>
             <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, workMode: e.target.value})}>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
             </select>
          </div>

          <textarea required placeholder="Detailed Job Description" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 h-32"
            onChange={(e) => setFormData({...formData, description: e.target.value})} />

          <input required placeholder="Skills Required (e.g. React, Python, CSS)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, requirements: e.target.value})} />

          <input required placeholder="Targeted Programme (e.g. Computer Engineering)" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setFormData({...formData, targetedProgramme: e.target.value})} />

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-2">
            <Send size={20} /> Publish Job Now
          </button>
        </form>
      </div>
    </div>
  );
}