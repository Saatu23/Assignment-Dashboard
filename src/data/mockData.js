export const users = [
  { id: 'u1', name: 'Dr. Harry Potter', role: 'admin' },
  { id: 'u2', name: 'Satyam', role: 'student' },
  { id: 'u3', name: 'Shivam', role: 'student' },
]

export const assignments = [
  { id: 'a1', createdBy: 'u1', title: 'Fossil Identification 101', description: 'Complete the fossil ID worksheet.', driveLink: 'http://drive.google.com/...' },
  { id: 'a2', createdBy: 'u1', title: 'Raptor Containment Theory', description: 'Write a 5-page essay.', driveLink: 'http://drive.google.com/...' },
]

// This table links students and assignments
export const submissions = [
  { id: 's1', studentId: 'u2', assignmentId: 'a1', status: 'submitted' },
  { id: 's2', studentId: 'u2', assignmentId: 'a2', status: 'not-submitted' },
  { id: 's3', studentId: 'u3', assignmentId: 'a1', status: 'not-submitted' },
  { id: 's4', studentId: 'u3', assignmentId: 'a2', status: 'not-submitted' },
]
