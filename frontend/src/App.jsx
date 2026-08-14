import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PostJob from './pages/PostJob.jsx';
import MyApplications from './pages/MyApplications.jsx';
import Applicants from './pages/Applicants.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import StudentProfileView from './pages/StudentProfileView.jsx'; // Make sure this matches

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/manage-applicants" element={<Applicants />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/student-profile/:id" element={<StudentProfileView />} />
        </Routes>
      </div>
    </Router>
  );
}