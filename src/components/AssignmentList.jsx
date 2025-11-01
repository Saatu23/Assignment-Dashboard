import React, { useState } from 'react'
import AssignmentProgress from './AssignmentProgress'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'

export default function AssignmentList({ assignments, users, submissions }) {
  const [selected, setSelected] = useState(null)
  const { removeAssignment } = useData()
  const { currentUser } = useAuth()

  function handleRemove(id) {
    if (window.confirm('Are you sure you want to remove this assignment?')) {
      removeAssignment(id)
    }
  }

  return (
    <div>
      {assignments.length === 0 && <div className="text-sm text-gray-600">No assignments yet.</div>}
      <ul className="space-y-3">
        {assignments.map(a => (
          <li key={a.id} className="border p-3 rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-600">{a.description}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setSelected(selected === a.id ? null : a.id)} className="text-sm text-blue-600 underline">View Progress</button>
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleRemove(a.id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                  title="Remove Assignment"
                >Remove</button>
              )}
            </div>
            {selected === a.id && (
              <div className="w-full mt-3">
                <AssignmentProgress assignment={a} users={users} submissions={submissions} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
