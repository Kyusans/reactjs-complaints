import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import MainLayoutRoutes from './MainLayoutRoutes';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<MainLayoutRoutes />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;