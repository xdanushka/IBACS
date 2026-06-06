import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import { EquipmentManager } from '../components/EquipmentManager';

import StructuralDashboard from '../components/StructuralDashboard.tsx';
import {
  Activity,
  Cpu,
  ChevronDown,
  ChevronRight,
  Folder,
  Layers,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getAllEquipment, type Equipment } from '../api/equipmentApi';
import systemService, { type SystemModel } from '../api/systemService';

interface LocationItem {
  locationKey: number;
  locationName: string;
  fullName: string;
  parentLocationKey: number | null;
}

interface SimValue {
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: number;
}

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [allSystems, setAllSystems] = useState<SystemModel[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedEquipmentKey, setSelectedEquipmentKey] = useState<number | null>(null);
  const [selectedSystemKey, setSelectedSystemKey] = useState<number | null>(null);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [simulatedValues, setSimulatedValues] = useState<Record<number, SimValue>>({});

  const [activeMiddleView, setActiveMiddleView] = useState<'liveData' | 'locationManager' | 'equipmentManager' | 'systemManager'>('liveData');

  // Fetch the initial locations, equipment, and systems from database
  useEffect(() => {
    fetch('/api/Locations')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch location structural map.');
        return res.json();
      })
      .then((data: LocationItem[]) => {
        setLocations(data);
        if (data && data.length > 0) {
          const topLoc = data.find(loc => loc.parentLocationKey === null) || data[0];
          setSelectedLocation(topLoc.locationKey);
        }
      })
      .catch((err) => {
        console.error("Database connection error:", err);
      });

    getAllEquipment()
      .then((data) => {
        if (Array.isArray(data)) {
          setAllEquipment(data);
        }
      })
      .catch((err) => console.error("Error fetching equipment:", err));

    systemService.getSystems()
      .then((data) => {
        if (Array.isArray(data)) {
          setAllSystems(data);
        }
      })
      .catch((err) => console.error("Error fetching systems:", err));
  }, []);

  const locationMap = useMemo(() => {
    return new Map(locations.map(loc => [loc.locationKey, loc]));
  }, [locations]);

  const selectedLocationData = selectedLocation !== null ? locationMap.get(selectedLocation) : null;

  // Helper to find child location keys recursively
  const getDescendantLocationKeys = (locationKey: number, locList: LocationItem[]): number[] => {
    const keys = [locationKey];
    const findChildren = (parentKey: number) => {
      locList.forEach(loc => {
        if (loc.parentLocationKey !== null && Number(loc.parentLocationKey) === parentKey) {
          const childKey = Number(loc.locationKey);
          if (!keys.includes(childKey)) {
            keys.push(childKey);
            findChildren(childKey);
          }
        }
      });
    };
    findChildren(locationKey);
    return keys;
  };

  // Memoized descendant location keys for the selected location
  const descendantLocationKeys = useMemo(() => {
    if (selectedLocation === null) return [];
    return getDescendantLocationKeys(selectedLocation, locations);
  }, [selectedLocation, locations]);

  // Filter equipment belonging to the selected location and its child locations
  const filteredEquipment = useMemo(() => {
    if (selectedLocation === null) return [];
    return allEquipment.filter(eq => eq.locationKey !== undefined && descendantLocationKeys.includes(eq.locationKey));
  }, [allEquipment, descendantLocationKeys, selectedLocation]);

  // Group filtered equipment by equipment category type
  const groupedEquipment = useMemo(() => {
    const groups: Record<string, Equipment[]> = {};
    filteredEquipment.forEach(eq => {
      const typeName = eq.equipmentCategory?.category || 'General Equipment';
      if (!groups[typeName]) {
        groups[typeName] = [];
      }
      groups[typeName].push(eq);
    });
    return groups;
  }, [filteredEquipment]);

  // Filter systems belonging to the selected location and its child locations
  const filteredSystems = useMemo(() => {
    if (selectedLocation === null) return [];
    return allSystems.filter(sys => sys.locationKey !== undefined && descendantLocationKeys.includes(sys.locationKey));
  }, [allSystems, descendantLocationKeys, selectedLocation]);



  // Selected details
  const selectedEquipment = useMemo(() => {
    if (selectedEquipmentKey === null) return null;
    return allEquipment.find(eq => eq.equipmentKey === selectedEquipmentKey) || null;
  }, [allEquipment, selectedEquipmentKey]);

  const selectedSystem = useMemo(() => {
    if (selectedSystemKey === null) return null;
    return allSystems.find(sys => sys.systemKey === selectedSystemKey) || null;
  }, [allSystems, selectedSystemKey]);

  interface DashboardPoint {
    pointKey?: number;
    equipmentKey?: number;
    name: string;
    address?: string | null;
  }

  // Extract points for the active target selection
  const activePoints = useMemo((): DashboardPoint[] => {
    if (selectedEquipment) {
      return selectedEquipment.points || [];
    }
    if (selectedSystem) {
      return (selectedSystem.systemPoints || []).map(sp => sp.point).filter(Boolean) as DashboardPoint[];
    }
    return [];
  }, [selectedEquipment, selectedSystem]);

  // Handle location change clicks from structural dashboard
  const handleLocationClick = (locationKey: number) => {
    setSelectedLocation(locationKey);
    setActiveMiddleView('liveData');
    setSelectedSystemKey(null); // Reset selected system
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const handleEquipmentClick = (eqKey: number) => {
    setSelectedEquipmentKey(eqKey);
    setSelectedSystemKey(null);
    setActiveMiddleView('liveData');
  };

  const handleSystemClick = (sysKey: number) => {
    setSelectedSystemKey(sysKey);
    setSelectedEquipmentKey(null);
    setActiveMiddleView('liveData');
  };

  // Effect to simulate random telemetry point values
  useEffect(() => {
    if (activePoints.length === 0) {
      return;
    }

    const initPointValue = (name: string, address: string) => {
      const n = name.toLowerCase();
      const a = (address || '').toLowerCase();
      if (n.includes('temp') || a.includes('temp')) {
        return parseFloat((19.0 + Math.random() * 6).toFixed(1)); // 19°C - 25°C
      }
      if (n.includes('humid') || a.includes('humid')) {
        return Math.round(40 + Math.random() * 25); // 40% - 65%
      }
      if (n.includes('press') || a.includes('press')) {
        return Math.round(20 + Math.random() * 30); // 20 - 50 Pa
      }
      if (n.includes('flow') || a.includes('flow')) {
        return parseFloat((2.0 + Math.random() * 10).toFixed(1)); // 2.0 - 12.0 L/s
      }
      if (n.includes('status') || n.includes('run') || n.includes('state') || n.includes('mode') || n.includes('enable')) {
        return Math.random() > 0.25 ? 'RUNNING' : 'STOPPED';
      }
      return Math.round(15 + Math.random() * 70); // Generic fallback range
    };

    // Initialize point values if they don't exist yet
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSimulatedValues(prev => {
      const next = { ...prev };
      let updated = false;
      activePoints.forEach(p => {
        if (p.pointKey !== undefined && !next[p.pointKey]) {
          next[p.pointKey] = {
            value: initPointValue(p.name, p.address || ''),
            trend: 'stable',
            lastUpdated: Date.now()
          };
          updated = true;
        }
      });
      return updated ? next : prev;
    });

    const interval = setInterval(() => {
      setSimulatedValues(prev => {
        const next = { ...prev };
        activePoints.forEach(p => {
          if (p.pointKey === undefined) return;
          const currentData = prev[p.pointKey];
          if (!currentData) return;

          const n = p.name.toLowerCase();
          const a = (p.address || '').toLowerCase();
          const currVal = currentData.value;
          let newVal: number | string = currVal;
          let trend: 'up' | 'down' | 'stable' = 'stable';

          if (typeof currVal === 'number') {
            let drift = 0;
            if (n.includes('temp') || a.includes('temp')) {
              drift = (Math.random() - 0.5) * 0.3;
              newVal = parseFloat(Math.max(15, Math.min(32, currVal + drift)).toFixed(1));
            } else if (n.includes('humid') || a.includes('humid')) {
              drift = Math.random() > 0.5 ? 1 : -1;
              newVal = Math.max(10, Math.min(98, currVal + drift));
            } else {
              drift = Math.round((Math.random() - 0.5) * 6);
              newVal = Math.max(0, currVal + drift);
            }

            if (newVal > currVal) trend = 'up';
            else if (newVal < currVal) trend = 'down';
          } else if (typeof currVal === 'string') {
            // Randomly toggle state values
            if (Math.random() > 0.9) {
              newVal = currVal === 'RUNNING' ? 'STOPPED' : 'RUNNING';
            }
          }

          next[p.pointKey] = {
            value: newVal,
            trend: trend,
            lastUpdated: Date.now()
          };
        });
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activePoints]);

  return (
    <div className="ibacs-container">
      <div className="ibacs-main-layout">

        {/* Left Column: Subsystem Navigator */}
        <aside className="panel subsystem-navigator">
          <h3>Assets & Systems</h3>
          {selectedLocation === null ? (
            <p className="placeholder-text">Please select a location to view its assets.</p>
          ) : (
            <div className="navigator-tree">
              {/* Equipment Groups */}
              {Object.entries(groupedEquipment).map(([category, eqList]) => (
                <div key={category} className="tree-group">
                  <div className="tree-group-header" onClick={() => toggleGroup(category)}>
                    <div className="tree-chevron">
                      {expandedGroups[category] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    <Folder size={14} className="tree-icon icon-yellow" />
                    <span className="tree-group-title">{category}</span>
                    <span className="tree-badge">{eqList.length}</span>
                  </div>
                  {expandedGroups[category] && (
                    <ul className="tree-leaves">
                      {eqList.map((eq) => (
                        <li
                          key={eq.equipmentKey}
                          className={`tree-leaf ${selectedEquipmentKey === eq.equipmentKey ? 'active' : ''}`}
                          onClick={() => eq.equipmentKey !== undefined && handleEquipmentClick(eq.equipmentKey)}
                        >
                          <Cpu size={12} className="tree-leaf-icon" />
                          <span className="tree-leaf-name">{eq.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Systems Group */}
              {filteredSystems.length > 0 && (
                <div key="systems-group" className="tree-group">
                  <div className="tree-group-header" onClick={() => toggleGroup('Systems')}>
                    <div className="tree-chevron">
                      {expandedGroups['Systems'] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    <Layers size={14} className="tree-icon icon-blue" />
                    <span className="tree-group-title">Systems</span>
                    <span className="tree-badge">{filteredSystems.length}</span>
                  </div>
                  {expandedGroups['Systems'] && (
                    <ul className="tree-leaves">
                      {filteredSystems.map((sys) => (
                        <li
                          key={sys.systemKey}
                          className={`tree-leaf ${selectedSystemKey === sys.systemKey ? 'active' : ''}`}
                          onClick={() => sys.systemKey !== undefined && handleSystemClick(sys.systemKey)}
                        >
                          <Activity size={12} className="tree-leaf-icon" />
                          <span className="tree-leaf-name">{sys.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {Object.keys(groupedEquipment).length === 0 && filteredSystems.length === 0 && (
                <p className="no-data-text">No assets or systems available for this location.</p>
              )}
            </div>
          )}
        </aside>

        {/*Center Canvas Column: Active RT Page View */}
        <main className="panel rt-page-view">
          <h3>Telemetry & Live Data View</h3>

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

                  {selectedEquipment ? (
                    <div className="telemetry-section animate-fade-in">

                      {/* Telemetry Header Banner */}
                      <div className="telemetry-banner">
                        <div className="banner-details">
                          <h4 className="banner-title">
                            <Cpu size={22} className="banner-icon icon-primary" />
                            {selectedEquipment.name} Telemetry
                          </h4>
                          <div className="banner-metadata">
                            <span className="meta-badge">Type: {selectedEquipment.equipmentCategory?.category || 'General'}</span>
                            <span className="meta-badge">Location: {selectedLocationData.locationName}</span>
                          </div>
                          {selectedEquipment.description && (
                            <p className="banner-description">{selectedEquipment.description}</p>
                          )}
                        </div>
                        <div className="banner-status">
                          <span className="pulse-dot bg-emerald-500"></span>
                          <span className="status-label">LIVE STREAM</span>
                        </div>
                      </div>

                      {/* Points Grid */}
                      {activePoints.length === 0 ? (
                        <div className="empty-points-panel">
                          <Activity size={32} className="text-slate-300 animate-pulse" />
                          <div>
                            <p className="empty-title">No Telemetry Mapped</p>
                            <p className="empty-subtitle">
                              This device has no active hardware points. Map points via Equipment configurations.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="points-grid">
                          {activePoints.map((p) => {
                            const sim = simulatedValues[p.pointKey!];
                            const val = sim ? sim.value : '--';
                            const trend = sim ? sim.trend : 'stable';

                            const isTemp = p.name.toLowerCase().includes('temp') || (p.address || '').toLowerCase().includes('temp');
                            const isHumid = p.name.toLowerCase().includes('humid') || (p.address || '').toLowerCase().includes('humid');
                            const isStatus = p.name.toLowerCase().includes('status') || p.name.toLowerCase().includes('run') || p.name.toLowerCase().includes('state') || p.name.toLowerCase().includes('mode') || p.name.toLowerCase().includes('enable');

                            let valStr = String(val);
                            if (typeof val === 'number') {
                              if (isTemp) valStr += ' °C';
                              else if (isHumid) valStr += ' %';
                            }

                            return (
                              <div key={`${p.pointKey}-${val}`} className="point-card animate-card-update">
                                <div className="card-top">
                                  <div className="card-info">
                                    <h5 className="point-title">{p.name}</h5>
                                    <span className="point-address">{p.address || 'No Address'}</span>
                                  </div>
                                  <div className="card-badges">
                                    <span className="online-tag">
                                      <span className="pulse-dot-small bg-emerald-400"></span>
                                      Online
                                    </span>
                                  </div>
                                </div>

                                <div className="card-bottom">
                                  <div className="value-display">
                                    {isStatus ? (
                                      <span className={`status-pill ${val === 'RUNNING' || val === 'ON' || val === 'AUTO' ? 'on' : 'off'}`}>
                                        {valStr}
                                      </span>
                                    ) : (
                                      <span className="value-numeric">{valStr}</span>
                                    )}
                                  </div>

                                  {!isStatus && trend !== 'stable' && (
                                    <div className={`trend-badge ${trend}`}>
                                      {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : selectedSystem ? (
                    <div className="telemetry-section animate-fade-in">

                      {/* Telemetry Header Banner */}
                      <div className="telemetry-banner banner-system">
                        <div className="banner-details">
                          <h4 className="banner-title">
                            <Layers size={22} className="banner-icon icon-secondary" />
                            {selectedSystem.name} System Telemetry
                          </h4>
                          <div className="banner-metadata">
                            <span className="meta-badge">Type: System Loop</span>
                            <span className="meta-badge">Location: {selectedLocationData.locationName}</span>
                          </div>
                          {selectedSystem.description && (
                            <p className="banner-description">{selectedSystem.description}</p>
                          )}
                        </div>
                        <div className="banner-status">
                          <span className="pulse-dot bg-emerald-500"></span>
                          <span className="status-label">LIVE STREAM</span>
                        </div>
                      </div>

                      {/* Points Grid */}
                      {activePoints.length === 0 ? (
                        <div className="empty-points-panel">
                          <Activity size={32} className="text-slate-300 animate-pulse" />
                          <div>
                            <p className="empty-title">No associated system points</p>
                            <p className="empty-subtitle">
                              This control system loop contains no points. Map points via System configs.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="points-grid">
                          {activePoints.map((p) => {
                            const sim = simulatedValues[p.pointKey!];
                            const val = sim ? sim.value : '--';
                            const trend = sim ? sim.trend : 'stable';

                            const isTemp = p.name.toLowerCase().includes('temp') || (p.address || '').toLowerCase().includes('temp');
                            const isHumid = p.name.toLowerCase().includes('humid') || (p.address || '').toLowerCase().includes('humid');
                            const isStatus = p.name.toLowerCase().includes('status') || p.name.toLowerCase().includes('run') || p.name.toLowerCase().includes('state') || p.name.toLowerCase().includes('mode') || p.name.toLowerCase().includes('enable');

                            let valStr = String(val);
                            if (typeof val === 'number') {
                              if (isTemp) valStr += ' °C';
                              else if (isHumid) valStr += ' %';
                            }

                            const sourceEq = allEquipment.find(eq => eq.equipmentKey === p.equipmentKey)?.name || 'Equipment';

                            return (
                              <div key={`${p.pointKey}-${val}`} className="point-card system-point animate-card-update">
                                <div className="card-top">
                                  <div className="card-info">
                                    <h5 className="point-title">{p.name}</h5>
                                    <span className="point-source-device">Source: {sourceEq}</span>
                                    <span className="point-address">{p.address || 'No Address'}</span>
                                  </div>
                                  <div className="card-badges">
                                    <span className="online-tag">
                                      <span className="pulse-dot-small bg-emerald-400"></span>
                                      Online
                                    </span>
                                  </div>
                                </div>

                                <div className="card-bottom">
                                  <div className="value-display">
                                    {isStatus ? (
                                      <span className={`status-pill ${val === 'RUNNING' || val === 'ON' || val === 'AUTO' ? 'on' : 'off'}`}>
                                        {valStr}
                                      </span>
                                    ) : (
                                      <span className="value-numeric">{valStr}</span>
                                    )}
                                  </div>

                                  {!isStatus && trend !== 'stable' && (
                                    <div className={`trend-badge ${trend}`}>
                                      {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Dashboard Default State (Location Selected, No Element Selected)
                    <div className="empty-selection-placeholder">
                      <Cpu size={56} className="text-primary-400 animate-bounce" />
                      <h4>Select an Asset or System</h4>
                      <p>
                        Explore the structural hierarchy nodes of {selectedLocationData.locationName} using the Navigator on the left. Click on any equipment or system loop to monitor its telemetry tags.
                      </p>
                    </div>
                  )}

                </div>
              ) : (
                // Initial State: No Location Selected
                <div className="empty-location-placeholder animate-pulse">
                  <MapPin size={56} className="text-slate-300" />
                  <h4>Select structural location context</h4>
                  <p>
                    Choose a physical location branch from the Structural Tree view on the right to navigate its control nodes.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right Column: Location Hierarchical Navigation Tree */}
        <aside className="panel location-navigator">
          <h3>Location Hierarchy</h3>
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
