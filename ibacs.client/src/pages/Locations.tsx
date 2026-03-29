import { useState, useEffect } from 'react';
import { Plus, RefreshCw, MapPin, Search, Layers } from 'lucide-react';
import LocationTable from '../components/LocationTable';
import LocationTypeTable from '../components/LocationTypeTable';
import AddLocationModal from '../components/AddLocationModal';
import AddLocationTypeModal from '../components/AddLocationTypeModal';
import locationService, { type Location, type LocationType } from '../api/locationService';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const Locations = () => {
  const [activeTab, setActiveTab] = useState<'locations' | 'types'>('locations');
  const [locations, setLocations] = useState<Location[]>([]);
  const [types, setTypes] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'locations') {
        const data = await locationService.getLocations();
        if (Array.isArray(data)) setLocations(data);
      } else {
        const data = await locationService.getLocationTypes();
        if (Array.isArray(data)) setTypes(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this location? This will fail if it has sub-locations or equipment.')) return;
    
    try {
      await locationService.deleteLocation(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete location.');
    }
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const filteredLocations = locations?.filter(loc => {
    const query = searchQuery.toLowerCase();
    return loc.locationName.toLowerCase().includes(query) || 
           (loc.fullName?.toLowerCase().includes(query) ?? false);
  });

  const filteredTypes = types?.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200">
              {activeTab === 'locations' ? <MapPin size={24} strokeWidth={2.5} /> : <Layers size={24} strokeWidth={2.5} />}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'locations' ? 'Building Hierarchy' : 'Location Categories'}
            </h1>
          </div>
          <p className="text-slate-500 font-medium whitespace-nowrap">
            {activeTab === 'locations' ? 'Manage and organize your physical building areas' : 'Define categories like Building, Floor, or Room'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="hidden md:flex gap-2 font-bold"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          
          {activeTab === 'locations' ? (
            <Button
              onClick={() => { setEditingLocation(null); setIsModalOpen(true); }}
              className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 font-bold tracking-tight text-lg"
            >
              <Plus size={24} strokeWidth={3} />
              Add Location
            </Button>
          ) : (
            <Button
              onClick={() => setIsTypeModalOpen(true)}
              className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 font-bold tracking-tight text-lg bg-primary-700 hover:bg-primary-800"
            >
              <Plus size={24} strokeWidth={3} />
              Add Type
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-inner">
        <button
          onClick={() => { setActiveTab('locations'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'locations' 
              ? 'bg-white text-primary-600 shadow-lg shadow-slate-200 scale-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95 opacity-70'
          }`}
        >
          <MapPin size={16} strokeWidth={activeTab === 'locations' ? 2.5 : 2} />
          Locations
        </button>
        <button
          onClick={() => { setActiveTab('types'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'types' 
              ? 'bg-white text-primary-600 shadow-lg shadow-slate-200 scale-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95 opacity-70'
          }`}
        >
          <Layers size={16} strokeWidth={activeTab === 'types' ? 2.5 : 2} />
          Location Types
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <Input
            placeholder={activeTab === 'locations' ? 'Search by name or path...' : 'Search categories...'}
            className="pl-12 h-12 rounded-xl bg-white border-slate-200 group-hover:border-primary-200 focus:ring-primary-500/20 text-base font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tables Context */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        {activeTab === 'locations' ? (
          <LocationTable 
            locations={filteredLocations || []} 
            loading={loading} 
            onEdit={handleEditLocation}
            onDelete={handleDeleteLocation}
          />
        ) : (
          <LocationTypeTable types={filteredTypes || []} loading={loading} onRefresh={fetchData} />
        )}
      </div>

      {/* Modals */}
      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLocation(null); }}
        onSuccess={fetchData}
        initialData={editingLocation}
      />

      <AddLocationTypeModal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Locations;
