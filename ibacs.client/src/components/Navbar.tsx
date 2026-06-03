import { Link } from 'react-router-dom';
import SettingsDropdown from './SettingsDropdown';
import ProfileDropdown from './ProfileDropdown'; 
import { LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="h-16 w-full bg-primary-600 shadow-lg border-b border-primary-700/50 backdrop-blur-sm sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Logo and Branding section */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 group transition-transform hover:scale-105"
        >
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner">
            <LayoutDashboard className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none group-hover:tracking-normal transition-all duration-300">
              IBACS
            </h1>
            <p className="text-[10px] text-white/70 font-medium uppercase tracking-widest mt-0.5">
              Intelligent Building Automation & Control
            </p>
          </div>
        </Link>

        {/* Right side navigation: Settings first, then Profile */}
        <div className="flex items-center gap-3">
          <SettingsDropdown /> 
          <div className="h-6 w-[1px] bg-white/20" /> 
          <ProfileDropdown /> 
        </div>

      </div>
    </nav>
  );
};

export default Navbar;