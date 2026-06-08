import { useState, useEffect } from 'react';
import { Modal } from './UI/Modal';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import { type Equipment, type EquipmentCategory, createEquipment, updateEquipment, getEquipmentCategories } from '../api/equipmentApi';
import locationService, { type Location } from '../api/locationService';
import { Cpu, Info } from 'lucide-react';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Equipment | null;
}

const AddEquipmentModal = ({ isOpen, onClose, onSuccess, initialData }: AddEquipmentModalProps) => {
  const [formData, setFormData] = useState<Equipment>({
    name: '',
    equipmentCategoryKey: 0,
    locationKey: 0,
    description: '',
    rtPageKey: null,
  });
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          equipmentKey: initialData.equipmentKey,
          name: initialData.name,
          equipmentCategoryKey: initialData.equipmentCategoryKey,
          locationKey: initialData.locationKey,
          description: initialData.description || '',
          rtPageKey: initialData.rtPageKey || null,
        });
      } else {
        setFormData({
          name: '',
          equipmentCategoryKey: 0,
          locationKey: 0,
          description: '',
          rtPageKey: null,
        });
      }
      fetchCategories();
      fetchLocations();
    }
  }, [isOpen, initialData]);

  const fetchCategories = async () => {
    try {
      const data = await getEquipmentCategories();
      setCategories(data);
      if (data.length > 0 && formData.equipmentCategoryKey === 0) {
        setFormData(prev => ({ ...prev, equipmentCategoryKey: data[0].equipmentCategoryKey }));
      }
    } catch (err) {
      console.error('Failed to fetch equipment categories', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await locationService.getLocations();
      setLocations(data);
      if (data.length > 0 && formData.locationKey === 0) {
        setFormData(prev => ({ ...prev, locationKey: data[0].locationKey || 0 }));
      }
    } catch (err) {
      console.error('Failed to fetch locations', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.equipmentCategoryKey === 0) {
      setError('Please select an equipment category.');
      return;
    }
    if (formData.locationKey === 0) {
      setError('Please select a location.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (initialData?.equipmentKey) {
        await updateEquipment(initialData.equipmentKey, formData);
      } else {
        await createEquipment(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'add'} equipment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Equipment" : "Add New Equipment"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Equipment')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <Cpu size={16} className="text-emerald-500" />
              Equipment Name
            </label>
            <Input
              placeholder="e.g. AHU-01, Chiller Pump 2, Temp Sensor Floor 1"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-12 text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                value={formData.equipmentCategoryKey}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, equipmentCategoryKey: parseInt(e.target.value) })}
                required
              >
                <option value={0} disabled>Select a category...</option>
                {categories.map(c => (
                  <option key={c.equipmentCategoryKey} value={c.equipmentCategoryKey}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Location Binding</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
                value={formData.locationKey}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, locationKey: parseInt(e.target.value) })}
                required
              >
                <option value={0} disabled>Select a location...</option>
                {locations.map(l => (
                  <option key={l.locationKey} value={l.locationKey}>
                    {l.locationName} {l.fullName ? `(${l.fullName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors"
              placeholder="Provide a detailed description or specification of this hardware asset..."
              value={formData.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex gap-3 text-xs text-emerald-700 leading-relaxed">
          <Info className="flex-shrink-0 mt-0.5" size={14} />
          <p>
            {initialData 
              ? "Updating equipment parameters modifies sensor monitoring behavior. Ensure the physical location binding matches the real hardware installation."
              : "Adding a new equipment unit sets it up to monitor live automation points. Make sure to bind it to the correct location category."}
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddEquipmentModal;
