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

  // Fetch the full dynamic layout array schema from database repository API
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
    
    // Automatically switch the active middle view canvas layout to equipment manager screen
    setActiveMiddleView('equipmentManager');
    
    fetch(`/api/locations/${locationKey}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error('Error fetching systems:', err));
  };

  return (
    <div className="ibacs-container">
      <div className="ibacs-main-layout">
        
        {/* Left Column: Subsystem Navigator */}
                {/* Left Column: Subsystem Navigator */}
        <aside className="panel subsystem-navigator" style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0, borderBottom: '2px solid #3b82f6', paddingBottom: '8px', letterSpacing: '0.5px' }}>Subsystem Navigator</h3>
          
          {selectedLocation === null ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px', border: '1px dashed #cbd5e1', borderRadius: '8px', background: '#ffffff' }}>
              <p style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>Please select a location to view its systems.</p>
            </div>
          ) : systems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {systems.map((sys) => (
                <div 
                  key={sys.systemKey} 
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px', 
                    background: '#ffffff', 
                    color: '#1e293b', 
                    borderRadius: '8px', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Visual Indicator Dot */}
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block', flexShrink: 0 }}></span>
                  
                  <span style={{ textTransform: 'capitalize' }}>{sys.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '20px', border: '1px dashed #fca5a5', borderRadius: '8px', background: '#fef2f2' }}>
              <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500', margin: 0, textAlign: 'center' }}>No systems available for this location.</p>
            </div>
          )}
        </aside>


        {/* Center Canvas Column: Active RT Page View */}
        <main className="panel rt-page-view">
          <h3>RT Page View</h3>
          
          {activeMiddleView === 'locationManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>&larr; Back to Live View</button>
              <div style={{ padding: '20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0 }}>Location Manager</h4>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Location configuration and hierarchical tree forms will render here.</p>
              </div>
            </div>
          )}

          {activeMiddleView === 'equipmentManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>&larr; Back to Live View</button>
              
              {/* Pass the selected location ID parameter straight down into the Equipment Manager prop filter */}
              <EquipmentManager selectedLocationId={selectedLocation || undefined} />
            </div>
          )}

          {activeMiddleView === 'systemManager' && (
            <div>
              <button onClick={() => setActiveMiddleView('liveData')} style={{ marginBottom: '15px', background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>&larr; Back to Live View</button>
              <div style={{ padding: '20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                <h4 style={{ marginTop: 0 }}>System Manager</h4>
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

        {/* Right Column: Location Hierarchical Navigation Tree */}
        <aside className="panel location-navigator">
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '15px' }}>Structural View</h3>
          <StructuralDashboard 
            key={JSON.stringify(locations)} 
            items={locations} 
            selectedId={selectedLocation} 
            onSelect={handleLocationClick} 
          />
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
