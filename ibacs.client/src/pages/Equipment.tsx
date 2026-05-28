import { useEffect, useState } from 'react';
// Change this line to point to your api folder
import { getAllEquipment, Equipment } from '../api/equipmentServices'; 

const Equipment = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]); // Use the interface directly
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllEquipment()
      .then((data) => {
        setEquipments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading equipment", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading equipment...</div>;

  return (
    <div>
      <h1>Equipment List</h1>
      {equipments.length === 0 ? (
        <p>No equipment found.</p>
      ) : (
        <ul>
          {equipments.map((e) => (
            <li key={e.equipmentKey}>{e.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Equipment;