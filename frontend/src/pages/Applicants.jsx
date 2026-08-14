import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Mail, ChevronRight, Loader2, Award } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
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
      <h1 className="text-4xl font-black text-slate-900 mb-2">Job Applicants</h1>
      <p className="text-slate-500 mb-10">Review students who matched with your roles.</p>

      {loading ? (
        <Loader2 className="animate-spin mx-auto text-blue-600" size={40} />
      ) : (
        <div className="grid gap-6">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : '?'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{app.studentId?.name || "Unknown Student"}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase">{app.jobId?.title || "Deleted Job"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</p>
                  <p className="text-sm font-bold text-slate-600">{app.status}</p>
                </div>
                {/* 1. BUTTON TO VIEW FULL PROFILE */}
                <button 
                  onClick={() => navigate(`/student-profile/${app.studentId?._id}`)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  View Profile <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}

          {applicants.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
               <UserCheck className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="text-slate-400 font-bold">No applications yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}