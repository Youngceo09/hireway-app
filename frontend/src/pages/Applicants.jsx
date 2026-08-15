import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ChevronRight, Loader2, Check, X, AlertCircle, Send } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showModal, setShowConfirm] = useState(false);
  const [actionData, setActionData] = useState({ id: null, status: '', name: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/employer-view`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplicants(res.data);
    } catch (err) { console.error("Error fetching applicants") }
    setLoading(false);
  };

  useEffect(() => { fetchApplicants(); }, []);

  const triggerDecision = (id, status, name) => {
    setActionData({ id, status, name });
    setShowConfirm(true);
  };

  const handleStatusUpdate = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/status/${actionData.id}`, 
        { status: actionData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowConfirm(false);
      fetchApplicants();
    } catch (err) { alert("Update failed"); }
    finally { setIsProcessing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-10 relative">
      <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">Applicants</h1>
      <p className="text-slate-500 mb-8 text-sm lg:text-base font-medium">Review and manage student applications.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid gap-4">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-5 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
              
              {/* STUDENT INFO SECTION */}
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl lg:text-2xl font-black shrink-0 shadow-lg shadow-blue-100">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{app.studentId?.name || "Student"}</h3>
                  <p className="text-blue-600 text-xs font-black uppercase truncate tracking-tight">{app.jobId?.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                      Status: {app.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS SECTION (Always visible, stacks on mobile) */}
              <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                
                {/* Shortlist Button */}
                <button 
                  onClick={() => triggerDecision(app._id, 'Shortlisted', app.studentId.name)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl font-bold text-xs lg:text-sm hover:bg-green-600 transition shadow-lg shadow-green-100"
                >
                  <Check size={18} /> <span className="md:hidden">Shortlist</span>
                </button>

                {/* Reject Button */}
                <button 
                  onClick={() => triggerDecision(app._id, 'Rejected', app.studentId.name)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-3 rounded-xl font-bold text-xs lg:text-sm hover:bg-red-50 transition"
                >
                  <X size={18} /> <span className="md:hidden">Reject</span>
                </button>

                {/* Profile Link */}
                <button 
                  onClick={() => navigate(`/student-profile/${app.studentId?._id}`)}
                  className="p-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}

          {applicants.length === 0 && (
             <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed">
                <UserCheck className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-slate-400 font-bold">No active candidates.</p>
             </div>
          )}
        </div>
      )}

      {/* DECISION MODAL (Optimized for Mobile) */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isProcessing && setShowConfirm(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 lg:p-10 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 text-center">
            <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Decision</h3>
            <p className="text-slate-500 text-sm mb-8">
              Move <b>{actionData.name}</b> to <span className={actionData.status === 'Shortlisted' ? 'text-green-600' : 'text-red-600'}>{actionData.status}</span>?
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleStatusUpdate}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2 ${actionData.status === 'Shortlisted' ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {isProcessing ? "Processing..." : `Confirm ${actionData.status}`}
              </button>
              <button onClick={() => setShowConfirm(false)} className="w-full py-3 text-slate-400 font-bold text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}