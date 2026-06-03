import { Cpu, MapPin, Info, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { type SystemModel } from '../api/systemService';
import { Button } from './UI/Button';

interface SystemTableProps {
  systems: SystemModel[];
  loading: boolean;
  onEdit: (system: SystemModel) => void;
  onDelete: (id: number) => void;
}

const SystemTable = ({ systems, loading, onEdit, onDelete }: SystemTableProps) => {
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
              <th className="px-6 py-4">System Name</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Control Points</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {systems.map((system) => (
              <tr
                key={system.systemKey}
                className="group hover:bg-primary-50/30 transition-all duration-200 cursor-default"
              >
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
            ))}
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
