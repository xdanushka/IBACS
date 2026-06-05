import { useState, useEffect } from 'react';
import { Cpu, MapPin, Info, Trash2, Edit3, MoreVertical, ChevronDown, ChevronRight, Plus, X, Check, Activity } from 'lucide-react';
import { type SystemModel } from '../api/systemService';
import systemService from '../api/systemService';
import { getAllPoints, type Point, type Equipment } from '../api/equipmentApi';
import { Button } from './UI/Button';

interface SystemTableProps {
  systems: SystemModel[];
  loading: boolean;
  onEdit: (system: SystemModel) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

const SystemTable = ({ systems, loading, onEdit, onDelete, onRefresh }: SystemTableProps) => {
  const [expandedSystems, setExpandedSystems] = useState<Record<number, boolean>>({});
  const [allPoints, setAllPoints] = useState<(Point & { equipment?: Equipment })[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<Record<number, string>>({}); // systemKey -> pointKey string
  const [associatingSystemKey, setAssociatingSystemKey] = useState<number | null>(null);

  // Fetch all equipment points once
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getAllPoints();
        setAllPoints(data);
      } catch (err) {
        console.error('Failed to fetch equipment points:', err);
      }
    };
    fetchPoints();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedSystems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAssociatePoint = async (systemKey: number) => {
    const pointKeyStr = selectedPoints[systemKey];
    if (!pointKeyStr) {
      alert('Please select a point to associate.');
      return;
    }

    const pointKey = parseInt(pointKeyStr, 10);
    setAssociatingSystemKey(systemKey);

    try {
      await systemService.associatePoint(systemKey, pointKey);
      // Clear selection
      setSelectedPoints(prev => ({ ...prev, [systemKey]: '' }));
      if (onRefresh) onRefresh();
    } catch (err: any) {
      console.error('Failed to associate point:', err);
      alert(err.response?.data?.message || 'Failed to associate point.');
    } finally {
      setAssociatingSystemKey(null);
    }
  };

  const handleDisassociatePoint = async (sysPointKey: number) => {
    if (!window.confirm('Are you sure you want to remove this point from the system?')) return;

    try {
      await systemService.disassociatePoint(sysPointKey);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to disassociate point:', err);
      alert('Failed to disassociate point.');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 animate-pulse transition-all">
        <div className="bg-primary-100 p-3 rounded-full">
          <Cpu className="text-primary-500 animate-pulse" size={32} />
        </div>
        <p className="text-slate-500 font-medium">Loading automation systems...</p>
      </div>
    );
  }

  if (systems.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 p-4 rounded-full border border-slate-100 text-slate-300">
          <Cpu size={48} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">No systems found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-[300px]">Add your first system to start mapping and organizing control points.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 group/table transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="w-12 px-4 py-4"></th>
              <th className="px-6 py-4">System Name</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Control Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {systems.map((system) => {
              const isExpanded = !!expandedSystems[system.systemKey!];
              const associatedPointKeys = new Set(system.systemPoints?.map(sp => sp.pointKey) || []);
              const availablePoints = allPoints.filter(p => p.pointKey && !associatedPointKeys.has(p.pointKey));

              return (
                <>
                  <tr
                    key={system.systemKey}
                    className="group hover:bg-primary-50/30 transition-all duration-200 cursor-default"
                  >
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleExpand(system.systemKey!)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown size={16} strokeWidth={2.5} />
                        ) : (
                          <ChevronRight size={16} strokeWidth={2.5} />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <Cpu size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">{system.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
                        <MapPin size={12} className="text-slate-400" />
                        <span>
                          {system.location?.locationName || `Location ${system.locationKey}`}
                          {system.location?.fullName && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {system.location.fullName}
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-500 font-medium block truncate max-w-[250px]" title={system.description || ''}>
                        {system.description || <span className="text-slate-300 italic">No description</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-slate-100 font-semibold text-slate-700 min-w-8">
                        {system.systemPoints?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-8 flex items-center justify-end">
                        {/* Hover Actions */}
                        <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            onClick={() => onEdit(system)}
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => onDelete(system.systemKey!)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {/* Default Icon */}
                        <div className="text-slate-300 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 transition-all duration-300">
                          <MoreVertical size={16} />
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row for System Points mapping */}
                  {isExpanded && (
                    <tr className="bg-slate-50/40 border-b border-slate-100">
                      <td colSpan={6} className="px-8 py-6">
                        <div className="bg-slate-50/70 border border-slate-200/85 rounded-xl p-5 space-y-4 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                              <h4 className="text-sm font-bold text-slate-800">
                                Associated Equipment Points for {system.name}
                              </h4>
                            </div>
                          </div>

                          {/* Association Form */}
                          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-end gap-3 shadow-md shadow-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex-1 w-full space-y-1 text-left">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Existing Equipment Point</label>
                              <select
                                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 outline-none transition-all bg-white"
                                value={selectedPoints[system.systemKey!] || ''}
                                onChange={(e) => setSelectedPoints(prev => ({ ...prev, [system.systemKey!]: e.target.value }))}
                              >
                                <option value="">-- Choose a point --</option>
                                {availablePoints.map(p => {
                                  const eqName = p.equipment?.name || `Equipment ${p.equipmentKey}`;
                                  const addrStr = p.address ? ` (${p.address})` : '';
                                  return (
                                    <option key={p.pointKey} value={p.pointKey}>
                                      {eqName} - {p.name}{addrStr}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <Button
                              className="h-10 px-4 font-bold text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg w-full md:w-auto border-0 shadow-lg shadow-primary-100 flex items-center justify-center gap-1.5"
                              onClick={() => handleAssociatePoint(system.systemKey!)}
                              disabled={associatingSystemKey === system.systemKey || !selectedPoints[system.systemKey!]}
                            >
                              <Plus size={14} strokeWidth={2.5} />
                              Associate Point
                            </Button>
                          </div>

                          {/* Associated Points List */}
                          {!system.systemPoints || system.systemPoints.length === 0 ? (
                            <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                              <p className="text-xs text-slate-400 font-semibold">No equipment points associated with this system.</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Use the selector above to link existing equipment points to this automation system.</p>
                            </div>
                          ) : (
                            <div className="overflow-hidden bg-white border border-slate-200/60 rounded-xl">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-5 py-2.5">Point Name</th>
                                    <th className="px-5 py-2.5">Source Equipment</th>
                                    <th className="px-5 py-2.5">Address</th>
                                    <th className="px-5 py-2.5 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                  {system.systemPoints.map((sp) => (
                                    <tr key={sp.sysPointKey} className="hover:bg-slate-50/40 transition-colors">
                                      <td className="px-5 py-3 text-slate-800 font-bold flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                        {sp.point?.name || `Point ${sp.pointKey}`}
                                      </td>
                                      <td className="px-5 py-3 text-slate-500 font-medium">
                                        {allPoints.find(ap => ap.pointKey === sp.pointKey)?.equipment?.name || 'Unknown Equipment'}
                                      </td>
                                      <td className="px-5 py-3">
                                        <span className="font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">
                                          {sp.point?.address || 'No Address'}
                                        </span>
                                      </td>
                                      <td className="px-5 py-3 text-right">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                          onClick={() => handleDisassociatePoint(sp.sysPointKey!)}
                                        >
                                          <Trash2 size={12} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <p>Showing {systems.length} systems in control network</p>
        <div className="flex items-center gap-2">
          <Info size={12} />
          <span>Systems link physical points to hierarchy locations</span>
        </div>
      </div>
    </div>
  );
};

export default SystemTable;
