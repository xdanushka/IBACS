import React, { useState, useMemo } from 'react';
import { Building2, Layers, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';

interface TreeNode {
  locationKey: number;
  locationName: string;
  parentLocationKey: number | null;
  isFolder?: boolean;
  children: TreeNode[];
}

interface StructuralDashboardProps {
  items: any[]; 
  selectedId?: number | null;
  onSelect?: (id: number) => void; 
}

const buildDynamicTree = (flatList: any[]): TreeNode[] => {
  if (!Array.isArray(flatList) || flatList.length === 0) return [];

  const nodeMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  flatList.forEach(item => {
    if (!item) return;
    
    const rawKey = item.locationKey ?? item.location_key ?? item.LocationKey;
    const rawName = item.locationName ?? item.location_name ?? item.LocationName ?? 'Unknown';
    const rawParentKey = item.parentLocationKey ?? item.parent_location_key ?? item.ParentLocationKey ?? null;

    if (rawKey !== undefined && rawKey !== null) {
      const numericKey = Number(rawKey);
      
      if (!isNaN(numericKey)) {
        nodeMap.set(numericKey, {
          locationKey: numericKey,
          locationName: String(rawName),
          parentLocationKey: (rawParentKey === null || rawParentKey === "" || rawParentKey === "null") ? null : Number(rawParentKey),
          isFolder: item.isFolder !== undefined ? !!item.isFolder : true,
          children: []
        });
      }
    }
  });

  nodeMap.forEach(node => {
    const parent = node.parentLocationKey;
    if (parent === null || parent === undefined || !nodeMap.has(Number(parent)) || Number(parent) === node.locationKey) {
      roots.push(node);
    } else {
      const parentNode = nodeMap.get(Number(parent));
      if (parentNode) {
        parentNode.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
};

interface RenderBranchProps {
  nodes: TreeNode[];
  level: number;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
  expandedNodes: { [key: number]: boolean };
  onToggleExpand: (id: number) => void;
  onSelectLocation?: (id: number) => void; 
}

const RenderBranch: React.FC<RenderBranchProps> = ({
  nodes,
  level,
  selectedId,
  onSelect,
  expandedNodes,
  onToggleExpand,
  onSelectLocation 
}) => {
  return (
    <>
      {nodes.map(node => {
        const hasChildren = node.children.length > 0;
        const isExpanded = !!expandedNodes[node.locationKey];
        const isSelected = selectedId === node.locationKey;

        if (hasChildren) {
          return (
            <div key={node.locationKey} className="tree-group">
              <div 
                className="tree-group-header"
                style={isSelected ? { backgroundColor: '#eff6ff' } : {}}
                onClick={() => {
                  if (onSelect) onSelect(node.locationKey);
                  onToggleExpand(node.locationKey);
                  if (onSelectLocation) onSelectLocation(node.locationKey);
                }}
              >
                <div className="tree-chevron">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                {level === 0 ? <Building2 size={14} className="tree-icon icon-blue" /> : <Layers size={14} className="tree-icon icon-yellow" />}
                <span className="tree-group-title" style={{ color: isSelected ? '#1d4ed8' : '#334155', fontWeight: isSelected ? 800 : 700 }}>
                  {node.locationName}
                </span>
              </div>
              {isExpanded && (
                <div className="tree-leaves">
                  <RenderBranch
                    nodes={node.children}
                    level={level + 1}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    expandedNodes={expandedNodes}
                    onToggleExpand={onToggleExpand}
                    onSelectLocation={onSelectLocation} 
                  />
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div 
              key={node.locationKey} 
              className={`tree-leaf ${isSelected ? 'active' : ''}`}
              onClick={() => {
                if (onSelect) onSelect(node.locationKey);
                if (onSelectLocation) onSelectLocation(node.locationKey);
              }}
            >
              <LayoutGrid size={12} className="tree-leaf-icon" />
              <span className="tree-leaf-name">{node.locationName}</span>
            </div>
          );
        }
      })}
    </>
  );
};

const StructuralDashboard: React.FC<StructuralDashboardProps> = ({ items, selectedId, onSelect }) => {
  // Recalculate component tree parameters safely upon any raw element dependency changes
  const treeData = useMemo(() => buildDynamicTree(items), [items]);
  
  const [expandedNodes, setExpandedNodes] = useState<{ [key: number]: boolean }>({
    1: true, 
    3: true  
  });

  const handleToggleExpand = (id: number) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!treeData || treeData.length === 0) {
    return (
      <p className="no-data-text">
        No locations configured in your database infrastructure setup yet.
      </p>
    );
  }

  return (
    <div className="navigator-tree">
      <RenderBranch
        nodes={treeData}
        level={0}
        selectedId={selectedId}
        onSelect={onSelect}
        expandedNodes={expandedNodes}
        onToggleExpand={handleToggleExpand}
        onSelectLocation={onSelect} 
      />
    </div>
  );
};

export default StructuralDashboard;
