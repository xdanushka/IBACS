import { Layers, Info } from 'lucide-react';
import { type EquipmentCategory } from '../api/equipmentApi';

interface EquipmentCategoryTableProps {
  categories: EquipmentCategory[];
  loading: boolean;
}

const EquipmentCategoryTable = ({ categories, loading }: EquipmentCategoryTableProps) => {
  if (loading && categories.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 animate-pulse transition-all">
        <div className="bg-emerald-100 p-3 rounded-full">
          <Layers className="text-emerald-500 animate-bounce" size={32} />
        </div>
        <p className="text-slate-500 font-medium tracking-tight">Fetching equipment categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 group/table transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Category Key</th>
                <th className="px-6 py-4">Category Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No equipment categories defined yet
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.equipmentCategoryKey} className="group hover:bg-emerald-50/20 transition-all duration-200 cursor-default">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                      #{cat.equipmentCategoryKey}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                          <Layers size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                          {cat.category}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <p>Showing {categories.length} equipment categories</p>
          <div className="flex items-center gap-2">
            <Info size={12} />
            <span>Categories categorize your physical building hardware</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCategoryTable;
