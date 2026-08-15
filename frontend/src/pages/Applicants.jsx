import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ChevronRight, Loader2, Check, X, AlertCircle, Send } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. Decision Modal States ---
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
    } catch (err) {
      console.error("Error fetching applicants");
    }
    setLoading(false);
  };

  useEffect(() => { fetchApplicants(); }, []);

  // --- 2. Trigger Confirmation ---
  const triggerDecision = (id, status, name) => {
    setActionData({ id, status, name });
    setShowConfirm(true);
  };

  // --- 3. Execute the Status Change ---
  const handleStatusUpdate = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/status/${actionData.id}`, 
        { status: actionData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowConfirm(false);
      fetchApplicants(); // Refresh list
    } catch (err) {
      alert("Error: Make sure your backend logic is live on Render.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 relative">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Manage Talent</h1>
      <p className="text-slate-500 mb-10">Review and take action on student applications.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid gap-6">
          {applicants.map(app => (
            <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
              
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-100">
                  {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{app.studentId?.name || "Student"}</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">{app.jobId?.title}</p>
                  <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    app.status === 'Shortlisted' ? 'bg-green-100 text-green-600' : 
                    app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Decision Buttons */}
                <button 
                  onClick={() => triggerDecision(app._id, 'Shortlisted', app.studentId.name)}
                  className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-100"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => triggerDecision(app._id, 'Rejected', app.studentId.name)}
                  className="p-3 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={() => navigate(`/student-profile/${app.studentId?._id}`)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition flex items-center gap-2 ml-2"
                >
                  Profile <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}

          {applicants.length === 0 && (
             <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed">
                <UserCheck className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">No applications found.</p>
             </div>
          )}
        </div>
      )}

      {/* --- DECISION CONFIRMATION MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isProcessing && setShowConfirm(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${actionData.status === 'Shortlisted' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {actionData.status === 'Shortlisted' ? <Check size={40} /> : <X size={40} />}
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-slate-500 font-medium mb-8">
              Do you want to <span className={actionData.status === 'Shortlisted' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{actionData.status}</span> <b>{actionData.name}</b>?
              An automated Gmail notification will be sent immediately.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleStatusUpdate}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-2 ${actionData.status === 'Shortlisted' ? 'bg-green-500 hover:bg-green-600 shadow-green-100' : 'bg-red-500 hover:bg-red-600 shadow-red-100'}`}
              >
                {isProcessing ? "Processing..." : `Confirm ${actionData.status}`}
                {!isProcessing && <Send size={18} />}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}