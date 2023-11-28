import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';
import AddPersonnel from './components/AddPersonnel';
import { useEffect } from 'react';

function App() {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/gsd/service-worker.js');
  }
  
  useEffect(() =>{
    if (window.location.protocol === 'http:') {
      window.location.href = `https://${window.location.host}${window.location.pathname}`;
    }
  },[])

  return (
    <>
      <Router basename='/gsd'>
        <Routes>
          <Route path="/" element={<Login /> } />
          <Route path="*" element={<MainLayoutRoutes />}/>
          <Route path='/addpersonnel' element={<AddPersonnel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;