import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import AdminNavbar from './components/AdminNavbar';
import AdminAddLocation from './components/AdminAddLocation';
import JobDetails from './components/JobDetails';
import PersonnelDashboard from './components/PersonnelDashboard';
import ChangePassword from './components/ChangePassword';
import ReportModule from './components/ReportModule';
import './components/css/site.css';
import NavBar from './components/NavBar';

function MainLayoutRoutes() {
  return (
    <>
      {localStorage.getItem("adminLoggedIn") === "true" ? <AdminNavbar /> : <NavBar />}
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/admin/addlocation" element={<AdminAddLocation />} />
        <Route path="/job/details/:compId" element={<JobDetails />} />
        <Route path="/personnel/dashboard" element={<PersonnelDashboard />} />
        <Route path="/account/password" element={<ChangePassword />} />
        <Route path="/report" element={<ReportModule />} />
      </Routes>
    </>
  );
}

export default MainLayoutRoutes;
