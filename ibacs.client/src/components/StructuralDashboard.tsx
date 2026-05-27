import React, { useState } from 'react';
import { Building2, Layers, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';

const StructuralDashboard = () => {
  // 📍 Tracks the currently highlighted node across the navigation panel (Defaults to '2nd Floor')
  const [activeItem, setActiveItem] = useState<string>('2nd Floor');

  // 📍 Tracks which high-level building branch container layout is explicitly open
  const [openBuilding, setOpenBuilding] = useState<string | null>('Building 01');
  
  // 📍 Tracks which specific floor tier sub-branch is explicitly open
  const [openFloor, setOpenFloor] = useState<string | null>('2nd Floor');

  // 🎨 Unified theme configurations and responsive layout properties
  const styles = {
    itemBase: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', width: '100%', boxSizing: 'border-box' as const, fontWeight: '500' },
    
    // Core structural identity color mapping states
    buildingBg: { background: '#2563eb', color: '#ffffff', width: '100%' },
    floorBg: { marginLeft: '16px', padding: '8px', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', width: 'calc(100% - 16px)' },
    spaceBg: { marginLeft: '32px', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '12px', width: 'calc(100% - 32px)' },
    basementBg: { marginLeft: '16px', padding: '8px', background: '#334155', color: '#cbd5e1', border: '1px solid #475569', width: 'calc(100% - 16px)' },

    // Fallback baseline icon color metrics
    floorIconDefault: '#60a5fa',
    basementIconDefault: '#94a3b8',

    // Solid Golden Yellow Active Theme configuration override matrix
    activeBoxTheme: { background: '#f59e0b', color: '#0f172a', fontWeight: '600', border: '1px solid transparent', boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }
  };

  // 🔄 Handles building switches and explicitly resets lower-tier sub-menus
  const handleBuildingClick = (buildingName: string) => {
    setActiveItem(buildingName);
    if (openBuilding === buildingName) {
      setOpenBuilding(null);
      setOpenFloor(null);
    } else {
      setOpenBuilding(buildingName);
      setOpenFloor(null); 
    }
  };

  // 🔄 Handles floor clicks and isolates internal subspace menu updates
  const handleFloorClick = (floorName: string) => {
    setActiveItem(floorName);
    setOpenFloor(openFloor === floorName ? null : floorName);
  };

  return (
    <div style={{ padding: '12px', background: '#1e293b', color: '#f8fafc', borderRadius: '12px', fontFamily: 'sans-serif', border: '1px solid #334155', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        
        {/* === BUILDING 01 CORE TIER === */}
        <div 
          style={{ ...styles.itemBase, ...(activeItem === 'Building 01' ? { ...styles.activeBoxTheme, width: styles.buildingBg.width } : styles.buildingBg) }}
          onClick={() => handleBuildingClick('Building 01')}
        >
          <Building2 size={18} style={{ flexShrink: 0 }} />
          <span>Building 01</span>
          {/* 🌟 Dynamic Arrow indicator to hint that this branch has nested items */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {openBuilding === 'Building 01' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        </div>

        {/* Dynamic Nested Tiers: Renders floors only if Building 01 is currently open */}
        {openBuilding === 'Building 01' && (
          <>
            {/* 3rd Floor Tier */}
            <div 
              style={{ ...styles.itemBase, ...(activeItem === '3rd Floor' ? { ...styles.activeBoxTheme, marginLeft: styles.floorBg.marginLeft, width: styles.floorBg.width } : styles.floorBg) }}
              onClick={() => setActiveItem('3rd Floor')}
            >
              <Layers size={16} style={{ flexShrink: 0, color: activeItem === '3rd Floor' ? 'inherit' : styles.floorIconDefault }} />
              <span>3rd Floor</span>
            </div>

            {/* 2nd Floor Tier */}
            <div 
              style={{ ...styles.itemBase, ...(activeItem === '2nd Floor' ? { ...styles.activeBoxTheme, marginLeft: styles.floorBg.marginLeft, width: styles.floorBg.width } : styles.floorBg) }}
              onClick={() => handleFloorClick('2nd Floor')}
            >
              <Layers size={16} style={{ flexShrink: 0, color: activeItem === '2nd Floor' ? 'inherit' : styles.floorIconDefault }} />
              <span>2nd Floor</span>
              {/* 🌟 Dynamic Arrow indicator for sub-spaces inside 2nd floor */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                {openFloor === '2nd Floor' ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
            </div>

            {/* Dynamic Nested Subspaces: Renders spaces only if 2nd Floor is currently open */}
            {openFloor === '2nd Floor' && (
              <>
                <div 
                  style={{ ...styles.itemBase, ...(activeItem === 'Space 01' ? { ...styles.activeBoxTheme, marginLeft: styles.spaceBg.marginLeft, width: styles.spaceBg.width } : styles.spaceBg) }}
                  onClick={() => setActiveItem('Space 01')}
                >
                  <LayoutGrid size={14} style={{ flexShrink: 0 }} />
                  <span>Space 01</span>
                </div>

                <div 
                  style={{ ...styles.itemBase, ...(activeItem === 'Space 02' ? { ...styles.activeBoxTheme, marginLeft: styles.spaceBg.marginLeft, width: styles.spaceBg.width } : styles.spaceBg) }}
                  onClick={() => setActiveItem('Space 02')}
                >
                  <LayoutGrid size={14} style={{ flexShrink: 0 }} />
                  <span>Space 02</span>
                </div>
              </>
            )}

            {/* 1st Floor Tier */}
            <div 
              style={{ ...styles.itemBase, ...(activeItem === '1st Floor' ? { ...styles.activeBoxTheme, marginLeft: styles.floorBg.marginLeft, width: styles.floorBg.width } : styles.floorBg) }}
              onClick={() => setActiveItem('1st Floor')}
            >
              <Layers size={16} style={{ flexShrink: 0, color: activeItem === '1st Floor' ? 'inherit' : styles.floorIconDefault }} />
              <span>1st Floor</span>
            </div>

            {/* Basement Infrastructure Levels (B_01) */}
            <div 
              style={{ ...styles.itemBase, ...(activeItem === 'B_01 Floor' ? { ...styles.activeBoxTheme, marginLeft: styles.basementBg.marginLeft, width: styles.basementBg.width } : styles.basementBg) }}
              onClick={() => setActiveItem('B_01 Floor')}
            >
              <ChevronDown size={16} style={{ flexShrink: 0, color: activeItem === 'B_01 Floor' ? 'inherit' : styles.basementIconDefault }} />
              <span>B_01 Floor</span>
            </div>

            {/* Basement Infrastructure Levels (B_02) */}
            <div 
              style={{ ...styles.itemBase, ...(activeItem === 'B_02 Floor' ? { ...styles.activeBoxTheme, marginLeft: styles.basementBg.marginLeft, width: styles.basementBg.width } : styles.basementBg) }}
              onClick={() => setActiveItem('B_02 Floor')}
            >
              <ChevronDown size={16} style={{ flexShrink: 0, color: activeItem === 'B_02 Floor' ? 'inherit' : styles.basementIconDefault }} />
              <span>B_02 Floor</span>
            </div>
          </>
        )}

        {/* === BUILDING 02 CORE TIER === */}
        <div 
          style={{ ...styles.itemBase, ...(activeItem === 'Building 02' ? { ...styles.activeBoxTheme, width: styles.buildingBg.width } : styles.buildingBg), marginTop: '16px' }}
          onClick={() => handleBuildingClick('Building 02')}
        >
          <Building2 size={18} style={{ flexShrink: 0 }} />
          <span>Building 02</span>
          {/* 💡 Chevron visibility removed completely because Building 02 is empty */}
        </div>
        {openBuilding === 'Building 02' && (
          <div style={{ marginLeft: '16px', fontSize: '13px', color: '#94a3b8', padding: '6px' }}>No floors mapped for Building 02.</div>
        )}

        {/* === BUILDING 03 CORE TIER === */}
        <div 
          style={{ ...styles.itemBase, ...(activeItem === 'Building 03' ? { ...styles.activeBoxTheme, width: styles.buildingBg.width } : styles.buildingBg) }}
          onClick={() => handleBuildingClick('Building 03')}
        >
          <Building2 size={18} style={{ flexShrink: 0 }} />
          <span>Building 03</span>
          {/* 💡 Chevron visibility removed completely because Building 03 is empty */}
        </div>
        {openBuilding === 'Building 03' && (
          <div style={{ marginLeft: '16px', fontSize: '13px', color: '#94a3b8', padding: '6px' }}>No floors mapped for Building 03.</div>
        )}

      </div>
    </div>
  );
};

export default StructuralDashboard;
