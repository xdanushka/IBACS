import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Pencil } from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profile, setProfile] = useState({
    name: 'User',
    email: '',
    position: '',
    company: '',
    contactNumber: '',
  });

  useEffect(() => {
    setProfile({
      name: localStorage.getItem('userName') || 'User',
      email: localStorage.getItem('userEmail') || '',
      position: localStorage.getItem('position') || '',
      company: localStorage.getItem('company') || '',
      contactNumber: localStorage.getItem('contactNumber') || '',
    });
  }, []);

  const firstLetter = profile.name.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('position', profile.position);
    localStorage.setItem('company', profile.company);
    localStorage.setItem('contactNumber', profile.contactNumber);

    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('position');
    localStorage.removeItem('company');
    localStorage.removeItem('contactNumber');

    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300"
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#1e293b] p-5 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold mb-3">
              {firstLetter}
            </div>

            <p className="text-white font-semibold text-lg">
              {profile.name}
            </p>

            <p className="text-slate-400 text-xs">
              {profile.email}
            </p>
          </div>

          {/* Details Section */}
          <div className="p-4 border-b">
            {!isEditing ? (
              <>
                <div className="mb-3">
                  <p className="font-semibold text-sm">👤 Name</p>
                  <p className="text-slate-600 text-sm">{profile.name}</p>
                </div>

                <div className="mb-3">
                  <p className="font-semibold text-sm">💼 Position</p>
                  <p className="text-slate-600 text-sm">
                    {profile.position || '-'}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="font-semibold text-sm">🏢 Company</p>
                  <p className="text-slate-600 text-sm">
                    {profile.company || '-'}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    📞 Contact Number
                  </p>
                  <p className="text-slate-600 text-sm">
                    {profile.contactNumber || '-'}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <input
                  type="text"
                  placeholder="Position"
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      position: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <input
                  type="text"
                  placeholder="Company"
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      company: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <input
                  type="text"
                  placeholder="Contact Number"
                  value={profile.contactNumber}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contactNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="py-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-slate-700 text-sm"
            >
              <Pencil size={16} />
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-red-600 text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;