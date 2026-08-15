import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Sparkles, Compass } from 'lucide-react';
import JobCard from '../components/JobCard.jsx';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/match`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(res.data);
      } catch (err) { console.log("Login for smart match") }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden">
      {/* ABSTRACT DECORATIONS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-blue-100/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px] -z-10"></div>

      <header className="pt-20 pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100 shadow-sm">
            <Sparkles size={14} /> AI-Powered Match Engine
          </div>
          <h1 className="text-6xl lg:text-[5.5rem] font-black text-slate-900 leading-[0.95] tracking-tighter">
             Building <br />
             <span className="text-blue-600">Futures.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-500 font-medium max-w-md leading-relaxed">
            HireWay connects students with roles that perfectly align with their skills and academic background.
          </p>
        </div>
        <div className="lg:w-1/2 relative">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" className="rounded-[3.5rem] shadow-2xl border-[16px] border-white" alt="Team" />
        </div>
      </header>

      {/* FLOATING SEARCH */}
      <div className="max-w-4xl mx-auto px-8 -mt-16 relative z-20">
        <div className="bg-white p-3 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(37,99,235,0.15)] border border-white flex flex-col md:flex-row gap-2 transition-all hover:scale-[1.01]">
          <div className="flex-1 flex items-center gap-4 px-6 py-4">
            <Search className="text-blue-600" size={24} />
            <input placeholder="Search company, title, or skills (React, Python)..." 
              className="w-full outline-none font-bold text-slate-700 placeholder:text-slate-300 text-lg" 
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            Search
          </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-8 mt-28">
        <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {user?.role === 'employer' ? "Job Registry" : "Smart Matches"}
              </h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Personalized opportunities live from the cloud</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-400 shadow-sm">
                {filteredJobs.length} Positions Active
            </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center py-20 opacity-20"><Loader2 className="animate-spin mb-4" size={40} /><p className="font-black text-xs uppercase tracking-widest">Syncing with server...</p></div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><Compass size={40} className="text-slate-200" /></div>
            <p className="text-slate-400 font-black text-xl">No active listings match your profile</p>
            <p className="text-slate-400 text-sm mt-1">Try updating your skills in the dashboard.</p>
          </div>
        )}
      </section>
    </div>
  );
}