import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, Mail, Briefcase, ChevronRight } from 'lucide-react';

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/applications/employer-view', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplicants(res.data);
      } catch (err) {
        console.error("Error fetching applicants", err);
      }
    };
    fetchApplicants();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-black text-slate-900 mb-2">Job Applicants</h1>
      <p className="text-slate-500 font-medium mb-10">Review students who matched with your opportunities.</p>

      <div className="grid gap-6">
        {applicants.map(app => (
          <div key={app._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                {app.studentId?.name ? app.studentId.name.charAt(0) : 'S'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{app.studentId?.name}</h3>
                <p className="text-blue-600 font-bold text-sm mb-1">{app.jobId?.title}</p>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                   <span className="flex items-center gap-1"><Mail size={14}/> {app.studentId?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition flex items-center gap-2">
                  View Profile <ChevronRight size={18} />
               </button>
            </div>
          </div>
        ))}

        {applicants.length === 0 && (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
             <UserCheck size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold">No applications received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}