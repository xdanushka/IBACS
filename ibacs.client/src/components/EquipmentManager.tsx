import React, { useState, useEffect } from 'react';

interface Equipment {
  equipmentKey: number;
  name: string;
  description: string;
  categoryName: string;
  locationName: string;
}

interface EquipmentManagerProps {
  selectedLocationId?: number; 
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({ selectedLocationId }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch filtered equipment data from backend based on selected location parameter
  const fetchEquipmentsData = () => {
    if (selectedLocationId) {
      setLoading(true);
      fetch(`/api/equipments/by-location/${selectedLocationId}`)
        .then(res => res.json())
        .then(data => {
          setEquipments(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching equipments:", err);
          setLoading(false);
        });
    } else {
      setEquipments([]);
    }
  };

  // Synchronize internal system view data table grid upon structural node click mutations
  useEffect(() => {
    fetchEquipmentsData();
  }, [selectedLocationId]);

  return (
    <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Live Equipment Table Grid View Area */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
        <h4 style={{ color: '#0f172a', margin: 0, fontSize: '15px', fontWeight: '600' }}>Live System Equipments</h4>
      </div>
      
      <div style={{ padding: '20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', margin: '10px 0' }}>Loading live equipment data from database...</p>
        ) : !selectedLocationId ? (
          <p style={{ textAlign: 'center', color: '#e11d48', fontWeight: '500', margin: '10px 0' }}>Please select a location from the right panel to view live equipment data.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', color: '#334155', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '10px' }}>Equipment Name</th>
                <th style={{ padding: '10px' }}>Category</th>
                <th style={{ padding: '10px' }}>Description</th>
                <th style={{ padding: '10px' }}>Assigned Location</th>
              </tr>
            </thead>
            <tbody>
              {equipments.length > 0 ? (
                equipments.map(eq => (
                  <tr key={eq.equipmentKey} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px', fontWeight: '500' }}>{eq.name}</td>
                    <td style={{ padding: '10px', color: '#1e293b', fontWeight: '500' }}>{eq.categoryName}</td>
                    <td style={{ padding: '10px', color: '#64748b' }}>{eq.description || '-'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '12px', fontSize: '12px' }}>
                        {eq.locationName}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '15px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No equipment registered for this location yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
