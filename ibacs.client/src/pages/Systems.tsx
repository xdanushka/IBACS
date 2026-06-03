import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Cpu, Search } from 'lucide-react';
import SystemTable from '../components/SystemTable';
import AddSystemModal from '../components/AddSystemModal';
import systemService, { type SystemModel } from '../api/systemService';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const Systems = () => {
  const [systems, setSystems] = useState<SystemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await systemService.getSystems();
      if (Array.isArray(data)) {
        setSystems(data);
      }
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteSystem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this system?')) return;

    try {
      await systemService.deleteSystem(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete system.');
    }
  };

  const handleEditSystem = (system: SystemModel) => {
    setEditingSystem(system);
    setIsModalOpen(true);
  };

  const filteredSystems = systems.filter(sys => {
    const query = searchQuery.toLowerCase();
    return (
      sys.name.toLowerCase().includes(query) ||
      (sys.description?.toLowerCase().includes(query) ?? false) ||
      (sys.location?.locationName.toLowerCase().includes(query) ?? false) ||
      (sys.location?.fullName?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-200">
              <Cpu size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Automation Systems
            </h1>
          </div>
          <p className="text-slate-500 font-medium whitespace-nowrap">
            Configure and map logical control loops and networks
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

          <Button
            onClick={() => { setEditingSystem(null); setIsModalOpen(true); }}
            className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 font-bold tracking-tight text-lg"
          >
            <Plus size={24} strokeWidth={3} />
            Add System
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <Input
            placeholder="Search by system name, description, or location..."
            className="pl-12 h-12 rounded-xl bg-white border-slate-200 group-hover:border-primary-200 focus:ring-primary-500/20 text-base font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        <SystemTable
          systems={filteredSystems}
          loading={loading}
          onEdit={handleEditSystem}
          onDelete={handleDeleteSystem}
        />
      </div>

      {/* Modal */}
      <AddSystemModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSystem(null); }}
        onSuccess={fetchData}
        initialData={editingSystem}
      />
    </div>
  );
};

export default Systems;
