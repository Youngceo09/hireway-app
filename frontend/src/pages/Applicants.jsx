import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Check, X, Loader2, ChevronRight } from 'lucide-react';

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
    } catch (err) { console.error("Fetch failed") }
    setLoading(false);
  };

  useEffect(() => { fetchApplicants(); }, []);

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applications/status/${id}`, 
        { status }, { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Candidate ${status}!`);
      fetchApplicants();
    } catch (err) { alert("Action failed") }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">Candidate List</h1>
      <div className="grid gap-6">
        {applicants.map(app => (
          <div key={app._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">{app.studentId?.name.charAt(0)}</div>
               <div>
                  <h3 className="text-xl font-bold">{app.studentId?.name}</h3>
                  <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{app.jobId?.title}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => handleStatus(app._id, 'Shortlisted')} className="bg-green-500 text-white p-3 rounded-xl shadow-lg shadow-green-100"><Check size={20}/></button>
               <button onClick={() => handleStatus(app._id, 'Rejected')} className="bg-white border border-red-100 text-red-500 p-3 rounded-xl"><X size={20}/></button>
               <button onClick={() => navigate(`/student-profile/${app.studentId._id}`)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">Profile <ChevronRight size={18}/></button>
            </div>
          </div>
        ))}
        {applicants.length === 0 && <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed text-slate-400 font-bold">No candidates to review.</div>}
      </div>
    </div>
  );
}