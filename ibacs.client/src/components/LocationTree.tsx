import React, { useState, useMemo } from 'react';

export interface LocationItem {
  locationKey?: number;
  location_key?: number;
  LocationKey?: number;
  
  locationName?: string;
  location_name?: string;
  LocationName?: string;
  
  fullName?: string;
  full_name?: string;
  FullName?: string;
  
  parentLocationKey?: number | null;
  parent_location_key?: number | null;
  ParentLocationKey?: number | null;
}

interface StandardizedNode {
  key: number;
  name: string;
  fullName: string;
  parentKey: number | null;
  children: StandardizedNode[];
}

interface LocationTreeProps {
  items: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const buildRobustTree = (rawList: any[]): StandardizedNode[] => {
  if (!Array.isArray(rawList)) return [];

  const itemMap = new Map<number, StandardizedNode>();
  const roots: StandardizedNode[] = [];

  rawList.forEach(item => {
    if (!item) return;
    
    const key = item.locationKey ?? item.location_key ?? item.LocationKey;
    const name = item.locationName ?? item.location_name ?? item.LocationName ?? 'Unknown';
    const fullName = item.fullName ?? item.full_name ?? item.FullName ?? name;
    const parentKey = item.parentLocationKey !== undefined ? item.parentLocationKey : (item.parent_location_key !== undefined ? item.parent_location_key : (item.ParentLocationKey !== undefined ? item.ParentLocationKey : null));


    if (key !== undefined && key !== null) {
      itemMap.set(Number(key), {
        key: Number(key),
        name: String(name),
        fullName: String(fullName),
        parentKey: parentKey ? Number(parentKey) : null,
        children: []
      });
    }
  });

  itemMap.forEach(node => {
    if (node.parentKey === null || node.parentKey === undefined || !itemMap.has(node.parentKey) || node.parentKey === node.key) {
      roots.push(node);
    } else {
      const parentNode = itemMap.get(node.parentKey);
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
};

interface RenderNodesProps {
  nodes: StandardizedNode[];
  level: number;
  selectedId: number | null;
  expandedNodes: { [key: number]: boolean };
  onToggleExpand: (id: number, e: React.MouseEvent) => void;
  onSelect: (id: number) => void;
}

const RenderNodes: React.FC<RenderNodesProps> = ({ 
  nodes, 
  level, 
  selectedId, 
  expandedNodes, 
  onToggleExpand, 
  onSelect 
}) => {
  return (
    <ul style={{ listStyleType: 'none', paddingLeft: level === 0 ? '0px' : '20px', margin: '4px 0' }}>
      {nodes.map(node => {
        const hasChildren = node.children.length > 0;
        const isExpanded = !!expandedNodes[node.key];
        const isSelected = selectedId === node.key;

        return (
          <li key={node.key} style={{ margin: '6px 0' }}>
            <div 
              onClick={() => onSelect(node.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: isSelected ? '#bae6fd' : '#f8fafc',
                border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                transition: 'all 0.15s ease',
                fontWeight: hasChildren ? '600' : '400',
                color: '#1e293b'
              }}
            >
              {hasChildren && (
                <span 
                  onClick={(e) => onToggleExpand(node.key, e)}
                  style={{ marginRight: '8px', cursor: 'pointer', fontSize: '10px', color: '#64748b', width: '12px', userSelect: 'none' }}
                >
                  {isExpanded ? '▼' : '►'}
                </span>
              )}
              
              {!hasChildren && <span style={{ width: '20px' }} />}
              <span style={{ marginRight: '8px' }}>{hasChildren ? '📁' : '📄'}</span>
              <span>{node.name}</span>
            </div>

            {hasChildren && isExpanded && (
              <RenderNodes 
                nodes={node.children}
                level={level + 1}
                selectedId={selectedId}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const LocationTree: React.FC<LocationTreeProps> = ({ items, selectedId, onSelect }) => {
  const treeData = useMemo(() => buildRobustTree(items), [items]);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: number]: boolean }>({});
    // Synchronize internal layout expansion states when external items array length changes
  React.useEffect(() => {
    setExpandedNodes(prev => {
      const nextExpanded = { ...prev };
      const currentKeys = new Set(items.map(i => i.locationKey ?? i.location_key ?? i.LocationKey));
      Object.keys(nextExpanded).forEach(key => {
        if (!currentKeys.has(Number(key))) {
          delete nextExpanded[Number(key)];
        }
      });
      return nextExpanded;
    });
  }, [items]);

  const handleToggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!items || items.length === 0) {
    return <p style={{ color: '#64748b', fontSize: '13px', padding: '10px' }}>No locations available.</p>;
  }

  return (
    <div style={{ width: '100%' }}>
      <RenderNodes 
        nodes={treeData} 
        level={0} 
        selectedId={selectedId} 
        expandedNodes={expandedNodes}
        onToggleExpand={handleToggleExpand}
        onSelect={onSelect} 
      />
    </div>
  );
};
