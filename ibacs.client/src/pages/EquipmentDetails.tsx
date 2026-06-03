import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Layers, MapPin, Info, Server, Activity } from 'lucide-react';
import { getEquipmentById, type Equipment } from '../api/equipmentApi';

const EquipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getEquipmentById(Number(id));
        setEquipment(data);
      } catch (err) {
        console.error('Failed to load equipment details:', err);
        setError('Failed to load equipment details. It may not exist or the server is offline.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200 animate-pulse transition-all">
        <div className="bg-emerald-100 p-4 rounded-full">
          <Cpu className="text-emerald-600 animate-bounce" size={40} />
        </div>
        <p className="text-slate-500 font-semibold text-lg">Loading equipment details...</p>
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <Link to="/equipment" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors text-sm">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Equipment
        </Link>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-red-100">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Equipment Not Found</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            {error || 'The requested equipment details could not be found.'}
          </p>
          <Link
            to="/equipment"
            className="inline-flex h-10 px-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl items-center justify-center shadow-lg shadow-emerald-100 transition-all border-0"
          >
            Return to Assets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header back button */}
      <Link 
        to="/equipment" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors text-sm group"
      >
        <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
        Back to Equipment List
      </Link>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 md:p-10 shadow-2xl shadow-emerald-100">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Activity size={12} className="animate-pulse" />
              Monitoring Active
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight flex items-center gap-3">
              <Cpu size={36} strokeWidth={2.5} />
              {equipment.name}
            </h1>
          </div>
          <div className="text-white/80 font-bold text-sm bg-white/10 border border-white/20 px-4 py-2 rounded-xl backdrop-blur-sm self-start md:self-auto">
            ID: #{equipment.equipmentKey}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Server size={18} className="text-emerald-500" />
              Equipment Information
            </h3>
            
            <div className="space-y-4">
              {/* Category */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <Layers size={13} className="text-slate-400" />
                  {equipment.equipmentCategory?.category || `Category ${equipment.equipmentCategoryKey}`}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Location</span>
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <MapPin size={15} className="text-emerald-500" />
                  {equipment.location?.fullName || equipment.location?.locationName || `Location ${equipment.locationKey}`}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Description</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/50 border border-slate-100 rounded-xl p-3">
                  {equipment.description || <span className="text-slate-400 italic">No description provided for this equipment asset.</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Points Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-emerald-500" />
                Configured System Points
              </h3>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {equipment.points?.length || 0} Registered Points
              </span>
            </div>

            {!equipment.points || equipment.points.length === 0 ? (
              <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-center p-6 bg-slate-50/20">
                <Activity size={32} className="text-slate-300" />
                <div>
                  <h4 className="text-sm font-bold text-slate-700">No monitoring points found</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px] leading-relaxed">
                    This equipment has no registered system points. You can add points by expanding this row in the equipment list page.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200/60 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-3.5">Point Name</th>
                      <th className="px-6 py-3.5">Modbus/System Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                    {equipment.points.map((p) => (
                      <tr key={p.pointKey} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 text-slate-800 font-extrabold flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {p.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/40 text-[10px]">
                            {p.address || 'No Address'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EquipmentDetails;
