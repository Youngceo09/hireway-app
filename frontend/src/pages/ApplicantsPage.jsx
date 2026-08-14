import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Mail, Briefcase, ChevronRight, Loader2, Award } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch real applicants from your Render backend
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/employer-view`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      }
      setLoading(false);
    };
    fetchApplicants();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Candidate Pool</h1>
        <p className="text-slate-500 font-medium">Review students who have applied to your published roles.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
           <Loader2 className="animate-spin mb-4" size={40} />
           <p className="font-bold text-sm uppercase tracking-widest">Scanning candidates...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all duration-300 group">
              
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Profile Initial Circle */}
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100 shrink-0 transform group-hover:scale-105 transition-transform">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{app.studentId?.name || "Student"}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-tighter bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      Target: {app.jobId?.title}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                      <Mail size={14}/> {app.studentId?.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                 <div className="text-right hidden lg:block pr-4 border-r border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 flex items-center justify-end gap-1">
                      <Award size={12} /> Candidate Skills
                    </p>
                    <div className="flex gap-2 justify-end">
                        {app.studentId?.studentProfile?.skills?.slice(0, 2).map((skill, i) => (
                           <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border">{skill}</span>
                        ))}
                        {app.studentId?.studentProfile?.skills?.length > 2 && (
                          <span className="text-[10px] font-bold text-slate-300 px-1 py-1">+{app.studentId.studentProfile.skills.length - 2} more</span>
                        )}
                    </div>
                 </div>
                 
                 {/* VIEW PROFILE BUTTON: Now links to the StudentProfileView page */}
                 <button 
                   onClick={() => navigate(`/student-profile/${app.studentId._id}`)}
                   className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-200"
                 >
                    View Full Profile <ChevronRight size={18} />
                 </button>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {applicants.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
               <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <UserCheck size={48} />
               </div>
               <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Awaiting Applicants</h3>
               <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Once students apply to your jobs, their matching profiles will appear here for review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}