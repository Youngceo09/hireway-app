const calculateMatch = (student, job) => {
    let score = 0;

    // 1. Skills Match (40%)
    if (student.studentProfile.skills && job.requirements) {
        const matchedSkills = job.requirements.filter(skill => 
            student.studentProfile.skills.includes(skill)
        );
        const skillScore = (matchedSkills.length / job.requirements.length) * 40;
        score += skillScore || 0;
    }

    // 2. Programme Match (20%)
    if (student.studentProfile.programme === job.targetedProgramme) {
        score += 20;
    }

    // 3. Location Match (10%)
    if (student.studentProfile.locationPreference === job.location || job.workMode === 'Remote') {
        score += 10;
    }

    // 4. Random Variance for Experience/Goals (30%)
    // In a real app, this would compare years of experience.
    // For this version, we add a base score for profile completion.
    score += (student.studentProfile.profileProgress / 100) * 30;

    return Math.round(score);
};

module.exports = calculateMatch;