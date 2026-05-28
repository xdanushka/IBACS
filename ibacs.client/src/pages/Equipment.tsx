import { useEffect, useState } from 'react';
import { getAllEquipment } from '../api/equipmentServices';
import { Equipment } from '../types/Equipment';

export const EquipmentPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    getAllEquipment()
      .then((data) => {
        setEquipments(data);
        setLoading(false); // Data arrived!
      })
      .catch((err) => {
        console.error("Error loading equipment", err);
        setLoading(false);
      });
  }, []);

  // Show a loading message while waiting
  if (loading) return <div>Loading equipment...</div>;

  return (
    <div>
      <h1>Equipment List</h1>
      {equipments.length === 0 ? (
        <p>No equipment found.</p>
      ) : (
        <ul>
          {equipments.map((e) => (
            // Ensure equipmentKey is unique
            <li key={e.equipmentKey}>{e.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};