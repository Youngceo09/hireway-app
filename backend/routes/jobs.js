const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');

// Post a new Job
router.post('/post', auth, async (req, res) => {
    try {
        // 1. Double check the role
        if (req.user.role !== 'employer') {
            return res.status(403).json({ 
                message: `Denied: You are logged in as a '${req.user.role}'. Only employers can post.` 
            });
        }

        // 2. Create the job with all fields from the model
        const { title, company, location, description, type, workMode, requirements, targetedProgramme, deadline } = req.body;

        const newJob = new Job({
            employerId: req.user.id,
            title,
            company,
            location: location || "Remote",
            description,
            type: type || "Internship",
            workMode: workMode || "Remote",
            requirements: requirements || [],
            targetedProgramme,
            deadline: deadline || new Date(Date.now() + 30*24*60*60*1000) // Default 30 days
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (err) {
        console.error("Post Job Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;