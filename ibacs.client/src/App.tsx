import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Systems from './pages/Systems';
import Login from './Login';
import Equipment from './pages/Equipment';
import EquipmentDetails from './pages/EquipmentDetails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>     
      <div className="min-h-screen bg-slate-50/50">
        {isAuthenticated && <Navbar />}
        <main className={isAuthenticated ? "max-w-7xl mx-auto px-6 py-10" : "w-full h-full"}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            
            {/* Login route receives setIsAuthenticated as a prop */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
              
            />
            
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/locations" element={isAuthenticated ? <Locations /> : <Navigate to="/login" />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetails />} />
            <Route path="/systems" element={<Systems />} />
          </Routes>  
        </main>
      </div>
    </Router>
  );
}

export default App;