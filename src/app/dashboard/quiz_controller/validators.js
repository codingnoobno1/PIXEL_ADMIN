// ./validators.js

export function isValidAssignment(assignment) {
  if (
    !assignment ||
    typeof assignment.batch !== 'string' ||
    typeof assignment.semester !== 'number' ||
    !Array.isArray(assignment.subjects)
  ) {
    return false;
  }

  // Optional: Further validation of subjects array items
  for (const subject of assignment.subjects) {
    if (typeof subject !== 'object' || typeof subject.subject !== 'string') {
      return false;
    }
    if (subject.quizzes && !Array.isArray(subject.quizzes)) {
      return false;
    }
  }

  return true;
}
