import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X, Mail, Loader2, UserCircle } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/employer-view`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(res.data);
    } catch (err) {
      console.error("Error fetching applicants");
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplicants(); }, []);

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/status/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Success: Candidate is now ${status}`);
      fetchApplicants(); // This refreshes the list instantly
    } catch (err) {
      alert("Failed to update status. Check your connection.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Manage Applications</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="space-y-4">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {app.studentId?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{app.studentId?.name || "Student"}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase">{app.jobId?.title}</p>
                  <div className={`mt-1 inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    Current Status: {app.status}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS - CLEARLY VISIBLE NOW */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleStatus(app._id, 'Shortlisted')}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-100"
                >
                  <Check size={18} /> Shortlist
                </button>

                <button 
                  onClick={() => handleStatus(app._id, 'Rejected')}
                  className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                >
                  <X size={18} /> Reject
                </button>
              </div>

            </div>
          ))}

          {applicants.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">No students have applied yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}