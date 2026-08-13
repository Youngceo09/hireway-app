const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const auth = require('../middleware/authMiddleware');

// 1. REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. UPDATE PROFILE
router.put('/profile', auth, async (req, res) => {
    try {
        const { university, programme, skills } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id,
            { $set: { "studentProfile.university": university, "studentProfile.programme": programme, "studentProfile.skills": skills, "studentProfile.profileProgress": 100 } },
            { new: true }
        );
        res.json({ message: "Profile Updated!", user: updatedUser });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `https://hireway-app.vercel.app/reset-password/${resetToken}`;
    const message = `<h1>Reset Password</h1><p>Click below to reset:</p><a href="${resetUrl}">${resetUrl}</a>`;

    await sendEmail({ email: user.email, subject: 'HireWay Password Reset', message });
    res.json({ message: "Reset link sent to Gmail!" });
  } catch (err) { res.status(500).json({ error: "Email failed" }); }
});

// 5. RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Invalid/Expired link" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: "Success!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;