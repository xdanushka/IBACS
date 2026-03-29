import { useState, useEffect } from 'react';
import { Plus, RefreshCw, MapPin, Search, Filter } from 'lucide-react';
import LocationTable from '../components/LocationTable';
import AddLocationModal from '../components/AddLocationModal';
import locationService, { type Location } from '../api/locationService';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await locationService.getLocations();
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error('API did not return an array:', data);
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filteredLocations = locations?.filter(loc =>
    loc.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Locations</h1>
          </div>
          <p className="text-slate-500 font-medium">Manage and organize your building hierarchy</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchLocations}
            disabled={loading}
            className="hidden md:flex gap-2 font-bold"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 font-bold tracking-tight text-lg"
          >
            <Plus size={24} strokeWidth={3} />
            Add Location
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <Input
            placeholder="Search by name or path..."
            className="pl-12 h-12 rounded-xl bg-white border-slate-200 group-hover:border-primary-200 focus:ring-primary-500/20 text-base font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl gap-2 font-bold text-slate-600 border-slate-200">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      <LocationTable locations={filteredLocations} loading={loading} />

      <AddLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLocations}
      />
    </div>
  );
};

export default Locations;
