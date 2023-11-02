import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';

function App() {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) =>{
      console.log("Service Worker registration with scope: " + registration.scope);
    })
    .catch((err) =>{
      console.error("Service Worker registration failed: " + err);
    })
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login /> } />
          <Route path="*" element={<MainLayoutRoutes />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;