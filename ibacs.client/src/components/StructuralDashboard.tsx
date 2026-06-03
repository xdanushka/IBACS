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
  items: any[]; // Changed to any[] to safely intercept dynamic string/numeric types from parent props
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

// 🔄 Highly robust helper function to safely map parent-child nodes regardless of string/number type mismatches
const buildDynamicTree = (flatList: any[]): TreeNode[] => {
  if (!Array.isArray(flatList) || flatList.length === 0) return [];

  const nodeMap = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // Step 1: Normalize properties and register every item into the map cache using numeric keys
  flatList.forEach(item => {
    if (!item) return;
    
    // Fallback extraction support for various database casing schemas
    const rawKey = item.locationKey ?? item.location_key ?? item.LocationKey;
    const rawName = item.locationName ?? item.location_name ?? item.LocationName ?? 'Unknown';
    const rawParentKey = item.parentLocationKey ?? item.parent_location_key ?? item.ParentLocationKey ?? null;

    if (rawKey !== undefined && rawKey !== null) {
      const numericKey = Number(rawKey);
      
      // Handle option value conversion failures safely
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

  // Step 2: Dynamically link child nodes onto parent structural reference parameters
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
  activeItem: string;
  setActiveItem: (name: string) => void;
  expandedNodes: { [key: number]: boolean };
  onToggleExpand: (id: number) => void;
}

// 📦 Recursive component to dynamically map UI rendering branches based on nested data layouts
const RenderBranch: React.FC<RenderBranchProps> = ({
  nodes,
  level,
  activeItem,
  setActiveItem,
  expandedNodes,
  onToggleExpand
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
        const isSelected = activeItem?.toLowerCase() === node.locationName?.toLowerCase();

        return (
          <div key={node.locationKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            <div
              style={getStylesByLevel(level, isSelected)}
              onClick={() => {
                setActiveItem(node.locationName);
                if (hasChildren) onToggleExpand(node.locationKey);
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
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                expandedNodes={expandedNodes}
                onToggleExpand={onToggleExpand}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const StructuralDashboard: React.FC<StructuralDashboardProps> = ({ items }) => {
  // Recalculate component tree parameters safely upon any raw element dependency changes
  const treeData = useMemo(() => buildDynamicTree(items), [items]);
  
  const [activeItem, setActiveItem] = useState<string>('2nd floor');
  const [expandedNodes, setExpandedNodes] = useState<{ [key: number]: boolean }>({
    1: true, 
    3: true  
  });

  const handleToggleExpand = (id: number) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Safe validation step to check if parsed hierarchy roots actually populated
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
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    </div>
  );
};

export default StructuralDashboard;
