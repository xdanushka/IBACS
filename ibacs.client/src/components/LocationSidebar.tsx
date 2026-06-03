import React, { useEffect, useState } from 'react';

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

export const LocationSidebar: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  /*
  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error('Error fetching locations:', err));
  }, []);
*/
  
  const handleLocationClick = (locationKey: number) => {
    setSelectedLocation(locationKey);
    fetch(`/api/locations/${locationKey}/systems`)
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error('Error fetching systems:', err));
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      
      <div style={{ width: '280px', borderRight: '1px solid #e0e0e0', paddingRight: '15px' }}>
        <h4 style={{ color: '#007bff', marginBottom: '15px' }}>🏢 Locations</h4>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {locations.map((loc) => (
            <li
              key={loc.locationKey}
              onClick={() => handleLocationClick(loc.locationKey)}
              style={{
                cursor: 'pointer',
                padding: '8px 12px',
                marginBottom: '6px',
                borderRadius: '4px',
                backgroundColor: selectedLocation === loc.locationKey ? '#e6f7ff' : '#f8f9fa',
                fontWeight: selectedLocation === loc.locationKey ? '600' : 'normal',
                color: selectedLocation === loc.locationKey ? '#007bff' : '#333',
                borderLeft: selectedLocation === loc.locationKey ? '4px solid #007bff' : '4px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {loc.fullName}
            </li>
          ))}
        </ul>
      </div>

    
      <div style={{ flex: 1 }}>
        <h4 style={{ color: '#28a745', marginBottom: '15px' }}>⚙️ Available Systems</h4>
        {selectedLocation === null ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>කරුණාකර පද්ධති (Systems) බැලීමට ස්ථානයක් තෝරන්න.</p>
        ) : systems.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
            {systems.map((sys) => (
              <div
                key={sys.systemKey}
                style={{
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                  fontWeight: '500'
                }}
              >
                {sys.name}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#dc3545' }}>මෙම ස්ථානය සඳහා පද්ධති කිසිවක් සම්බන්ධ කර නැත.</p>
        )}
      </div>

    </div>
  );
};
