# Assignment & Review Dashboard

A lightweight, frontend-only React application (Vite + Tailwind CSS) for managing assignments and student submissions. Designed for demos and local use with no backend - all data persists in the browser via `localStorage`.

This README documents the app's purpose, features, key functions and files, data model, security notes (frontend-only PIN lock), and steps to run the project locally on Windows PowerShell.

### Working Link
https://assignment-dashboard-chi-orcin.vercel.app/

## Features

- Two roles: `admin` and `student`.
  - Admins can create assignments, remove assignments, and manage the student list.
  - Students can view assignments, mark them as started/completed, and see progress.
- Local persistence using `localStorage`. Mock data is provided on first run.
- Admin-only controls:
  - Reset app data to the mock defaults.
  - Open a modal to add/remove students (alphabetically sorted list).
  - Create and remove assignments. Removing an assignment also deletes related submission records.
- Student management modal with add and remove operations.
- Frontend-only profile lock (PIN): users can lock their profile with a PIN so that switching into a locked profile requires entering the PIN.

## Quick app walkthrough

- Header:
  - Switch User: pick any user from the dropdown. Locked profiles show a 🔒 badge and require a PIN to switch to.
  - Lock/Unlock Profile: create a PIN to lock the currently active profile or unlock it by entering the PIN.
  - Reset Data (admin only): restores mock data and clears stored changes.
  - Student List (admin only): open the student management modal.
- Main:
  - AdminDashboard: assignment creation form, assignment list with removal controls and student progress.
  - StudentDashboard: student's assignment list and status toggles.

## Important files and functions

The following files are the primary places to look. Function names referenced here are exported by contexts or components and describe app logic.

- `src/App.jsx`
  - Top-level layout and header controls.
  - Switch user dropdown integrates with the profile lock flow and shows lock/unlock button.

- `src/contexts/AuthContext.jsx`
  - Manages user list, current user selection, and local persistence for users.
  - Key functions provided to the app via context:
    - `users` - array of user objects ({ id, name, role }).
    - `currentUser` - currently active user object.
    - `setCurrentUserId(id)` - switch the active user (checks locks when switching).
    - `addStudent({ id, name })` - add a student to `users` and persist.
    - `removeStudent(id)` - remove a student and emit any cleanup hooks (submissions removal handled in `DataContext`).
    - `lockProfile(userId, pin)` - lock a profile with a PIN (stored base64-encoded in `localStorage` under key `lock_<id>`).
    - `isLocked(userId)` - returns whether a profile is locked.
    - `verifyPin(userId, pin)` - verify a PIN against the stored value.
    - `unlockProfile(userId, pin)` - unlocks (removes lock entry) after successful verification.

- `src/contexts/DataContext.jsx`
  - Holds assignments and submission records and exposes methods to mutate and persist them.
  - Data shapes:
    - Assignment: { id, title, dueDate, description }
    - Submission: { id, assignmentId, studentId, status } where status is one of `not-started`, `in-progress`, `completed`.
  - Key functions:
    - `assignments` - array of assignment objects.
    - `submissions` - array of submission objects.
    - `createAssignment(assignment)` - create a new assignment and create submission records for each student.
    - `removeAssignment(assignmentId)` - delete an assignment and its related submissions.
    - `updateSubmissionStatus(submissionId, status)` - change a submission's status.
    - `createSubmissionsForStudent(studentId)` - create missing submissions when a student is added.
    - `deleteSubmissionsForStudent(studentId)` - remove all submissions for a removed student.
    - `resetData()` - reset assignments, submissions, and users to the mock data.

- `src/components/StudentList.jsx`
  - A modal dialog used by admins to add and remove students. The list is shown alphabetically.

- `src/components/AssignmentList.jsx` and related components
  - Render assignments with admin-only remove buttons and the student progress per assignment.

- `src/data/mockData.js`
  - The initial seed data: default users (admin + students), assignments, and submissions used by `resetData()`.

## Security & Privacy notes

- The profile lock is strictly frontend-only. PINs are stored in `localStorage` as base64-encoded strings (not encrypted). This is intended for casual local protection only (e.g., to prevent quick switching by others on the same machine). Do NOT use this mechanism for real security or sensitive data protection.
- Anyone with access to the browser's developer tools or profile directory can read and modify `localStorage` and thus bypass the PIN.

## File map (recommended structure)

```
Assignment-Dashboard/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── AssignmentCard.jsx
│   │   ├── AssignmentCreateForm.jsx
│   │   ├── AssignmentList.jsx
│   │   ├── AssignmentProgress.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentList.jsx
│   │   └── VerificationModal.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.cjs
├── vite.config.js
└── README.md
```

## Local setup (Windows PowerShell)

1. Prerequisites
   - Node.js 16+ (LTS recommended) and npm installed.

2. Clone the Repository

3. Go to the Assignment-Dashboard directory of your system

4. Install dependencies

```powershell
npm install
```

5. Run the dev server

```powershell
npm run dev
```

6. Open the app
   - Vite will show a local URL, usually `http://localhost:5173/`. Open it in your browser.
