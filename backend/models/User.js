const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'employer', 'admin'], default: 'student' },
  
  // Fields for Students
  studentProfile: {
    university: String,
    programme: String, // e.g., Computer Science
    academicLevel: String, // e.g., Level 300
    skills: [String], // e.g., ["React", "Node.js"]
    experience: String,
    locationPreference: String,
    resumeUrl: String,
    bio: String,
    profileProgress: { type: Number, default: 0 }
  },

  // Fields for Employers
  employerProfile: {
    companyName: String,
    industry: String,
    website: String,
    location: String,
    description: String
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
resetPasswordToken: String,
resetPasswordExpire: Date