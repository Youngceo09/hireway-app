import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';
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
      } catch (err) { console.log("Login to see jobs") }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="pt-16 pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <h1 className="text-6xl font-black text-slate-900 leading-tight">
             Find your <span className="text-blue-600">Future.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600">HireWay connects students with roles that perfectly match their skills.</p>
        </div>
        <div className="lg:w-1/2">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800" className="rounded-3xl shadow-2xl border-8 border-white" alt="Students" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 -mt-12">
        <div className="bg-white p-4 rounded-3xl shadow-xl border flex gap-4">
          <Search className="text-slate-400 mt-3 ml-2" />
          <input placeholder="Search opportunities..." className="w-full outline-none font-bold text-slate-700" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-8 mt-24">
        {/* DYNAMIC TITLE */}
        <h2 className="text-3xl font-black text-slate-900 mb-10">
          {user?.role === 'employer' ? "Recent Job Postings" : "Smart Matches For You"}
        </h2>

        {loading ? <Loader2 className="animate-spin mx-auto text-blue-600" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>
    </div>
  );
}