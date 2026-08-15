import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Mail, ChevronRight, Loader2, Check, X } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchApplicants();
  }, []);

  // FUNCTION TO UPDATE STATUS (Shortlist / Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Candidate successfully ${newStatus}!`);
      fetchApplicants(); // Refresh the list to show updated status
    } catch (err) {
      alert("Failed to update status. Make sure your backend logic is updated.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Job Applicants</h1>
      <p className="text-slate-500 mb-10">Review students who matched with your roles.</p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid gap-6">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
              
              {/* Student Info */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{app.studentId?.name || "Student"}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">{app.jobId?.title || "Role"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                      app.status === 'Shortlisted' ? 'bg-green-100 text-green-600' : 
                      app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Shortlist Button */}
                <button 
                  onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                  className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-100"
                  title="Shortlist Candidate"
                >
                  <Check size={20} />
                </button>

                {/* Reject Button */}
                <button 
                  onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                  className="p-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Reject Candidate"
                >
                  <X size={20} />
                </button>

                {/* View Profile Button */}
                <button 
                  onClick={() => navigate(`/student-profile/${app.studentId?._id}`)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 ml-2"
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