import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [error, setError] = useState(false);

  // EMERGENCY RESET: If the data is broken, this wipes it clean
  const handleReset = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  try {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-4xl font-black text-blue-600 mb-4">DASHBOARD ACTIVE</h1>
        
        {user ? (
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 w-full max-w-sm">
            <p className="text-slate-500 font-bold uppercase text-xs">Logged in as</p>
            <p className="text-2xl font-black text-slate-900">{user.name}</p>
            <p className="text-blue-600 font-bold mt-2">{user.role}</p>
            <button 
              onClick={() => window.location.href = "/"} 
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
            >
              Go to Home Page
            </button>
          </div>
        ) : (
          <div className="bg-red-50 p-8 rounded-3xl border border-red-100 w-full max-w-sm">
            <p className="text-red-600 font-bold">No User Found on Phone</p>
            <button onClick={handleReset} className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl font-bold">
              Fix & Go to Login
            </button>
          </div>
        )}

        <button onClick={handleReset} className="mt-10 text-slate-300 text-xs underline">
          Force System Reset
        </button>
      </div>
    );
  } catch (e) {
    // If the JSON is broken, show a recovery screen
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10">
        <p className="font-bold text-red-500">System Data Corrupted</p>
        <button onClick={handleReset} className="bg-blue-600 text-white px-8 py-2 rounded-full mt-4">
          Repair App
        </button>
      </div>
    );
  }
}