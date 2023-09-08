import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import Dashboard from './components/Dashboard'

function MainLayoutRoutes() {
  return (
    <div>      
      <NavBar />
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default MainLayoutRoutes