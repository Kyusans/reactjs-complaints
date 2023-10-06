import React from 'react'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/AdminDashboard'
import Dashboard from './components/Dashboard'
import AdminNavbar from './components/AdminNavbar'
import AdminAddLocation from './components/AdminAddLocation'
import JobDetails from './components/JobDetails'

function MainLayoutRoutes() {
  return (
    <div>      
      {localStorage.getItem("adminLoggedIn") === "true" ? <AdminNavbar /> : <NavBar />}
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/admin/addlocation" element={<AdminAddLocation />} />
        <Route path="/job/details/:compId" element={<JobDetails />} />
      </Routes>
    </div>
  )
}

export default MainLayoutRoutes