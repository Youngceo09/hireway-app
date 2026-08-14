import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, Mail, Briefcase, ChevronRight, Loader2 } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the VITE_API_URL variable to talk to the live Render backend
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/employer-view`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
      <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Job Applicants</h1>
      <p className="text-slate-500 font-medium mb-10">Review students who matched with your published roles.</p>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
           <Loader2 className="animate-spin mb-4" size={40} />
           <p className="font-bold text-sm uppercase tracking-widest">Scanning candidates...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100 shrink-0">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{app.studentId?.name || "Student"}</h3>
                  <p className="text-blue-600 font-black text-xs uppercase tracking-tighter mb-2">Applied for: {app.jobId?.title}</p>
                  <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                     <span className="flex items-center gap-1"><Mail size={14}/> {app.studentId?.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="text-right hidden lg:block pr-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Top Skills</p>
                    <div className="flex gap-2">
                        {app.studentId?.studentProfile?.skills?.slice(0, 3).map((skill, i) => (
                           <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border">{skill}</span>
                        ))}
                    </div>
                 </div>
                 <button className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">
                    View Profile <ChevronRight size={18} />
                 </button>
              </div>
            </div>
          ))}

          {applicants.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
               <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <UserCheck size={40} />
               </div>
               <p className="text-slate-400 font-black text-lg">No applications received yet.</p>
               <p className="text-slate-400 text-sm mt-1">Make sure you have posted a job to see candidates here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}