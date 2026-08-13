const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const calculateMatch = require('../utils/matchEngine');

// 1. Post a new Job (Employer Only)
router.post('/post', auth, async (req, res) => {
    try {
        const newJob = new Job({ 
            ...req.body, 
            employerId: req.user.id 
        });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get All Jobs with Smart Match Scores
router.get('/match', auth, async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        const jobs = await Job.find();

        const jobsWithScores = jobs.map(job => {
            const score = calculateMatch(student, job);
            return {
                ...job._doc,
                matchScore: score
            };
        });

        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
        res.json(jobsWithScores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // CRITICAL: Ensure this line exists!