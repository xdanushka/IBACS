import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Cpu, Search, Layers } from 'lucide-react';
import EquipmentTable from '../components/EquipmentTable';
import EquipmentCategoryTable from '../components/EquipmentCategoryTable';
import AddEquipmentModal from '../components/AddEquipmentModal';
import AddEquipmentCategoryModal from '../components/AddEquipmentCategoryModal';
import { type Equipment, type EquipmentCategory, getAllEquipment, getEquipmentCategories, deleteEquipment } from '../api/equipmentApi';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

const EquipmentPage = () => {
  const [activeTab, setActiveTab] = useState<'equipment' | 'categories'>('equipment');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'equipment') {
        const data = await getAllEquipment();
        if (Array.isArray(data)) setEquipment(data);
      } else {
        const data = await getEquipmentCategories();
        if (Array.isArray(data)) setCategories(data);
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

  const handleDeleteEquipment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this equipment? This will fail if there are any data points attached.')) return;
    
    try {
      await deleteEquipment(id);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete equipment.');
    }
  };

  const handleEditEquipment = (eq: Equipment) => {
    setEditingEquipment(eq);
    setIsModalOpen(true);
  };

  const filteredEquipment = equipment?.filter(eq => {
    const query = searchQuery.toLowerCase();
    return (
      eq.name.toLowerCase().includes(query) || 
      (eq.description?.toLowerCase().includes(query) ?? false) ||
      (eq.equipmentCategory?.category.toLowerCase().includes(query) ?? false) ||
      (eq.location?.locationName.toLowerCase().includes(query) ?? false) ||
      (eq.location?.fullName?.toLowerCase().includes(query) ?? false)
    );
  });

  const filteredCategories = categories?.filter(cat => 
    cat.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-100">
              {activeTab === 'equipment' ? <Cpu size={24} strokeWidth={2.5} /> : <Layers size={24} strokeWidth={2.5} />}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'equipment' ? 'Equipment Assets' : 'Equipment Categories'}
            </h1>
          </div>
          <p className="text-slate-500 font-medium whitespace-nowrap">
            {activeTab === 'equipment' ? 'View and configure building hardware devices' : 'Define equipment types like Sensor, Pump, or AHU'}
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
          
          {activeTab === 'equipment' ? (
            <Button
              onClick={() => { setEditingEquipment(null); setIsModalOpen(true); }}
              className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-emerald-100 hover:shadow-2xl hover:shadow-emerald-200 font-bold tracking-tight text-lg bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              <Plus size={24} strokeWidth={3} />
              Add Equipment
            </Button>
          ) : (
            <Button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-1 md:flex-none gap-2 px-6 py-4 rounded-xl shadow-xl shadow-emerald-100 hover:shadow-2xl hover:shadow-emerald-200 font-bold tracking-tight text-lg bg-emerald-700 hover:bg-emerald-800 text-white border-0"
            >
              <Plus size={24} strokeWidth={3} />
              Add Category
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-inner">
        <button
          onClick={() => { setActiveTab('equipment'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'equipment' 
              ? 'bg-white text-emerald-600 shadow-lg shadow-slate-200 scale-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95 opacity-70'
          }`}
        >
          <Cpu size={16} strokeWidth={activeTab === 'equipment' ? 2.5 : 2} />
          Equipment
        </button>
        <button
          onClick={() => { setActiveTab('categories'); setSearchQuery(''); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'categories' 
              ? 'bg-white text-emerald-600 shadow-lg shadow-slate-200 scale-100' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95 opacity-70'
          }`}
        >
          <Layers size={16} strokeWidth={activeTab === 'categories' ? 2.5 : 2} />
          Categories
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <Input
            placeholder={activeTab === 'equipment' ? 'Search by name, description, category or location...' : 'Search categories...'}
            className="pl-12 h-12 rounded-xl bg-white border-slate-200 group-hover:border-emerald-200 focus:ring-emerald-500/20 text-base font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tables Context */}
      <div className="animate-in slide-in-from-top-4 duration-500">
        {activeTab === 'equipment' ? (
          <EquipmentTable 
            equipment={filteredEquipment || []} 
            loading={loading} 
            onEdit={handleEditEquipment}
            onDelete={handleDeleteEquipment}
          />
        ) : (
          <EquipmentCategoryTable 
            categories={filteredCategories || []} 
            loading={loading} 
          />
        )}
      </div>

      {/* Modals */}
      <AddEquipmentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEquipment(null); }}
        onSuccess={fetchData}
        initialData={editingEquipment}
      />

      <AddEquipmentCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default EquipmentPage;