const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');

// 1. Student applies for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const existingApp = await Application.findOne({ 
            jobId: req.params.jobId, 
            studentId: req.user.id 
        });

        if (existingApp) return res.status(400).json({ message: "Already applied" });

        const newApp = new Application({
            jobId: req.params.jobId,
            studentId: req.user.id,
            status: 'Applied'
        });

        await newApp.save();
        res.status(201).json({ message: "Application sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Student View: See my own applications
router.get('/my-applications', auth, async (req, res) => {
    try {
        // We find applications by the student's ID and "populate" the Job info
        const apps = await Application.find({ studentId: req.user.id })
            .populate('jobId') 
            .sort({ appliedAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Employer View: See people who applied to MY jobs
router.get('/employer-view', auth, async (req, res) => {
    try {
        // Step A: Find all jobs posted by this employer
        const myJobs = await Job.find({ employerId: req.user.id });
        const myJobIds = myJobs.map(job => job._id);

        // Step B: Find applications that match those Job IDs
        const apps = await Application.find({ jobId: { $in: myJobIds } })
            .populate('jobId')
            .populate('studentId', 'name email studentProfile')
            .sort({ appliedAt: -1 });
        
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;