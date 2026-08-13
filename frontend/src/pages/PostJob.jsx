import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Code, GraduationCap, Send } from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Internship',
    requirements: '', targetedProgramme: '', deadline: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const reqArray = formData.requirements.split(',').map(s => s.trim());
      await axios.post('http://localhost:5000/api/jobs/post', 
        { ...formData, requirements: reqArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Job Posted!");
      navigate('/');
    } catch (err) {
      alert("Error: Make sure you are logged in as an Employer");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl font-black mb-6">Post a New Job</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Job Title" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input required placeholder="Company" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setFormData({...formData, company: e.target.value})} />
          <input required placeholder="Requirements (React, Node, etc)" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setFormData({...formData, requirements: e.target.value})} />
          <input required placeholder="Targeted Programme (e.g. Computer Science)" className="w-full p-4 bg-slate-50 rounded-2xl border" onChange={(e) => setFormData({...formData, targetedProgramme: e.target.value})} />
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <Send size={20} /> Post Job
          </button>
        </form>
      </div>
    </div>
  );
}