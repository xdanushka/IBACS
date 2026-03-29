import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Locations from './pages/Locations';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50 selection:bg-primary-100 selection:text-primary-900 overflow-x-hidden">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div className="relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -z-10" />

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/locations" element={<Locations />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
