function isAlumni(admissionNumber) {
    const currentDate = new Date();
    const academicYear = currentDate.getMonth() >= 6 ? 
        currentDate.getFullYear() : 
        currentDate.getFullYear() - 1;

    // Extract admission year from admission number (e.g., U20CS -> 2020, I19CS -> 2019)
    const admissionYear = 2000 + parseInt(admissionNumber.substring(1, 3));
    const programType = admissionNumber.charAt(0);

    // Calculate years since admission
    const yearsSinceAdmission = academicYear - admissionYear;

    // Check if student has completed their program
    // U: 4 years program
    // I: 5 years program
    return (programType === 'U' && yearsSinceAdmission >= 4) || 
           (programType === 'I' && yearsSinceAdmission >= 5);
}

module.exports = { isAlumni };
