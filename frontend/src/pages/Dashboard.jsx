import React from 'react';

export default function Dashboard() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#2563eb', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      itemsCenter: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '40px', fontWeight: '900' }}>DASHBOARD LOADED</h1>
      <p style={{ marginTop: '20px', fontSize: '18px' }}>
        If you see this BLUE screen on your phone, the error is FIXED.
      </p>
      <button 
        onClick={() => window.location.href = "/"}
        style={{ marginTop: '30px', padding: '15px 30px', backgroundColor: 'white', color: '#2563eb', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}
      >
        GO TO HOME
      </button>
    </div>
  );
}