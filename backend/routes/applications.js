const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail'); // Ensure this file exists!

// 1. Student applies for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const existing = await Application.findOne({ jobId: req.params.jobId, studentId: req.user.id });
        if (existing) return res.status(400).json({ message: "Already applied" });
        const newApp = new Application({ jobId: req.params.jobId, studentId: req.user.id });
        await newApp.save();
        res.status(201).json({ message: "Success" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. THIS IS THE CRITICAL PART: Employer updates status and sends Gmail
router.put('/status/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; 
        
        // Find application and get student/job details for the email
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('studentId')
            .populate('jobId');

        if (!app) return res.status(404).json({ message: "Application not found" });

        // Try to send the email notification
        try {
            const message = `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Update on your Application</h2>
                    <p>Hello <b>${app.studentId.name}</b>,</p>
                    <p>The employer at <b>${app.jobId.company}</b> has updated your status for the <b>${app.jobId.title}</b> position to:</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; font-weight: bold; color: #1e40af; text-align: center; font-size: 20px;">
                        ${status}
                    </div>
                    <p style="margin-top: 20px;">Log in to HireWay to see more details.</p>
                </div>
            `;

            await sendEmail({
                email: app.studentId.email,
                subject: `Application Status: ${status}`,
                message
            });
        } catch (mailError) {
            console.log("Gmail failed, but status was updated in DB.");
        }

        res.json({ message: "Status updated successfully", app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Student sees their own apps
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
        const ids = jobs.map(j => j._id);
        const apps = await Application.find({ jobId: { $in: ids } }).populate('jobId').populate('studentId');
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;