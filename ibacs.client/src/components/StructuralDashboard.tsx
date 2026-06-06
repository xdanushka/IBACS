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
  const getStylesByLevel = (currentLevel: number, isSelected: boolean) => {
    const isRoot = currentLevel === 0;
    const isSubTier = currentLevel === 1;

    let background = 'rgba(16, 185, 129, 0.1)'; 
    let color = '#34d399';
    let border = '1px solid rgba(16, 185, 129, 0.2)';
    let marginLeft = '32px';
    let fontSize = '12px';

    if (isRoot) {
      background = '#2563eb'; 
      color = '#ffffff';
      border = '1px solid transparent';
      marginLeft = '0px';
      fontSize = '14px';
    } else if (isSubTier) {
      background = 'rgba(59, 130, 246, 0.2)'; 
      color = '#93c5fd';
      border = '1px solid rgba(59, 130, 246, 0.3)';
      marginLeft = '16px';
      fontSize = '14px';
    }

    if (isSelected) {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: isRoot ? '10px' : '8px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxSizing: 'border-box' as const,
        fontWeight: '600',
        background: '#f59e0b',
        color: '#0f172a',
        border: '1px solid transparent',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
        marginLeft,
        fontSize,
        width: isRoot ? '100%' : `calc(100% - ${marginLeft})`
      };
    }

    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: isRoot ? '10px' : '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxSizing: 'border-box' as const,
      fontWeight: '500',
      background,
      color,
      border,
      marginLeft,
      fontSize,
      width: isRoot ? '100%' : `calc(100% - ${marginLeft})`
    };
  };

  return (
    <>
      {nodes.map(node => {
        const hasChildren = node.children.length > 0;
        const isExpanded = !!expandedNodes[node.locationKey];
        const isSelected = selectedId === node.locationKey;

        return (
          <div key={node.locationKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            <div
              style={getStylesByLevel(level, isSelected)}
              onClick={() => {
                if (onSelect) onSelect(node.locationKey);
                if (hasChildren) onToggleExpand(node.locationKey);
                
                // ⚡ Click කරපු Location Key එක මෙතනින් උඩට යවනවා
                if (onSelectLocation) {
                  onSelectLocation(node.locationKey);
                }
              }}
            >
              {level === 0 ? (
                <Building2 size={18} style={{ flexShrink: 0 }} />
              ) : hasChildren ? (
                <Layers size={16} style={{ flexShrink: 0, color: isSelected ? 'inherit' : '#60a5fa' }} />
              ) : (
                <LayoutGrid size={14} style={{ flexShrink: 0 }} />
              )}

              <span>{node.locationName}</span>

              {hasChildren && (
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                  {isExpanded ? <ChevronDown size={level === 0 ? 16 : 14} /> : <ChevronRight size={level === 0 ? 16 : 14} />}
                </div>
              )}
            </div>

            {hasChildren && isExpanded && (
              <RenderBranch
                nodes={node.children}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
                onSelectLocation={onSelectLocation} 
              />
            )}
          </div>
        );
      })}
    </>
  );
};

<<<<<<< HEAD
const StructuralDashboard: React.FC<StructuralDashboardProps> = ({ items, selectedId, onSelect }) => {
  // Recalculate component tree parameters safely upon any raw element dependency changes
=======
const StructuralDashboard: React.FC<StructuralDashboardProps> = ({ items, onSelect }) => {
>>>>>>> db1b63aa1534242097fd337214f0adc66d40ab64
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
      <div style={{ padding: '20px', background: '#1e293b', color: '#94a3b8', borderRadius: '12px', fontSize: '13px', textAlign: 'center' }}>
        No locations configured in your database infrastructure setup yet.
      </div>
    );
  }

  return (
    <div style={{ padding: '12px', background: '#1e293b', color: '#f8fafc', borderRadius: '12px', fontFamily: 'sans-serif', border: '1px solid #334155', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
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
    </div>
  );
};

export default StructuralDashboard;
