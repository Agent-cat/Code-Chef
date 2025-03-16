import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import SignIn from '../Pages/SignIn'
import SignUp from '../Pages/SignUp'
import Contest from '../Pages/Contest'
import Students from '../Pages/Students'


const Navroutes = ({ onLogin }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contests" element={<Contest />} />
      <Route path="/students" element={<Students />} />

      <Route path="/signin" element={<SignIn onLogin={onLogin} />} />
      <Route path="/signup" element={<SignUp onLogin={onLogin} />} />
    </Routes>
  )
}

export default Navroutes