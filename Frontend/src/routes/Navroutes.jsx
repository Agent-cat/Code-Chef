import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import SignIn from '../Pages/SignIn'
import SignUp from '../Pages/SignUp'
import Contest from '../Pages/Contest'
import Students from '../Pages/Students'
import StudentStats from '../Pages/StudentStats'
import ContestAttendance from '../Pages/ContestAttendance'
import ProtectedRoute from '../components/ProtectedRoute'

const Navroutes = ({ onLogin }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contests" element={
        <ProtectedRoute>
          <Contest />
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/student-stats/:handle" element={
        <ProtectedRoute>
          <StudentStats />
        </ProtectedRoute>
      } />
      <Route path="/contest-attendance/:contestCode" element={
        <ProtectedRoute>
          <ContestAttendance />
        </ProtectedRoute>
      } />
      <Route path="/signin" element={<SignIn onLogin={onLogin} />} />
      <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
    </Routes>
  )
}

export default Navroutes