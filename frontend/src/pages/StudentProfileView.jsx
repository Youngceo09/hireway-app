// --- EMPLOYER VIEW: Get Student Profile by ID ---
router.get('/student/:id', auth, async (req, res) => {
    try {
        // Only employers should access full student profiles
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: "Access denied" });
        }

        const student = await User.findById(req.params.id).select('-password'); // Hide password
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});