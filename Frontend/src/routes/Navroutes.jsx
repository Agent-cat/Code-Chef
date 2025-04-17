import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import SignIn from '../Pages/SignIn'
import SignUp from '../Pages/SignUp'
import Contest from '../Pages/Contest'
import Students from '../Pages/Students'
import StudentStats from '../Pages/StudentStats'
import StudentProfile from '../Pages/StudentProfile'
import ContestAttendance from '../Pages/ContestAttendance'
import ProtectedRoute from '../components/ProtectedRoute'
import RoleBasedRoute from '../components/RoleBasedRoute'
import Unauthorized from '../Pages/Unauthorized'
import AdminDashboard from '../Pages/AdminDashboard'
import ManageUsers from '../Pages/ManageUsers'

const Navroutes = ({ onLogin, contests, loading, error, user }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contests" element={
        <ProtectedRoute>
          <Contest contests={contests} loading={loading} error={error} />
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute>
          <Students />
        </ProtectedRoute>
      } />
      <Route path="/student/:studentId" element={
        <ProtectedRoute>
          <StudentProfile />
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
      
      {/* Admin routes - only accessible to Dean and HOD */}
      <Route path="/admin/dashboard" element={
        <RoleBasedRoute allowedRoles={["Dean", "HOD"]}>
          <AdminDashboard />
        </RoleBasedRoute>
      } />
      
      {/* Dean-only routes */}
      <Route path="/admin/manage-users" element={
        <RoleBasedRoute allowedRoles={["Dean"]}>
          <ManageUsers />
        </RoleBasedRoute>
      } />
      
      <Route path="/signin" element={<SignIn onLogin={onLogin} />} />
      <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  )
}

export default Navroutes