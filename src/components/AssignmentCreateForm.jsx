import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'

export default function AssignmentCreateForm({ createdBy }) {
  const { createAssignment } = useData()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [driveLink, setDriveLink] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    createAssignment({ createdBy, title, description, driveLink })
    setTitle('')
    setDescription('')
    setDriveLink('')
  }

  const isDisabled = !title.trim()

  return (
    <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
      <input className="border p-2 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Drive Link" value={driveLink} onChange={e=>setDriveLink(e.target.value)} />
      <div className="md:col-span-3">
        <textarea className="w-full border p-2 rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="mt-2">
          <button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className={
              `${isDisabled ? 'bg-blue-200 text-blue-700 cursor-not-allowed' : 'bg-blue-600 text-white'} px-4 py-2 rounded`
            }
          >
            Create Assignment
          </button>
        </div>
      </div>
    </form>
  )
}
