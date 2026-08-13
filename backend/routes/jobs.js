const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const calculateMatch = require('../utils/matchEngine');

// 1. Post a new Job (Employer Only)
router.post('/post', auth, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: "Only employers can post jobs" });
        }
        const newJob = new Job({ ...req.body, employerId: req.user.id });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. THIS IS THE MISSING LINE: Get All Jobs with Smart Match Scores
router.get('/match', auth, async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        const jobs = await Job.find().sort({ createdAt: -1 });

        // Calculate scores for each job
        const jobsWithScores = jobs.map(job => {
            const score = calculateMatch(student, job);
            return {
                ...job._doc,
                matchScore: score
            };
        });

        // Sort: Highest match percentage first
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

        res.json(jobsWithScores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;