import React from 'react';
import axios from 'axios';
import { MapPin, Briefcase, CheckCircle, Bookmark, DollarSign, Clock } from 'lucide-react';

export default function JobCard({ job }) {
  
  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Please login as a student to apply");
      
      await axios.post(`http://localhost:5000/api/applications/apply/${job._id}`, 
        { coverLetter: "Interested in this position" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🚀 Application Sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group relative">
      <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
        <CheckCircle size={14} />
        {job.matchScore}% Match
      </div>

      <div className="flex gap-4 mb-5">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
          {job.company ? job.company.charAt(0) : 'J'}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
          <p className="text-slate-500 font-medium text-sm">{job.company}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <MapPin size={16} /> {job.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Briefcase size={16} /> {job.type}
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-50 pt-5">
        <button 
          onClick={handleApply}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
        <button className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition">
          <Bookmark size={20} />
        </button>
      </div>
    </div>
  );
}