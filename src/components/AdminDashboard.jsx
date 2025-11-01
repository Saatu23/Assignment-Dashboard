import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import AssignmentCreateForm from './AssignmentCreateForm'
import AssignmentList from './AssignmentList'

export default function AdminDashboard() {
  const { currentUser, users } = useAuth()
  const { assignments, submissions } = useData()
  const myAssignments = assignments.filter(a => a.createdBy === currentUser.id)

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium">Create New Assignment</h2>
        <AssignmentCreateForm createdBy={currentUser.id} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-medium mb-4">My Assignments</h2>
        <AssignmentList assignments={myAssignments} users={users} submissions={submissions} />
      </div>
    </div>
  )
}
