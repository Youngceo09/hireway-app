import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, FileText, MapPin, info } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '', 
    company: '', 
    location: '', 
    type: 'Internship', // Required by your model
    workMode: 'Remote', // Required by your model
    description: '',    // Required by your model
    requirements: '', 
    targetedProgramme: '', 
    deadline: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Convert requirements string to array
      const reqArray = formData.requirements.split(',').map(s => s.trim());
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/jobs/post`, 
        { ...formData, requirements: reqArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("🎉 Job Posted Successfully!");
      navigate('/');
    } catch (err) {
      // DEBUG: This will show the REAL error from the backend in your alert
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Error posting job";
      alert("Backend says: " + errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black mb-6 text-slate-900">Post a New Job</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Job Title" className="p-4 bg-slate-50 rounded-2xl border outline-none focus:border-blue-500" 
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Company" className="p-4 bg-slate-50 rounded-2xl border outline-none focus:border-blue-500" 
              onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>

          {/* Row 2: Location & Work Mode */}
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Location (e.g. Accra)" className="p-4 bg-slate-50 rounded-2xl border outline-none focus:border-blue-500" 
              onChange={(e) => setFormData({...formData, location: e.target.value})} />
            <select className="p-4 bg-slate-50 rounded-2xl border outline-none" 
              onChange={(e) => setFormData({...formData, workMode: e.target.value})}>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Description */}
          <textarea required placeholder="Job Description - What is this role about?" className="p-4 bg-slate-50 rounded-2xl border h-32 outline-none focus:border-blue-500" 
            onChange={(e) => setFormData({...formData, description: e.target.value})} />
          
          {/* Requirements & Programme */}
          <input required placeholder="Requirements (React, Node, etc. - separate with commas)" className="p-4 bg-slate-50 rounded-2xl border outline-none" 
            onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
          
          <input required placeholder="Targeted Programme (e.g. Computer Science)" className="p-4 bg-slate-50 rounded-2xl border outline-none" 
            onChange={(e) => setFormData({...formData, targetedProgramme: e.target.value})} />

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <Send size={20} /> Publish Job
          </button>
        </form>
      </div>
    </div>
  );
}