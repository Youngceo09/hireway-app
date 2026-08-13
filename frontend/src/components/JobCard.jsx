import React from 'react';
import axios from 'axios';
import { MapPin, Briefcase, CheckCircle, Bookmark, Send } from 'lucide-react';

export default function JobCard({ job }) {
  // Get current user to check their role
  const user = JSON.parse(localStorage.getItem('user'));

  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Please login as a student to apply.");
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/apply/${job._id}`, 
        { coverLetter: "Interested in this position" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🚀 Application Sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 group relative">
      
      {/* ONLY SHOW MATCH SCORE IF USER IS A STUDENT */}
      {user?.role === 'student' && job.matchScore > 0 && (
        <div className="absolute top-8 right-8 flex items-center gap-1 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-black border border-green-100 uppercase">
          <CheckCircle size={14} />
          {job.matchScore}% Match
        </div>
      )}

      <div className="flex gap-5 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
          {job.company ? job.company.charAt(0) : 'H'}
        </div>
        <div className="pr-10">
          <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <MapPin size={16} className="text-blue-500" /> {job.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <Briefcase size={16} className="text-blue-500" /> {job.type}
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
        {user?.role === 'student' && (
          <button onClick={handleApply} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl">
             Apply Now
          </button>
        )}
        <button className="p-4 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
          <Bookmark size={22} />
        </button>
      </div>
    </div>
  );
}