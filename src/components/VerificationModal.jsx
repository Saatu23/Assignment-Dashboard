import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'

export default function VerificationModal({ submission, onClose }) {
  const { updateSubmissionStatus } = useData()
  const [step, setStep] = useState(1)

  function confirm() {
    updateSubmissionStatus(submission.id, 'submitted')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white max-w-md w-full p-4 rounded shadow">
        {step === 1 ? (
          <div>
            <h3 className="text-lg font-medium">Have you submitted the assignment on the provided Drive link?</h3>
            <p className="text-sm text-gray-600 mt-2">Please make sure your file is accessible before confirming.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={onClose} className="px-2 sm:px-3 py-1 border rounded text-sm">Cancel</button>
              <button onClick={() => setStep(2)} className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-sm">Yes, I have submitted</button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium">This is a final confirmation. Are you sure?</h3>
            <p className="text-sm text-gray-600 mt-2">Confirming will mark this assignment as submitted.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={() => setStep(1)} className="px-2 sm:px-3 py-1 border rounded text-sm">Go Back</button>
              <button onClick={confirm} className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded text-sm">Confirm Submission</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
