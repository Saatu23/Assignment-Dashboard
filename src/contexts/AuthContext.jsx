import React, { createContext, useContext, useEffect, useState } from 'react'
import { users as mockUsers } from '../data/mockData'
import { v4 as uuidv4 } from 'uuid'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem('users')
      return raw ? JSON.parse(raw) : mockUsers
    } catch (e) {
      return mockUsers
    }
  })

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem('currentUserId') || users[0].id
    } catch (e) {
      return users[0].id
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('currentUserId', currentUserId)
    } catch (e) {}
  }, [currentUserId])

  useEffect(() => {
    try {
      localStorage.setItem('users', JSON.stringify(users))
    } catch (e) {}
  }, [users])

  const currentUser = users.find(u => u.id === currentUserId)

  function addStudent(name) {
    if (!name || !name.trim()) return null
    const newUser = { id: 'u_' + uuidv4().slice(0,8), name: name.trim(), role: 'student' }
    setUsers(prev => [...prev, newUser])
    return newUser
  }

  function removeStudent(studentId) {
    if (!studentId) return false
    setUsers(prev => prev.filter(u => u.id !== studentId))
    try {
      // also remove any lock for that user if present
      localStorage.removeItem(`lock_${studentId}`)
    } catch (e) {}
    return true
  }

  // Profile lock helpers
  const lockKey = (userId) => `lock_${userId}`

  function lockProfile(userId, pin) {
    if (!pin) return;
    try {
      const encoded = btoa(pin);
      localStorage.setItem(lockKey(userId), encoded);
      return true;
    } catch {
      return false;
    }
  }

  function isLocked(userId) {
    return !!localStorage.getItem(lockKey(userId));
  }

  function verifyPin(userId, pin) {
    const stored = localStorage.getItem(lockKey(userId));
    if (!stored) return false;
    try {
      return stored === btoa(pin);
    } catch {
      return false;
    }
  }

  function unlockProfile(userId, pin) {
    if (!verifyPin(userId, pin)) return false;
    localStorage.removeItem(lockKey(userId));
    return true;
  }

  return (
    <AuthContext.Provider value={{ users, currentUser, setCurrentUserId, addStudent, removeStudent, lockProfile, unlockProfile, isLocked, verifyPin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
