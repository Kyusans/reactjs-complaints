import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';
import { useEffect } from 'react';

function App() {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/gsd/service-worker.js');
  }

  if (localStorage.getItem("url") !== "https://coc-studentinfo.net/gsd/api/") {
    localStorage.setItem("url", "https://coc-studentinfo.net/gsd/api/");
    // https://coc-studentinfo.net/gsd/api/
  }

  // useEffect(() => {
  //   localStorage.setItem("selectedStatus", "0");
  //   console.log("selectedStatus is now: ", localStorage.getItem("selectedStatus"));
  //   if (window.location.protocol === 'http:') {
  //     window.location.href = `https://${window.location.host}${window.location.pathname}`;
  //   }
  // }, [])



  return (
    <>
      <Router basename='/gsd'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<MainLayoutRoutes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;