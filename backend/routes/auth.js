const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Create and assign a token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
// --- ADD THIS TO THE BOTTOM OF backend/routes/auth.js ---
const auth = require('../middleware/authMiddleware');

router.put('/profile', auth, async (req, res) => {
    try {
        const { university, programme, skills, locationPreference } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    "studentProfile.university": university,
                    "studentProfile.programme": programme,
                    "studentProfile.skills": skills,
                    "studentProfile.locationPreference": locationPreference,
                    "studentProfile.profileProgress": 100 
                } 
            },
            { new: true }
        );

        res.json({ message: "Profile Updated!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// 1. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `https://hireway-app.vercel.app/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click here: ${resetUrl}`;

    try {
        await sendEmail({ email: user.email, subject: 'Password Reset', message });
        res.json({ message: "Email sent!" });
    } catch (err) {
        res.status(500).json({ message: "Email could not be sent" });
    }
});

// 2. RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password updated!" });
});