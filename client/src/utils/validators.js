export function isKpuStudentEmail(email) {
    if (!email) return false;
    return email.toLowerCase().endsWith('@student.kpu.ca');
}
