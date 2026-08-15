const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// 1. STUDENT: Apply or Re-apply for a job
router.post('/apply/:jobId', auth, async (req, res) => {
    try {
        const existingApp = await Application.findOne({ 
            jobId: req.params.jobId, 
            studentId: req.user.id 
        });

        if (existingApp) {
            // IF THE STUDENT WAS PREVIOUSLY REJECTED, ALLOW THEM TO RE-APPLY
            if (existingApp.status === 'Rejected') {
                existingApp.status = 'Applied';
                existingApp.appliedAt = Date.now(); // Reset the time to now
                await existingApp.save();
                return res.status(201).json({ message: "Re-applied successfully! The employer will see your fresh application." });
            } else {
                // BLOCK IF THEY ARE ALREADY IN THE PIPELINE (Applied, Shortlisted, etc.)
                return res.status(400).json({ message: "You already have an active application for this job." });
            }
        }

        // FRESH APPLICATION (First time)
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

// 2. STUDENT VIEW: See all my applications
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

// 3. EMPLOYER VIEW: See active candidates ONLY (Hides Rejected)
router.get('/employer-view', auth, async (req, res) => {
    try {
        if (req.user.role !== 'employer') return res.status(403).json({ message: "Access denied." });

        const myJobs = await Job.find({ employerId: req.user.id });
        const myJobIds = myJobs.map(job => job._id);

        const apps = await Application.find({ 
            jobId: { $in: myJobIds },
            status: { $ne: 'Rejected' } 
        })
        .populate('jobId')
        .populate('studentId', 'name email studentProfile')
        .sort({ appliedAt: -1 });
        
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. EMPLOYER ACTION: Update Status & Send Gmail
router.put('/status/:id', auth, async (req, res) => {
    try {
        const { status } = req.body; 
        
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('studentId').populate('jobId');

        if (!app) return res.status(404).json({ message: "Application not found" });

        const message = `
            <div style="font-family: sans-serif; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0;">
                <h2 style="color: #2563eb;">HireWay Application Update</h2>
                <p>Hello <b>${app.studentId.name}</b>,</p>
                <p>The employer for <b>${app.jobId.title}</b> at <b>${app.jobId.company}</b> has updated your status to:</p>
                <div style="background: #eff6ff; color: #1e40af; padding: 20px; text-align: center; border-radius: 10px; font-size: 24px; font-weight: bold; margin: 20px 0;">
                    ${status}
                </div>
                <p>Please log in to your dashboard for details.</p>
            </div>
        `;

        try {
            await sendEmail({ email: app.studentId.email, subject: `HireWay: Your application is ${status}`, message });
        } catch (mailErr) { console.log("Mail failed") }

        res.json({ message: "Status updated.", app });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;