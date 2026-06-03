import { useState, useRef, useEffect } from 'react';
import { Settings, MapPin, LayoutDashboard, ChevronRight, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './UI/Button';

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50",
          isOpen ? "bg-slate-100/20 text-white rotate-90" : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <Settings size={22} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-sm font-semibold text-slate-800">System Settings</p>
            <p className="text-xs text-slate-500 mt-0.5">Manage building properties</p>
          </div>
          
          <div className="py-2">
            
            {/* 1. Dashboard Link */}
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all group text-none"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100 transition-colors">
                  <LayoutDashboard size={16} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-primary-800">Dashboard</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>

            {/* 2. Locations Link */}
            <Link
              to="/locations"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all group"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100 transition-colors">
                  <MapPin size={16} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-primary-800">Locations</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>

            {/* 3. 🛠️ NEW: Equipment Manager Router Action Link directly nested beneath Locations layout */}
            <Link
              to="/dashboard"
              onClick={() => {
                setIsOpen(false); // Smoothly dismiss dropdown container viewport bounds instantly
                
                // Dispatches an atomic state payload upwards after view router navigation renders successfully
                setTimeout(() => {
                  const event = new CustomEvent('changeMiddleView', { detail: 'equipmentManager' });
                  window.dispatchEvent(event);
                }, 100);
              }}
              className="flex items-center justify-between px-4 py-3 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-all group"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-primary-100 transition-colors">
                  <Sliders size={16} />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-primary-800">Equipment Manager</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>

          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;