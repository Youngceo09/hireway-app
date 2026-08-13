import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApps(res.data);
    };
    fetchApps();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-black text-slate-900 mb-8">My Applications</h1>
      <div className="space-y-4">
        {apps.map(app => (
          <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-slate-800">{app.jobId?.title}</h3>
              <p className="text-slate-500 text-sm">{app.jobId?.company}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase">
              <Clock size={14} /> {app.status}
            </div>
          </div>
        ))}
        {apps.length === 0 && <p className="text-slate-400">You haven't applied for any jobs yet.</p>}
      </div>
    </div>
  );
}