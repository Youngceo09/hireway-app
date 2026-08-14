const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');
const calculateMatch = require('../utils/matchEngine');
const User = require('../models/User');

// POST A JOB - Ensures employerId is linked
router.post('/post', auth, async (req, res) => {
    try {
        if (req.user.role !== 'employer') return res.status(403).json({ message: "Only employers can post" });

        const newJob = new Job({
            ...req.body,
            employerId: req.user.id // This links the job to the person logged in
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET MATCHED JOBS
router.get('/match', auth, async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        const jobs = await Job.find();
        const jobsWithScores = jobs.map(job => {
            const score = calculateMatch(student, job);
            return { ...job._doc, matchScore: score };
        });
        res.json(jobsWithScores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;