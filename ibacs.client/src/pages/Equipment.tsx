import { useEffect, useState } from 'react';
import { getAllEquipment } from '../api/equipmentServices';
import { Equipment } from '../types/Equipment';

export const EquipmentPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  useEffect(() => {
    // Call the service you just created
    getAllEquipment().then((data) => {
      setEquipments(data);
    }).catch(err => console.error("Error loading equipment", err));
  }, []);

  return (
    <div>
      <h1>Equipment List</h1>
      <ul>
        {equipments.map((e) => (
          <li key={e.equipmentKey}>{e.name}</li>
        ))}
      </ul>
    </div>
  );
};