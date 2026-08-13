const calculateMatch = (student, job) => {
    let score = 20; // Base score so jobs always show up at least a little bit

    if (!student || !student.studentProfile || !job.requirements) return score;

    const studentSkills = student.studentProfile.skills || [];
    const jobReqs = job.requirements || [];

    if (jobReqs.length > 0) {
        // Match skills (Case Insensitive)
        const matchedSkills = jobReqs.filter(skill => 
            studentSkills.some(s => s.trim().toLowerCase() === skill.trim().toLowerCase())
        );
        
        // Skills are 40% of the total
        score += (matchedSkills.length / jobReqs.length) * 40;
    }

    // Programme Match (20%)
    if (student.studentProfile.programme && job.targetedProgramme) {
        if (student.studentProfile.programme.toLowerCase() === job.targetedProgramme.toLowerCase()) {
            score += 20;
        }
    }

    // Random variance for interest/experience (up to 20%)
    score += Math.floor(Math.random() * 20);

    return Math.min(Math.round(score), 100);
};

module.exports = calculateMatch;