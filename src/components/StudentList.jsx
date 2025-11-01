import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

export default function StudentList({ onClose }) {
  const { users, addStudent, removeStudent, currentUser, setCurrentUserId } = useAuth()
  const { createSubmissionsForStudent, deleteSubmissionsForStudent } = useData()
  const students = users
    .filter(u => u.role === 'student')
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    const newUser = addStudent(name)
    if (newUser) {
      createSubmissionsForStudent(newUser.id)
      setNewName('')
      setShowAdd(false)
    }
  }

  function handleRemove(student) {
    if (!confirm(`Remove student ${student.name}? This will delete their submissions.`)) return
    const ok = removeStudent(student.id)
    if (ok) {
      deleteSubmissionsForStudent(student.id)
      // if removed student was currently selected, switch to first admin or first user
      if (currentUser?.id === student.id) {
        const admin = users.find(u => u.role === 'admin')
        setCurrentUserId(admin ? admin.id : (users[0] && users[0].id))
      }
    } else {
      alert('Failed to remove student')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Student List</h3>
          <div className="flex items-center space-x-2">
            {showAdd ? (
              <div className="flex items-center space-x-2">
                <input className="border p-1 rounded px-2" placeholder="Student name" value={newName} onChange={e=>setNewName(e.target.value)} />
                <button onClick={handleAdd} disabled={!newName.trim()} className={`px-3 py-1 rounded text-sm ${newName.trim() ? 'bg-green-600 text-white' : 'bg-green-200 text-green-800 cursor-not-allowed'}`}>Add</button>
                <button onClick={() => { setShowAdd(false); setNewName('') }} className="px-3 py-1 border rounded text-sm">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setShowAdd(true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Add Student</button>
            )}
            <button onClick={onClose} className="px-3 py-1 border rounded text-sm">Close</button>
          </div>
        </div>

        <div className="space-y-2">
          {students.length === 0 && <div className="text-sm text-gray-600">No students found.</div>}
          {students.map(s => (
            <div key={s.id} className="flex items-center justify-between border rounded p-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">{s.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.id}</div>
                </div>
              </div>

              <div className="relative">
                <button onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)} className="px-2 py-1 rounded hover:bg-gray-100">⋯</button>
                {openMenuId === s.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                    <button onClick={() => { setOpenMenuId(null); handleRemove(s) }} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600">Remove Student</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
