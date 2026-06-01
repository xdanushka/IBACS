import React, { useState } from 'react';
import LocationTable from './LocationTable';
import StructuralDashboard from './StructuralDashboard'; 


export const LocationManagerPage = () => {
  // 1. Centralized state storage pre-populated with your complete hierarchical layout
  const [locations, setLocations] = useState<any[]>([
    // Building 01 Root & Sub-levels
    { locationKey: 1, locationName: "Building 01", parentLocationKey: null },
    { locationKey: 2, locationName: "3rd floor", parentLocationKey: 1 },
    { locationKey: 3, locationName: "2nd floor", parentLocationKey: 1 },
    
    // Space elements nested beneath 2nd floor (Key: 3)
    { locationKey: 4, locationName: "Space 01", parentLocationKey: 3 },
    { locationKey: 5, locationName: "Space 02", parentLocationKey: 3 },
    
    // Additional floors mapped back to Building 01 (Key: 1)
    { locationKey: 6, locationName: "1st floor", parentLocationKey: 1 },
    { locationKey: 7, locationName: "B_01 floor", parentLocationKey: 1 },
    { locationKey: 8, locationName: "B_02 floor", parentLocationKey: 1 },
    
    // Independent alternate standalone structures
    { locationKey: 9, locationName: "Building 02", parentLocationKey: null },
    { locationKey: 10, locationName: "Building 03", parentLocationKey: null }
  ]);

  // 2. Local form states capturing input values before submission
  const [newName, setNewName] = useState('');
  const [selectedParentKey, setSelectedParentKey] = useState<string>(''); 
  const [isFolder, setIsFolder] = useState<boolean>(true); 

  // 3. Orchestrator logic: intercepts form data, builds a new item, updates the main array
  const handleAddNewLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newLocationObj = {
      locationKey: Date.now(), // Temporary client-side timestamp ID
      locationName: newName,
      parentLocationKey: selectedParentKey ? Number(selectedParentKey) : null,
      isFolder: isFolder 
    };

    // Updating state instantly pushes down refreshed data props into the child StructuralDashboard
    setLocations(prev => [...prev, newLocationObj]);

    // Input fields reset
    setNewName('');
    setSelectedParentKey('');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        setLocations(prevLocations => 
          prevLocations.filter(loc => Number(loc.locationKey) !== Number(id))
        );
        alert("Location deleted successfully!");
      } catch (error) {
        console.error("Error deleting location:", error);
        alert("Failed to delete location.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Structural View Component displaying your fully customized grid dynamically */}
      <div style={{ width: '320px' }}>
        <StructuralDashboard 
          key={JSON.stringify(locations)} // 👈 Rebuilds layout and re-calculates elements upon state tracking array mutations
          items={locations} // 👈 Injects updated flat configuration properties directly down to tree node processes
          selectedId={null} 
          onSelect={() => {}} 
        />
      </div>

      {/* Child Component: Location Table with Delete functionality */}
      <div style={{ flex: 1 }}>
        <LocationTable 
          locations={locations} 
          loading={false} 
          onEdit={(loc) => console.log('Edit clicked for:', loc)} 
          onDelete={handleDelete} // Pass the delete function here
        />
      </div>

      {/* Input Component Panel: Gathers input data upward */}
      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '20px', 
        width: '350px', 
        background: '#fff' 
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Add New Location</h3>
        
        <form onSubmit={handleAddNewLocation}>
          
          {/* 1. Name Entry */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Location Name:</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., 3rd Floor or Space 3" 
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', boxSizing: 'border-box' }}
              required
            />
          </div>

          {/* 2. Parent Destination Picker */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Select Parent (Belongs To):</label>
            <select 
              value={selectedParentKey} 
              onChange={(e) => setSelectedParentKey(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
            >
              <option value="">None (Make it a Main Building)</option>
              {locations.map(loc => (
                <option key={loc.locationKey} value={loc.locationKey}>
                  {loc.locationName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Structural Flag (Folder vs Node) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: '600' }}>Location Type:</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                <input 
                  type="radio" 
                  checked={isFolder === true} 
                  onChange={() => setIsFolder(true)} 
                  style={{ marginRight: '5px' }}
                />
                Folder / Floor (📁)
              </label>
              <label style={{ cursor: 'pointer', fontSize: '14px' }}>
                <input 
                  type="radio" 
                  checked={isFolder === false} 
                  onChange={() => setIsFolder(false)} 
                  style={{ marginRight: '5px' }}
                />
                Space / End Node (📄)
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              background: '#0284c7', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Add to Tree
          </button>

        </form>
      </div>

    </div>
  );
};

export default LocationManagerPage;
