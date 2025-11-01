  function removeAssignment(assignmentId) {
    setAssignments(prev => {
      const next = prev.filter(a => a.id !== assignmentId)
      try { localStorage.setItem('assignments', JSON.stringify(next)) } catch (e) {}
      return next
    })
    setSubmissions(prev => {
      const next = prev.filter(s => s.assignmentId !== assignmentId)
      try { localStorage.setItem('submissions', JSON.stringify(next)) } catch (e) {}
      return next
    })
  }
import React, { createContext, useContext, useEffect, useState } from 'react'
import { assignments as mockAssignments, submissions as mockSubmissions, users as mockUsers } from '../data/mockData'
import { v4 as uuidv4 } from 'uuid'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [assignments, setAssignments] = useState(() => {
    try {
      const raw = localStorage.getItem('assignments')
      return raw ? JSON.parse(raw) : mockAssignments
    } catch (e) {
      return mockAssignments
    }
  })

  const [submissions, setSubmissions] = useState(() => {
    try {
      const raw = localStorage.getItem('submissions')
      return raw ? JSON.parse(raw) : mockSubmissions
    } catch (e) {
      return mockSubmissions
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('assignments', JSON.stringify(assignments))
    } catch (e) {}
  }, [assignments])

  useEffect(() => {
    try {
      localStorage.setItem('submissions', JSON.stringify(submissions))
    } catch (e) {}
  }, [submissions])

  function createAssignment(newAssignment) {
    const a = { id: 'a_' + uuidv4().slice(0,8), ...newAssignment }
    setAssignments(prev => [a, ...prev])

    // create submission records for all students for this assignment
    const studentUsers = mockUsers.filter(u => u.role === 'student')
    const newSubs = studentUsers.map(s => ({ id: 's_' + uuidv4().slice(0,8), studentId: s.id, assignmentId: a.id, status: 'not-submitted' }))
    setSubmissions(prev => [...newSubs, ...prev])

    return a
  }

  function resetData() {
    setAssignments(mockAssignments)
    setSubmissions(mockSubmissions)
    try {
      localStorage.setItem('assignments', JSON.stringify(mockAssignments))
      localStorage.setItem('submissions', JSON.stringify(mockSubmissions))
    } catch (e) {}
  }

  function createSubmissionsForStudent(studentId) {
    if (!studentId) return
    setSubmissions(prev => {
      const existingKeys = new Set(prev.map(s => `${s.studentId}::${s.assignmentId}`))
      const toAdd = assignments
        .map(a => ({ id: 's_' + uuidv4().slice(0,8), studentId, assignmentId: a.id, status: 'not-submitted' }))
        .filter(s => !existingKeys.has(`${s.studentId}::${s.assignmentId}`))
      if (toAdd.length === 0) return prev
      const next = [...prev, ...toAdd]
      try { localStorage.setItem('submissions', JSON.stringify(next)) } catch (e) {}
      return next
    })
  }

  function deleteSubmissionsForStudent(studentId) {
    if (!studentId) return
    setSubmissions(prev => {
      const next = prev.filter(s => s.studentId !== studentId)
      try { localStorage.setItem('submissions', JSON.stringify(next)) } catch (e) {}
      return next
    })
  }

  function updateSubmissionStatus(submissionId, newStatus) {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: newStatus } : s))
  }

  function ensureSubmissionRecord(studentId, assignmentId) {
    const existing = submissions.find(s => s.studentId === studentId && s.assignmentId === assignmentId)
    if (existing) return existing
    const s = { id: 's_' + uuidv4().slice(0,8), studentId, assignmentId, status: 'not-submitted' }
    setSubmissions(prev => [s, ...prev])
    return s
  }

  return (
    <DataContext.Provider value={{ assignments, submissions, createAssignment, updateSubmissionStatus, ensureSubmissionRecord, resetData, createSubmissionsForStudent, deleteSubmissionsForStudent, removeAssignment }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
