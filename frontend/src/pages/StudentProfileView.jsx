import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, GraduationCap, Mail, CheckCircle, User } from 'lucide-react';

export default function StudentProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/student/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStudent();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-blue-600 transition">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-10 text-white flex items-center gap-8">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-3xl font-black">
            {student?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black">{student?.name}</h1>
            <p className="text-blue-400 font-bold flex items-center gap-2 mt-1">
              <Mail size={16} /> {student?.email}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          <div>
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase">University</p>
                  <p className="text-lg font-bold text-slate-800">{student?.studentProfile?.university || "Not provided"}</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase">Programme</p>
                  <p className="text-lg font-bold text-slate-800">{student?.studentProfile?.programme || "Not provided"}</p>
               </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {student?.studentProfile?.skills?.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-green-50 text-green-600 border border-green-100 rounded-xl font-bold text-sm flex items-center gap-2">
                  <CheckCircle size={14} /> {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}