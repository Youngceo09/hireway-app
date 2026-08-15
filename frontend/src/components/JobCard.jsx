import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Briefcase, CheckCircle, Bookmark, Send, AlertCircle, Sparkles } from 'lucide-react';

export default function JobCard({ job }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const [showConfirm, setShowConfirm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const executeApply = async () => {
    setIsApplying(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications/apply/${job._id}`, 
        { coverLetter: "Apply via HireWay" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🚀 Application Sent Successfully!");
      setShowConfirm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error applying");
      setShowConfirm(false);
    } finally { setIsApplying(false); }
  };

  return (
    <>
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {user?.role === 'student' && job.matchScore > 0 && (
          <div className="absolute top-8 right-8 flex items-center gap-1 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black border border-green-100 uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            {job.matchScore}% Match
          </div>
        )}

        <div className="flex gap-5 mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {job.company ? job.company.charAt(0) : 'H'}
          </div>
          <div className="pr-10">
            <h3 className="font-black text-xl text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{job.title}</h3>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-1">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 uppercase tracking-tighter">
            <MapPin size={14} className="text-blue-500" /> {job.location}
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 uppercase tracking-tighter">
            <Briefcase size={14} className="text-blue-500" /> {job.type}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-slate-50 pt-8">
          {user?.role === 'student' && (
            <button onClick={() => setShowConfirm(true)} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100">
               Apply Now
            </button>
          )}
          <button className="p-4 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
            <Bookmark size={22} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40">
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Application</h3>
              <p className="text-slate-500 font-medium mb-8 text-sm leading-relaxed">
                Apply for the <span className="text-blue-600 font-bold">{job.title}</span> position at <span className="text-blue-600 font-bold">{job.company}</span>?
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={executeApply} disabled={isApplying} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all">
                  {isApplying ? "Sending..." : "Yes, Submit Application"}
                  {!isApplying && <Send size={18} />}
                </button>
                <button onClick={() => setShowConfirm(false)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}