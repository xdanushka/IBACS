import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import { EquipmentManager } from '../components/EquipmentManager';
import { LocationTree } from '../components/LocationTree';
import StructuralDashboard from '../components/StructuralDashboard.tsx';



interface LocationItem {
  locationKey: number;
  locationName: string;
  fullName: string;
  parentLocationKey: number | null;
}

interface SystemItem {
  systemKey: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  
  const [activeMiddleView, setActiveMiddleView] = useState<'liveData' | 'locationManager' | 'equipmentManager' | 'systemManager'>('liveData');

 // Temporary Hardcoded Mock Data Test inside Dashboard.tsx
    useEffect(() => {
    fetch('/api/Locations')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch location structural map.');
        return res.json();
      })
      .then((data) => {
        
        setLocations(data);
      })
      .catch((err) => {
        console.error("Database connection error:", err);
      });
  }, []);

  const locationMap = useMemo(() => {
    return new Map(locations.map(loc => [loc.locationKey, loc]));
  }, [locations]);

  const selectedLocationData = selectedLocation !== null ? locationMap.get(selectedLocation) : null;

  const handleLocationClick = (locationKey: number) => {
    setSelectedLocation(locationKey);
    setActiveMiddleView('liveData');
    
    fetch(`/api/locations/${locationKey}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error('Error fetching systems:', err));
  };

  return (
    <div className="ibacs-container">
      <div className="ibacs-main-layout">
        
        {/* 🔹 Left Column: Subsystem Navigator */}
        <aside className="panel subsystem-navigator">
          <h3>Subsystem Navigator</h3>
          {selectedLocation === null ? (
            <p className="placeholder-text">Please select a location to view its systems.</p>
          ) : systems.length > 0 ? (
            <ul className="nav-list">
              {systems.map((sys) => (
                <li key={sys.systemKey} className="system-nav-item">⚙️ {sys.name}</li>
              ))}
            </ul>
          ) : (
            <p className="error-text">No systems available for this location.</p>
          )}
        </aside>

        {/* 🔸 Center Canvas Column: Active RT Page View */}
        <main className="panel rt-page-view">
          <h3>RT Page View</h3>
          
          {activeMiddleView === 'locationManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>← Back to Live View</button>
              <div style={{ padding: '20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0 }}>🏢 Location Manager</h4>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Location configuration and hierarchical tree forms will render here.</p>
              </div>
            </div>
          )}

          {activeMiddleView === 'equipmentManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>← Back to Live View</button>
              <EquipmentManager />
            </div>
          )}

          {activeMiddleView === 'systemManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>← Back to Live View</button>
              <div style={{ padding: '20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0 }}>⚙️ System Manager</h4>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Automation subsystem loops and logical network tags will render here.</p>
              </div>
            </div>
          )}

          {activeMiddleView === 'liveData' && (
            <div className="rt-content-box">
              {selectedLocation && selectedLocationData ? (
                <div>
                  <p style={{ fontWeight: '600', color: '#334155', margin: '0 0 15px 0' }}>
                    Currently Selected Location: <span style={{ color: '#2563eb' }}>{selectedLocationData.fullName}</span>
                  </p>
                  <div style={{ padding: '40px 20px', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '6px', color: '#64748b', textAlign: 'center' }}>
                    Telemetry metrics data points viewport canvas will render here.
                  </div>
                </div>
              ) : (
                <p className="placeholder-text" style={{ margin: 0 }}>Please select a location from the right panel to view live equipment data.</p>
              )}
            </div>
          )}
        </main>

        {/* 🟩 Right Column: Location Hierarchical Navigation Tree */}
        <aside className="panel location-navigator">
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '15px' }}>Structural View</h3>
          <StructuralDashboard />
        </aside>



      </div>
    </div>
  );
};

export default Dashboard;
