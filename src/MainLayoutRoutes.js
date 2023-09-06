import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'

function MainLayoutRoutes() {
  return (
    <div>      
      <NavBar />
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

export default MainLayoutRoutes