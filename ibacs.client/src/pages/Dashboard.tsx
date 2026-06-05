import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import { EquipmentManager } from '../components/EquipmentManager';
import { LocationTree } from '../components/LocationTree';
import StructuralDashboard from '../components/StructuralDashboard.tsx';
import { Thermometer, Activity, Cpu } from 'lucide-react';

interface LocationItem {
  locationKey: number;
  locationName: string;
  fullName: string;
  parentLocationKey: number | null;
}

interface SystemPointItem {
  sysPointKey?: number;
  pointKey: number;
  point?: {
    pointKey: number;
    name: string;
    address?: string;
  };
  systemKey?: number;
}

interface SystemItem {
  systemKey: number;
  name: string;
  locationKey: number;
  description?: string;
  location?: LocationItem;
  systemPoints?: SystemPointItem[];
}

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [allPoints, setAllPoints] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedSystemKey, setSelectedSystemKey] = useState<number | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [simulatedValues, setSimulatedValues] = useState<Record<number, number | string>>({});
  
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

    fetch('/api/Points')
      .then((res) => res.json())
      .then((data) => setAllPoints(data))
      .catch((err) => console.error("Error fetching points:", err));
  }, []);

  const locationMap = useMemo(() => {
    return new Map(locations.map(loc => [loc.locationKey, loc]));
  }, [locations]);

  const selectedLocationData = selectedLocation !== null ? locationMap.get(selectedLocation) : null;

  const handleLocationClick = (locationKey: number) => {
    setSelectedLocation(locationKey);
    setActiveMiddleView('liveData');
    setSelectedSystemKey(null); // Reset selected system
    
    fetch(`/api/locations/${locationKey}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error('Error fetching systems:', err));
  };

  // Find the selected system details
  const selectedSystem = useMemo(() => {
    return systems.find(sys => sys.systemKey === selectedSystemKey) || null;
  }, [systems, selectedSystemKey]);

  // Effect to handle simulated live updates
  useEffect(() => {
    if (!selectedSystem || !selectedSystem.systemPoints || selectedSystem.systemPoints.length === 0) {
      setSimulatedValues({});
      return;
    }

    // Initialize base values
    const initialValues: Record<number, number | string> = {};
    selectedSystem.systemPoints.forEach(sp => {
      const name = sp.point?.name?.toLowerCase() || '';
      const address = sp.point?.address?.toLowerCase() || '';
      
      if (name.includes('temp') || address.includes('temp')) {
        // Temperature: base 22.0
        initialValues[sp.pointKey] = 22.0 + Math.random() * 2;
      } else if (name.includes('humid') || address.includes('humid')) {
        // Humidity: base 50%
        initialValues[sp.pointKey] = Math.round(48 + Math.random() * 6);
      } else if (name.includes('status') || name.includes('run') || name.includes('state')) {
        // Status: RUNNING or STOPPED
        initialValues[sp.pointKey] = Math.random() > 0.15 ? 'RUNNING' : 'STOPPED';
      } else {
        // General metrics
        initialValues[sp.pointKey] = Math.round(30 + Math.random() * 40);
      }
    });
    setSimulatedValues(initialValues);

    // Update values periodically
    const interval = setInterval(() => {
      setSimulatedValues(prev => {
        const next = { ...prev };
        selectedSystem.systemPoints?.forEach(sp => {
          const name = sp.point?.name?.toLowerCase() || '';
          const address = sp.point?.address?.toLowerCase() || '';
          const current = prev[sp.pointKey];

          if (typeof current === 'number') {
            if (name.includes('temp') || address.includes('temp')) {
              // Drift temperature slightly (+/- 0.1)
              const delta = (Math.random() - 0.5) * 0.2;
              next[sp.pointKey] = parseFloat((current + delta).toFixed(1));
            } else if (name.includes('humid') || address.includes('humid')) {
              // Drift humidity (+/- 1)
              const delta = Math.random() > 0.5 ? 1 : -1;
              const nextVal = current + delta;
              next[sp.pointKey] = Math.max(30, Math.min(90, nextVal));
            } else {
              // General metric drift
              const delta = Math.round((Math.random() - 0.5) * 4);
              next[sp.pointKey] = Math.max(0, current + delta);
            }
          } else if (typeof current === 'string') {
            // Status: occasionally toggle
            if (Math.random() > 0.95) {
              next[sp.pointKey] = current === 'RUNNING' ? 'STOPPED' : 'RUNNING';
            }
          }
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedSystem]);

  return (
    <div className="ibacs-container">
      <div className="ibacs-main-layout">
        
        {/* Left Column: Subsystem Navigator */}
        <aside className="panel subsystem-navigator">
          <h3>Subsystem Navigator</h3>
          {selectedLocation === null ? (
            <p className="placeholder-text">Please select a location to view its systems.</p>
          ) : systems.length > 0 ? (
            <ul className="nav-list">
              {systems.map((sys) => (
                <li
                  key={sys.systemKey}
                  className={`system-nav-item ${selectedSystemKey === sys.systemKey ? 'active' : ''}`}
                  onClick={() => setSelectedSystemKey(sys.systemKey)}
                >
                  ⚙️ {sys.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="error-text">No systems available for this location.</p>
          )}
        </aside>

        {/*Center Canvas Column: Active RT Page View */}
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
                  
                  {selectedSystem ? (
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Cpu size={20} className="text-primary-400" />
                            {selectedSystem.name} Live Telemetry
                          </h4>
                          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                            Monitoring logical control tags for {selectedLocationData.locationName}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                          LIVE FEED
                        </div>
                      </div>

                      {!selectedSystem.systemPoints || selectedSystem.systemPoints.length === 0 ? (
                        <div style={{ padding: '60px 20px', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                          <Activity size={32} className="text-slate-300" />
                          <div>
                            <p style={{ margin: 0, fontWeight: '700', color: '#334155' }}>No points mapped to this system</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                              Go to the Systems configuration page to map physical equipment points to this system.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                          {selectedSystem.systemPoints.map((sp) => {
                            const val = simulatedValues[sp.pointKey];
                            const isTemp = sp.point?.name?.toLowerCase().includes('temp') || sp.point?.address?.toLowerCase().includes('temp');
                            const isHumid = sp.point?.name?.toLowerCase().includes('humid') || sp.point?.address?.toLowerCase().includes('humid');
                            const isStatus = sp.point?.name?.toLowerCase().includes('status') || sp.point?.name?.toLowerCase().includes('run');
                            
                            let valStr = val !== undefined ? String(val) : '--';
                            if (val !== undefined && typeof val === 'number') {
                              if (isTemp) valStr += ' °C';
                              else if (isHumid) valStr += ' %';
                            }

                            const colorIndex = (sp.pointKey % 4);
                            const gradients = [
                              'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', // Blue
                              'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', // Emerald
                              'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', // Pink
                              'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'  // Purple
                            ];
                            const borderColors = ['#bfdbfe', '#a7f3d0', '#fbcfe8', '#e9d5ff'];
                            const textColors = ['#1d4ed8', '#047857', '#be185d', '#7e22ce'];

                            return (
                              <div
                                key={sp.sysPointKey}
                                style={{
                                  background: gradients[colorIndex],
                                  border: `1px solid ${borderColors[colorIndex]}`,
                                  borderRadius: '12px',
                                  padding: '16px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '12px',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                  textAlign: 'left'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                  <div>
                                    <h5 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                                      {sp.point?.name}
                                    </h5>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#64748b', fontWeight: '600' }}>
                                      {allPoints.find(ap => ap.pointKey === sp.pointKey)?.equipment?.name || 'Equipment'}
                                    </p>
                                  </div>
                                  <div style={{ color: textColors[colorIndex], background: 'rgba(255,255,255,0.6)', padding: '6px', borderRadius: '8px' }}>
                                    {isTemp ? <Thermometer size={16} /> : <Activity size={16} />}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                  <div>
                                    <span style={{ fontSize: '10px', color: '#94a3b8', background: '#fff', border: '1px solid rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', fontFamily: 'monospace' }}>
                                      {sp.point?.address || 'No Address'}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '24px',
                                      fontWeight: '900',
                                      color: isStatus && val === 'STOPPED' ? '#ef4444' : '#0f172a',
                                      letterSpacing: '-0.025em'
                                    }}
                                  >
                                    {isStatus ? (
                                      <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', backgroundColor: val === 'RUNNING' ? '#d1fae5' : '#fee2e2', color: val === 'RUNNING' ? '#065f46' : '#991b1b' }}>
                                        {valStr}
                                      </span>
                                    ) : (
                                      valStr
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '60px 20px', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '12px', color: '#64748b', textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Cpu size={32} className="text-slate-300" />
                      <div>
                        <p style={{ margin: 0, fontWeight: '700', color: '#334155' }}>Select an automation system</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                          Please select one of the automation systems from the Subsystem Navigator on the left to monitor live point values.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="placeholder-text" style={{ margin: 0 }}>Please select a location from the right panel to view live equipment data.</p>
              )}
            </div>
          )}
        </main>

        {/*Right Column: Location Hierarchical Navigation Tree */}
        <aside className="panel location-navigator">
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '15px' }}>Structural View</h3>
          <StructuralDashboard 
            key={JSON.stringify(locations)} // Forces layout refresh smoothly inside browser whenever server inventory resets
            items={locations} // Injects live dynamic array list straight down into tree branch configurations
            selectedId={selectedLocation} // Highlights currently active golden state matching parameter
            onSelect={handleLocationClick} // Triggers live sub-system rendering seamlessly upon column select clicks
          />
        </aside>

      </div>
    </div>
  );
};

export default Dashboard;
