import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';
import ReportModule from './components/ReportModule';
// import { useEffect } from 'react';

function App() {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/gsd/service-worker.js');
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
          <Route path='/report' element={<ReportModule />} />
          <Route path="*" element={<MainLayoutRoutes />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;