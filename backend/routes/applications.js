const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');

// Student applies for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const existing = await Application.findOne({ jobId: req.params.jobId, studentId: req.user.id });
        if (existing) return res.status(400).json({ message: "Already applied" });
        const newApp = new Application({ jobId: req.params.jobId, studentId: req.user.id });
        await newApp.save();
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Student sees their own applications
router.get('/my-applications', auth, async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id }).populate('jobId');
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Employer sees everyone who applied to THEIR jobs
router.get('/employer-view', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user.id });
        const jobIds = jobs.map(j => j._id);
        const apps = await Application.find({ jobId: { $in: jobIds } }).populate('jobId').populate('studentId');
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;