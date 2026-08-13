const calculateMatch = (user, job) => {
    // 1. If it's an employer, do not calculate a match score
    if (!user || user.role === 'employer') return 0;

    let score = 15; // Base score for students so jobs are visible

    if (!user.studentProfile || !job.requirements) return score;

    const studentSkills = user.studentProfile.skills || [];
    const jobReqs = job.requirements || [];

    // 2. Skill Matching (40% Weight) - Case Insensitive
    if (jobReqs.length > 0) {
        const matchedSkills = jobReqs.filter(skill => 
            studentSkills.some(s => s.trim().toLowerCase() === skill.trim().toLowerCase())
        );
        score += (matchedSkills.length / jobReqs.length) * 40;
    }

    // 3. Programme Match (20% Weight)
    if (user.studentProfile.programme && job.targetedProgramme) {
        if (user.studentProfile.programme.trim().toLowerCase() === job.targetedProgramme.trim().toLowerCase()) {
            score += 20;
        }
    }

    // 4. Random variance for interest (up to 25%)
    score += Math.floor(Math.random() * 25);

    return Math.min(Math.round(score), 100);
};

module.exports = calculateMatch;