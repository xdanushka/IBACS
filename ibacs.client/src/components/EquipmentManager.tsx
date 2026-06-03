import React, { useState, useEffect } from 'react';

interface Equipment {
  equipmentKey: number;
  name: string;
  description: string;
  categoryName: string;
  locationName: string;
}

interface LocationItem {
  locationKey: number;
  locationName: string;
}

export const EquipmentManager: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<number>(1);

  // 🔄 Fetch equipment and locations data from backend APIs
  const fetchData = () => {
    fetch('/api/equipments')
      .then(res => res.json())
      .then(data => setEquipments(data))
      .catch(err => console.error("Error fetching equipments:", err));

    fetch('/api/locations')
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error("Error fetching locations:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ Submit the form data to register a new equipment item
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipment = { 
      name, 
      description, 
      equipmentCategoryKey: 1, // Defaulting category key configuration to 1
      locationKey: selectedLocation 
    };

    fetch('/api/equipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEquipment)
    })
    .then(() => {
      fetchData(); // Refresh the grid contents
      setName('');
      setDescription('');
    })
    .catch(err => console.error("Error adding equipment:", err));
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'Segoe UI, sans-serif' }}>
      <h3 style={{ color: '#1e293b', marginBottom: '15px', borderBottom: '2px solid #2563eb', paddingBottom: '5px', marginTop: 0 }}>🛠️ Equipment Manager</h3>
      
      {/* 📝 Input form layout for new hardware tools */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '25px', display: 'flex', gap: '12px', flexDirection: 'column', maxWidth: '350px' }}>
        <input 
          type="text" 
          placeholder="Equipment Name (e.g., Chiller 01)" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
        />
        
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Select Location Target:</label>
        <select 
          value={selectedLocation} 
          onChange={e => setSelectedLocation(Number(e.target.value))}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }}
        >
          {locations.map(loc => (
            <option key={loc.locationKey} value={loc.locationKey}>{loc.locationName}</option>
          ))}
        </select>

        <button type="submit" style={{ background: '#2563eb', color: '#fff', padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
          Save Equipment Configuration
        </button>
      </form>

      {/* 📊 Summary grid showing registered system assets */}
      <h4 style={{ color: '#475569', marginBottom: '10px' }}>📋 Registered System Equipments</h4>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', border: '1px solid #e2e8f0' }}>
        <thead>
          <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '2px solid #cbd5e1' }}>
            <th style={{ padding: '10px' }}>Equipment Name</th>
            <th style={{ padding: '10px' }}>Description</th>
            <th style={{ padding: '10px' }}>Assigned Location</th>
          </tr>
        </thead>
        <tbody>
          {equipments.length > 0 ? (
            equipments.map(eq => (
              <tr key={eq.equipmentKey} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '10px', fontWeight: '500' }}>{eq.name}</td>
                <td style={{ padding: '10px', color: '#64748b' }}>{eq.description || '-'}</td>
                <td style={{ padding: '10px' }}><span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontSize: '12px' }}>{eq.locationName}</span></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ padding: '15px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No equipment registered in the system database yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
