import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import AssignmentCard from './AssignmentCard'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const { assignments, submissions } = useData()

  // show only assignments that have a submission record for this student or all assignments (ensure record)
  const myAssignments = assignments.map(a => {
    const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === currentUser.id)
    return { ...a, submission: sub }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {myAssignments.map(a => (
        <AssignmentCard key={a.id} assignment={a} currentUser={currentUser} />
      ))}
    </div>
  )
}
