import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import Dashboard from './components/Dashboard'
import AdminNavbar from './components/AdminNavbar'

function MainLayoutRoutes() {
  return (
    <div>      
      {localStorage.getItem("adminLoggedIn") === "true" ? <AdminNavbar /> : <NavBar />}
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default MainLayoutRoutes