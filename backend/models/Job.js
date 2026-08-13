const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  type: { type: String, enum: ['Internship', 'Part-time', 'Full-time'], required: true },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-site'] },
  
  // Matching Criteria
  requirements: [String], // Array of skills needed
  targetedProgramme: String, // e.g. IT, Engineering
  
  salary: String,
  deadline: Date,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);