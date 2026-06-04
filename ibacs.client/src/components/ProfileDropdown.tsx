import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Pencil, KeyRound } from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State for password change mode
  
  // State for password fields
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isHovered, setIsHovered] = useState(false); // State for password requirements tooltip

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || 'User',
    email: localStorage.getItem('userEmail') || '',
    position: localStorage.getItem('position') || '',
    company: localStorage.getItem('company') || '',
    contactNumber: localStorage.getItem('contactNumber') || '',
  });

  const firstLetter = profile.name.charAt(0).toUpperCase();

  // Close dropdown and reset modes when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
        setIsChangingPassword(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save updated profile data to localStorage
  const handleSave = () => {
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('position', profile.position);
    localStorage.setItem('company', profile.company);
    localStorage.setItem('contactNumber', profile.contactNumber);
    setIsEditing(false);
  };

  // Logic to handle password update
  const handlePasswordChange = () => {
    const savedPass = localStorage.getItem('appPassword');
    
    if (passwords.current !== savedPass) {
      alert("Current password incorrect!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    
    localStorage.setItem('appPassword', passwords.new);
    alert("Password updated successfully!");
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300">
        <User size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          {/* Header section */}
          <div className="bg-[#1e293b] p-5 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold mb-3">
              {firstLetter}
            </div>
            <p className="text-white font-semibold text-lg">{profile.name}</p>
            <p className="text-slate-400 text-xs">{profile.email}</p>
          </div>

          {/* Details/Forms Section */}
          <div className="p-4 border-b">
            {isChangingPassword ? (
              <div className="space-y-3">
                <input type="password" placeholder="Current Password" onChange={(e) => setPasswords({...passwords, current: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                
                {/* New Password field with Requirement Tooltip */}
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})} 
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)} 
                    className="w-full border rounded-lg p-2 text-sm" 
                  />
                  {isHovered && (
                    <div className="absolute left-0 mt-2 p-3 bg-white border border-blue-500 rounded-lg shadow-xl z-[60] w-full text-xs">
                      <p className="font-bold mb-1">Password must contain:</p>
                      <ul className="list-none p-0 m-0">
                        <li className={passwords.new.length >= 8 ? 'text-green-600' : 'text-red-500'}>• 8+ characters</li>
                        <li className={/[A-Z]/.test(passwords.new) ? 'text-green-600' : 'text-red-500'}>• 1 Capital letter</li>
                        <li className={/\d/.test(passwords.new) ? 'text-green-600' : 'text-red-500'}>• 1 Number</li>
                        <li className={/[@$!%*#?&]/.test(passwords.new) ? 'text-green-600' : 'text-red-500'}>• 1 Special character</li>
                      </ul>
                    </div>
                  )}
                </div>

                <input type="password" placeholder="Confirm Password" onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                
                {/* Save Password Button */}
                <button onClick={handlePasswordChange} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Password</button>
                
                {/* Cancel Password Button */}
                <button onClick={() => setIsChangingPassword(false)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm">Cancel</button>
              </div>
            ) : isEditing ? (
              <div className="space-y-3">
                <input type="text" placeholder="Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" placeholder="Position" value={profile.position} onChange={(e) => setProfile({...profile, position: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" placeholder="Company" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                <input type="text" placeholder="Contact Number" value={profile.contactNumber} onChange={(e) => setProfile({...profile, contactNumber: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                
                {/* Save Profile Changes Button */}
                <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                
                {/* Cancel Edit Button */}
                <button onClick={() => setIsEditing(false)} className="w-full bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm">Cancel</button>
              </div>
            ) : (
              <>
                <div className="mb-3"><p className="font-semibold text-sm">👤 Name</p><p className="text-slate-600 text-sm">{profile.name}</p></div>
                <div className="mb-3"><p className="font-semibold text-sm">💼 Position</p><p className="text-slate-600 text-sm">{profile.position || '-'}</p></div>
                <div className="mb-3"><p className="font-semibold text-sm">🏢 Company</p><p className="text-slate-600 text-sm">{profile.company || '-'}</p></div>
                <div><p className="font-semibold text-sm">📞 Contact Number</p><p className="text-slate-600 text-sm">{profile.contactNumber || '-'}</p></div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="py-2">
            {!isChangingPassword && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-slate-700 text-sm"><Pencil size={16} /> Edit Profile</button>
                <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-slate-700 text-sm"><KeyRound size={16} /> Change Password</button>
              </>
            )}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-red-600 text-sm"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;