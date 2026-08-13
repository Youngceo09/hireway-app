const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'employer'], default: 'student' },
  
  // Storage for Forgot Password logic
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  studentProfile: {
    university: String,
    programme: String,
    skills: [String],
    profileProgress: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);