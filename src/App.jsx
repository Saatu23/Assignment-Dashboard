import React from 'react'
import { useAuth } from './contexts/AuthContext'
import { useData } from './contexts/DataContext'
import AdminDashboard from './components/AdminDashboard'
import StudentDashboard from './components/StudentDashboard'
import StudentList from './components/StudentList'

export default function App() {
  const { users, currentUser, setCurrentUserId, isLocked, lockProfile, unlockProfile, verifyPin } = useAuth()
  const { resetData } = useData()
  const [showStudentList, setShowStudentList] = React.useState(false)

  return (
    <div className="min-h-screen p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assignment & Review Dashboard</h1>

        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">Switch User</label>
          <select
            value={currentUser?.id}
            onChange={e => {
              const selectedId = e.target.value;
              if (selectedId === currentUser.id) return;
              if (isLocked(selectedId)) {
                const pin = window.prompt('This profile is locked. Enter PIN to switch:');
                if (pin === null) return;
                if (!verifyPin(selectedId, pin)) {
                  window.alert('Incorrect PIN. Cannot switch to this profile.');
                  return;
                }
              }
              setCurrentUserId(selectedId);
            }}
            className="border rounded p-2"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} {isLocked(u.id) ? '🔒' : ''} — {u.role}</option>
            ))}
          </select>
          {/* Lock/Unlock button for current user */}
          <button
            onClick={() => {
              const id = currentUser.id;
              if (isLocked(id)) {
                const pin = window.prompt('Enter PIN to unlock your profile:');
                if (pin === null) return;
                if (unlockProfile(id, pin)) {
                  window.alert('Profile unlocked.');
                } else {
                  window.alert('Incorrect PIN. Profile remains locked.');
                }
              } else {
                const pin = window.prompt('Create a PIN to lock your profile (keep it safe):');
                if (pin === null || pin.trim() === '') return;
                const confirmPin = window.prompt('Confirm your PIN:');
                if (confirmPin !== pin) {
                  window.alert('PINs did not match. Aborting.');
                  return;
                }
                if (lockProfile(id, pin)) {
                  window.alert('Profile locked. Other users will need the PIN to switch to it.');
                } else {
                  window.alert('Failed to lock profile.');
                }
              }
            }}
            className="ml-2 px-3 py-1 border rounded text-sm"
            title={isLocked(currentUser.id) ? 'Unlock your profile' : 'Lock your profile'}
          >
            {isLocked(currentUser.id) ? 'Unlock Profile' : 'Lock Profile'}
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                if (confirm('Reset data to mock defaults? This will overwrite local changes.')) {
                  resetData()
                  localStorage.removeItem('currentUserId')
                  location.reload()
                }
              }}
              className="ml-4 px-3 py-1 border rounded text-sm"
            >Reset Data</button>
          )}
          {currentUser?.role === 'admin' && (
            <button onClick={() => setShowStudentList(true)} className="ml-2 px-3 py-1 border rounded text-sm">Student List</button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {currentUser?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
      </main>
      {showStudentList && <StudentList onClose={() => setShowStudentList(false)} />}
    </div>
  )
}
