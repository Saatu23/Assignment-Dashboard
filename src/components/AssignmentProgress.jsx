import React from 'react'
import { useData } from '../contexts/DataContext'

export default function AssignmentProgress({ assignment, users, submissions }) {
  const { ensureSubmissionRecord } = useData()
  const studentUsers = users.filter(u => u.role === 'student')

  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="text-sm text-gray-700 mb-2">Progress for: <strong>{assignment.title}</strong></div>
      <ul className="space-y-3">
        {studentUsers.map(s => {
          const sub = submissions.find(x => x.assignmentId === assignment.id && x.studentId === s.id) || ensureSubmissionRecord(s.id, assignment.id)
          const isSubmitted = sub?.status === 'submitted'
          return (
            <li key={s.id} className="flex items-center justify-between">
              <div className="w-1/3">{s.name}</div>
              <div className="flex-1 ml-4 mr-4">
                <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
                  <div style={{ width: isSubmitted ? '100%' : '5%' }} className={"h-4 " + (isSubmitted ? 'bg-green-500' : 'bg-red-400')}></div>
                </div>
              </div>
              <div className="w-24 text-right text-sm font-medium">{isSubmitted ? 'Submitted' : 'Not Submitted'}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
