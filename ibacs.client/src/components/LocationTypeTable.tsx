import { Trash2, Layers, Info, MoreVertical } from 'lucide-react';
import { type LocationType } from '../api/locationService';
import locationService from '../api/locationService';
import { Button } from './UI/Button';
import { useState } from 'react';

interface LocationTypeTableProps {
  types: LocationType[];
  loading: boolean;
  onRefresh: () => void;
}

const LocationTypeTable = ({ types, loading, onRefresh }: LocationTypeTableProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this location type?')) return;
    
    setDeletingId(id);
    setError(null);
    try {
      await locationService.deleteLocationType(id);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete type. It might be in use.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && types.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 animate-pulse transition-all">
        <div className="bg-primary-100 p-3 rounded-full">
          <Layers className="text-primary-500 animate-bounce" size={32} />
        </div>
        <p className="text-slate-500 font-medium tracking-tight">Fetching categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <Info size={16} />
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-black">×</button>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 group/table transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {types.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No categories defined yet
                  </td>
                </tr>
              ) : (
                types.map((type) => (
                  <tr key={type.locationTypeKey} className="group hover:bg-primary-50/30 transition-all duration-200 cursor-default">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <Layers size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                          {type.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative h-8 flex items-center justify-end">
                        {/* Hover Actions */}
                        <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            onClick={() => handleDelete(type.locationTypeKey)}
                            disabled={deletingId === type.locationTypeKey}
                          >
                            <Trash2 size={16} className={deletingId === type.locationTypeKey ? 'animate-pulse' : ''} />
                          </Button>
                        </div>
                        {/* Default Icon */}
                        <div className="text-slate-300 opacity-100 group-hover:opacity-0 group-hover:-translate-y-2 transition-all duration-300">
                          <MoreVertical size={16} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <p>Showing {types.length} location categories</p>
          <div className="flex items-center gap-2">
            <Info size={12} />
            <span>Categories help define your building hierarchy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTypeTable;
