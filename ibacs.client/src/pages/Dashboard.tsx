import { LayoutDashboard, Activity, Zap, ShieldCheck, Thermometer, Wind } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Active Systems', value: '12', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Energy Usage', value: '450 kWh', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Security Status', value: 'Secure', icon: ShieldCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time automation monitoring and control center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center gap-5 group hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-300">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl flex flex-col items-center justify-center min-h-[400px] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center gap-6">
             <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 animate-pulse">
                <LayoutDashboard size={48} />
             </div>
             <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">RT Page Dashboard</h2>
                <p className="text-slate-500 font-medium max-w-[320px]">This area is reserved for the real-time building automation interface and visual control components.</p>
             </div>
             <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
                   <Thermometer size={16} />
                   <span className="text-xs font-bold font-mono">22.5°C</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
                   <Wind size={16} />
                   <span className="text-xs font-bold font-mono">Low</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-150 duration-700" />
           <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-white tracking-tight">Quick Logs</h3>
                 <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none">Live</span>
              </div>
              <div className="mt-8 space-y-6">
                 {[
                    { time: '14:20:05', msg: 'System initialized successfully', status: 'success' },
                    { time: '14:22:12', msg: 'Primary connection established', status: 'primary' },
                    { time: '14:35:54', msg: 'Awaiting sensor integration...', status: 'waiting' }
                 ].map((log, idx) => (
                    <div key={idx} className="flex gap-4 items-start group/log">
                       <span className="text-[10px] font-black font-mono text-white/30 pt-1 tracking-tighter w-16 opacity-50 group-hover/log:opacity-100 transition-opacity">{log.time}</span>
                       <div className="h-10 w-[2px] bg-white/10 group-hover/log:bg-primary-500/50 transition-colors" />
                       <p className="text-sm font-medium text-white/70 group-hover/log:text-white transition-colors">{log.msg}</p>
                    </div>
                 ))}
              </div>
              <div className="mt-auto pt-8 flex items-center gap-2 text-xs text-white/40 font-bold group-hover:text-primary-400 transition-colors cursor-pointer">
                 <span>View all system logs</span>
                 <Activity size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
