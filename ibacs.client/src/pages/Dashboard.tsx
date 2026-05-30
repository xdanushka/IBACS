import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Layers, Cpu, ArrowRight, Activity, Building } from 'lucide-react';
import locationService from '../api/locationService';
import { getAllEquipment } from '../api/equipmentApi';

const Dashboard = () => {
  const [stats, setStats] = useState({ locations: 0, types: 0, equipment: 0 });
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [locs, typs, equips] = await Promise.all([
          locationService.getLocations(),
          locationService.getLocationTypes(),
          getAllEquipment()
        ]);
        setStats({
          locations: locs.length,
          types: typs.length,
          equipment: equips.length
        });
        setApiConnected(true);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setApiConnected(false);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-blue-700 p-8 md:p-12 shadow-2xl shadow-primary-200">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Activity size={12} className="animate-pulse" />
            System Live & Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome to IBACS Control Center
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-xl leading-relaxed">
            Monitor, manage, and configure your building automation infrastructure and equipment components in one centralized space.
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Locations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/55 flex items-center justify-between group hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Locations</span>
            <h2 className="text-4xl font-extrabold text-slate-900">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.locations}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Configured building areas</p>
          </div>
          <div className="p-4 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
            <MapPin size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 2: Location Types */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/55 flex items-center justify-between group hover:scale-[1.03] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Location Categories</span>
            <h2 className="text-4xl font-extrabold text-slate-900">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.types}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Types (Floor, Wing, Room)</p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <Layers size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 3: Active Equipment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/55 flex items-center justify-between group hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Equipment</span>
            <h2 className="text-4xl font-extrabold text-slate-900">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.equipment}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Monitored hardware devices</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
            <Cpu size={28} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Navigation Card 1 */}
        <Link 
          to="/locations"
          className="relative overflow-hidden group bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/55 flex flex-col justify-between h-64 hover:shadow-2xl hover:shadow-primary-100/50 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary-50 rounded-full group-hover:scale-125 transition-transform duration-500 -z-0" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center">
              <Building size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Building Hierarchy</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
              Define your physical automation infrastructure. Create levels such as buildings, floors, rooms, and configure their exact locations.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-primary-600 font-bold text-sm tracking-tight group-hover:text-primary-700">
            Configure Hierarchy
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>

        {/* Navigation Card 2 */}
        <Link 
          to="/equipment"
          className="relative overflow-hidden group bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/55 flex flex-col justify-between h-64 hover:shadow-2xl hover:shadow-primary-100/50 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500 -z-0" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Cpu size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Equipment Assets</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm">
              View and register building equipment, sensors, and controllers. Bind equipment components directly to specific locations.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-emerald-600 font-bold text-sm tracking-tight group-hover:text-emerald-700">
            View Assets
            <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* System Status Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md shadow-slate-100/55">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : apiConnected === false ? 'bg-red-500' : 'bg-amber-400 animate-pulse'}`} />
          <span className="text-sm font-semibold text-slate-700">
            {apiConnected ? 'API Server Connected' : apiConnected === false ? 'API Server Disconnected' : 'Establishing connection...'}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Version 1.0.0 (Stable)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
