const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// 1. STUDENT: Apply for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const existingApp = await Application.findOne({ 
            jobId: req.params.jobId, 
            studentId: req.user.id 
        });

        if (existingApp) return res.status(400).json({ message: "You have already applied for this job." });

        const newApp = new Application({
            jobId: req.params.jobId,
            studentId: req.user.id,
            status: 'Applied'
        });

        await newApp.save();
        res.status(201).json({ message: "Application submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. STUDENT VIEW: See all my applications (Shows everything including Rejected)
router.get('/my-applications', auth, async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id })
            .populate('jobId')
            .sort({ appliedAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. EMPLOYER VIEW: See active candidates ONLY
// This route now FILTERS OUT students who have been Rejected
router.get('/employer-view', auth, async (req, res) => {
    try {
        if (req.user.role !== 'employer') return res.status(403).json({ message: "Access denied." });

        // Step A: Find all jobs posted by this employer
        const myJobs = await Job.find({ employerId: req.user.id });
        const myJobIds = myJobs.map(job => job._id);

        // Step B: Find applications that are NOT "Rejected"
        const apps = await Application.find({ 
            jobId: { $in: myJobIds },
            status: { $ne: 'Rejected' } // $ne means "Not Equal"
        })
        .populate('jobId')
        .populate('studentId', 'name email studentProfile')
        .sort({ appliedAt: -1 });
        
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. EMPLOYER ACTION: Update Status & Send Real-time Gmail
router.put('/status/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; 
        
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('studentId')
            .populate('jobId');

        if (!app) return res.status(404).json({ message: "Application not found" });

        // Send Email Notification
        const message = `
            <div style="font-family: sans-serif; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0;">
                <h2 style="color: #2563eb;">HireWay Application Update</h2>
                <p>Hello <b>${app.studentId.name}</b>,</p>
                <p>Your application status for <b>${app.jobId.title}</b> at <b>${app.jobId.company}</b> has been updated to:</p>
                <div style="background: #eff6ff; color: #1e40af; padding: 20px; text-align: center; border-radius: 10px; font-size: 24px; font-weight: bold; margin: 20px 0;">
                    ${status}
                </div>
                <p>Please log in to your dashboard for further instructions.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94a3b8;">This is an automated notification from the HireWay Match Engine.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: app.studentId.email,
                subject: `HireWay: Your application is ${status}`,
                message
            });
        } catch (mailErr) {
            console.log("Email failed, but database was updated.");
        }

        res.json({ message: "Status updated and student notified.", app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;