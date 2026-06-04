import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';
import Systems from './pages/Systems';
import Login from './Login';
import Equipment from './pages/Equipment';
import EquipmentDetails from './pages/EquipmentDetails';

function App() {
  // Initially set to null to indicate that the authentication status is being checked
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Show a loading state until the authentication check is complete
  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Router>    
      <div className="min-h-screen bg-slate-50/50">
        {/* Navbar is displayed only if the user is authenticated */}
        {isAuthenticated && <Navbar />}
        
        <main className={isAuthenticated ? "max-w-7xl mx-auto px-6 py-10" : "w-full h-full"}>
          <Routes>
            {/* Redirect root path to login page by default */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Login route: Redirect to dashboard if already authenticated */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Protected Routes: Require authentication to access */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/locations" element={isAuthenticated ? <Locations /> : <Navigate to="/login" />} />
            <Route path="/equipment" element={isAuthenticated ? <Equipment /> : <Navigate to="/login" />} />
            <Route path="/equipment/:id" element={isAuthenticated ? <EquipmentDetails /> : <Navigate to="/login" />} />
            <Route path="/systems" element={isAuthenticated ? <Systems /> : <Navigate to="/login" />} />
            
            {/* Redirect any undefined routes to the login page */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>  
        </main>
      </div>
    </Router>
  );
}

export default App;