import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';
import { useEffect } from 'react';

function App() {
  
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/gsd/service-worker.js');
  }

  if (localStorage.getItem("url") !== "http://localhost/gsd/api/") {
    localStorage.setItem("url", "http://localhost/gsd/api/");
    // https://coc-studentinfo.net/gsd/api/
  }
  
  // useEffect(() =>{
  //   if (window.location.protocol === 'http:') {
  //     window.location.href = `https://${window.location.host}${window.location.pathname}`;
  //   }
  // },[])

  

  return (
    <>
      <Router basename='/gsd'>
        <Routes>
          <Route path="/" element={<Login /> } />
          <Route path="*" element={<MainLayoutRoutes />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;