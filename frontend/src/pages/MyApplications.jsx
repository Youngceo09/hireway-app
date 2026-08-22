import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApps(res.data);
      } catch (err) { console.log(err) }
    };
    fetchApps();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">My Applications</h1>
      <div className="space-y-4">
        {apps.map(app => (
          <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-xl">{app.jobId?.title || "Role Unavailable"}</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{app.jobId?.company || "Company"}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-600' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {app.status}
            </div>
          </div>
        ))}
        {apps.length === 0 && <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-400 font-bold">No applications found yet.</div>}
      </div>
    </div>
  );
}