import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import VerificationModal from './VerificationModal'

export default function AssignmentCard({ assignment, currentUser }) {
  const { submissions, ensureSubmissionRecord } = useData()
  const [showModal, setShowModal] = useState(false)

  const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser.id)
  const effectiveSubmission = submission || ensureSubmissionRecord(currentUser.id, assignment.id)
  const isSubmitted = effectiveSubmission?.status === 'submitted'

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-lg">{assignment.title}</div>
          <div className="text-sm text-gray-600">{assignment.description}</div>
        </div>
        <div className="text-sm text-gray-500">{isSubmitted ? <span className="text-green-600 font-semibold">Submitted</span> : <span className="text-red-500">Not Submitted</span>}</div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <a href={assignment.driveLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open Drive Link</a>
        {!isSubmitted && <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>}
      </div>

      {showModal && (
        <VerificationModal submission={effectiveSubmission} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
