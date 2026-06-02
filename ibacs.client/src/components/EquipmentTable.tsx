import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Trash2, Edit3, MoreVertical, Layers, MapPin, Info, ChevronDown, ChevronRight, Plus, X, Check, Eye } from 'lucide-react';
import { type Equipment, type Point, createPoint, updatePoint, deletePoint } from '../api/equipmentApi';
import { Button } from './UI/Button';

interface EquipmentTableProps {
  equipment: Equipment[];
  loading: boolean;
  onEdit: (eq: Equipment) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

const EquipmentTable = ({ equipment, loading, onEdit, onDelete, onRefresh }: EquipmentTableProps) => {
  const [expandedEquipments, setExpandedEquipments] = useState<Record<number, boolean>>({});
  const [addingPointToEquipmentKey, setAddingPointToEquipmentKey] = useState<number | null>(null);
  const [editingPointKey, setEditingPointKey] = useState<number | null>(null);
  const [pointName, setPointName] = useState('');
  const [pointAddress, setPointAddress] = useState('');

  const toggleExpand = (id: number) => {
    setExpandedEquipments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startAddPoint = (equipmentKey: number) => {
    setAddingPointToEquipmentKey(equipmentKey);
    setEditingPointKey(null);
    setPointName('');
    setPointAddress('');
  };

  const startEditPoint = (point: Point) => {
    setEditingPointKey(point.pointKey!);
    setAddingPointToEquipmentKey(null);
    setPointName(point.name);
    setPointAddress(point.address || '');
  };

  const cancelAction = () => {
    setAddingPointToEquipmentKey(null);
    setEditingPointKey(null);
    setPointName('');
    setPointAddress('');
  };

  const handleSavePoint = async (equipmentKey: number) => {
    if (!pointName.trim()) {
      alert('Point name is required.');
      return;
    }

    try {
      await createPoint({
        equipmentKey,
        name: pointName,
        address: pointAddress || null
      });
      cancelAction();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to create point:', err);
      alert('Failed to save point.');
    }
  };

  const handleUpdatePoint = async (pointKey: number, equipmentKey: number) => {
    if (!pointName.trim()) {
      alert('Point name is required.');
      return;
    }

    try {
      await updatePoint(pointKey, {
        pointKey,
        equipmentKey,
        name: pointName,
        address: pointAddress || null
      });
      cancelAction();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update point:', err);
      alert('Failed to update point.');
    }
  };

  const handleDeletePoint = async (pointKey: number) => {
    if (!window.confirm('Are you sure you want to delete this point?')) return;

    try {
      await deletePoint(pointKey);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete point:', err);
      alert('Failed to delete point.');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 animate-pulse transition-all">
        <div className="bg-emerald-100 p-3 rounded-full">
          <Cpu className="text-emerald-500 animate-bounce" size={32} />
        </div>
        <p className="text-slate-500 font-medium">Loading hardware equipment...</p>
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-6 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div className="bg-slate-50 p-4 rounded-full border border-slate-100 text-slate-300">
          <Cpu size={48} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">No equipment found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-[300px]">Add your first building equipment to start monitoring system points.</p>
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
              <th className="px-6 py-4">Equipment Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map((eq) => (
              <>
                <tr
                  key={eq.equipmentKey}
                  className="group hover:bg-emerald-50/20 transition-all duration-200 cursor-default"
                >
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleExpand(eq.equipmentKey!)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors focus:outline-none cursor-pointer"
                    >
                      {expandedEquipments[eq.equipmentKey!] ? (
                        <ChevronDown size={16} strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <Cpu size={16} />
                      </div>
                      <Link 
                        to={`/equipment/${eq.equipmentKey}`} 
                        className="text-sm font-semibold text-slate-900 hover:text-emerald-600 hover:underline transition-colors cursor-pointer group-hover:translate-x-0.5 transition-transform"
                      >
                        {eq.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-white group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                      <Layers size={12} />
                      {eq.equipmentCategory?.category || `Category ${eq.equipmentCategoryKey}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 font-semibold max-w-[200px] truncate" title={eq.location?.fullName || eq.location?.locationName}>
                        {eq.location?.fullName || eq.location?.locationName || `Location ${eq.locationKey}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500 truncate max-w-[220px]" title={eq.description || ''}>
                    {eq.description || <span className="text-slate-300 italic">No description</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-8 flex items-center justify-end">
                      {/* Hover Actions */}
                      <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                        <Link
                          to={`/equipment/${eq.equipmentKey}`}
                          className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          onClick={() => onEdit(eq)}
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => onDelete(eq.equipmentKey!)}
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

                {/* Expanded Row for Points */}
                {expandedEquipments[eq.equipmentKey!] && (
                  <tr className="bg-slate-50/40 border-b border-slate-100">
                    <td colSpan={6} className="px-8 py-6">
                      <div className="bg-slate-50/70 border border-slate-200/85 rounded-xl p-5 space-y-4 shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h4 className="text-sm font-bold text-slate-800">
                              System Points for {eq.name}
                            </h4>
                          </div>
                          {addingPointToEquipmentKey !== eq.equipmentKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 px-3 py-1.5 h-8 font-bold border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 rounded-lg text-xs"
                              onClick={() => startAddPoint(eq.equipmentKey!)}
                            >
                              <Plus size={14} strokeWidth={2.5} />
                              Add Point
                            </Button>
                          )}
                        </div>

                        {/* Inline Add Form */}
                        {addingPointToEquipmentKey === eq.equipmentKey && (
                          <div className="bg-white border border-emerald-100 rounded-xl p-4 flex flex-col md:flex-row items-end gap-3 shadow-md shadow-emerald-50/50 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Point Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Temperature Sensor"
                                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                                value={pointName}
                                onChange={(e) => setPointName(e.target.value)}
                              />
                            </div>
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modbus/System Address</label>
                              <input
                                type="text"
                                placeholder="e.g. 40001 or AHU_TEMP"
                                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
                                value={pointAddress}
                                onChange={(e) => setPointAddress(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                              <Button
                                variant="ghost"
                                className="h-10 px-4 font-bold text-xs text-slate-500 hover:bg-slate-100 rounded-lg flex-1 md:flex-none"
                                onClick={cancelAction}
                              >
                                <X size={14} className="mr-1" />
                                Cancel
                              </Button>
                              <Button
                                className="h-10 px-4 font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex-1 md:flex-none border-0 shadow-lg shadow-emerald-100"
                                onClick={() => handleSavePoint(eq.equipmentKey!)}
                              >
                                <Check size={14} className="mr-1" strokeWidth={2.5} />
                                Save Point
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Points List */}
                        {!eq.points || eq.points.length === 0 ? (
                          addingPointToEquipmentKey !== eq.equipmentKey && (
                            <div className="bg-white/60 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                              <p className="text-xs text-slate-400 font-semibold">No monitoring points registered for this equipment.</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Click "Add Point" to configure your first hardware point.</p>
                            </div>
                          )
                        ) : (
                          <div className="overflow-hidden bg-white border border-slate-200/60 rounded-xl">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                  <th className="px-5 py-2.5">Point Name</th>
                                  <th className="px-5 py-2.5">Modbus/System Address</th>
                                  <th className="px-5 py-2.5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                                {eq.points.map((p) => (
                                  <tr key={p.pointKey} className="hover:bg-slate-50/40 transition-colors">
                                    {editingPointKey === p.pointKey ? (
                                      // Inline Edit Mode
                                      <td colSpan={3} className="px-5 py-3">
                                        <div className="flex flex-col md:flex-row items-end gap-3 w-full animate-in fade-in duration-200">
                                          <div className="flex-1 w-full space-y-1">
                                            <input
                                              type="text"
                                              className="w-full h-8 px-2.5 border border-slate-200 rounded-md text-xs font-medium focus:border-emerald-500 outline-none"
                                              value={pointName}
                                              onChange={(e) => setPointName(e.target.value)}
                                            />
                                          </div>
                                          <div className="flex-1 w-full space-y-1">
                                            <input
                                              type="text"
                                              className="w-full h-8 px-2.5 border border-slate-200 rounded-md text-xs font-medium focus:border-emerald-500 outline-none"
                                              value={pointAddress}
                                              onChange={(e) => setPointAddress(e.target.value)}
                                            />
                                          </div>
                                          <div className="flex gap-1 mt-2 md:mt-0">
                                            <Button
                                              variant="ghost"
                                              className="h-8 px-2 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-md"
                                              onClick={cancelAction}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              className="h-8 px-3 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md border-0"
                                              onClick={() => handleUpdatePoint(p.pointKey!, eq.equipmentKey!)}
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </div>
                                      </td>
                                    ) : (
                                      // Normal List Mode
                                      <>
                                        <td className="px-5 py-3 text-slate-800 font-bold">{p.name}</td>
                                        <td className="px-5 py-3">
                                          <span className="font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">
                                            {p.address || 'No Address'}
                                          </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                          <div className="inline-flex gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                                              onClick={() => startEditPoint(p)}
                                            >
                                              <Edit3 size={12} />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                              onClick={() => handleDeletePoint(p.pointKey!)}
                                            >
                                              <Trash2 size={12} />
                                            </Button>
                                          </div>
                                        </td>
                                      </>
                                    )}
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
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <p>Showing {equipment.length} hardware units in operation</p>
        <div className="flex items-center gap-2">
          <Info size={12} />
          <span>Equipment bind points to locations for monitoring</span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentTable;
