import { useState, useEffect } from 'react';
import { Modal } from './UI/Modal';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import systemService, { type SystemModel } from '../api/systemService';
import locationService, { type Location } from '../api/locationService';
import { Cpu, MapPin, Info } from 'lucide-react';

interface AddSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SystemModel | null;
}

const AddSystemModal = ({ isOpen, onClose, onSuccess, initialData }: AddSystemModalProps) => {
  const [formData, setFormData] = useState<SystemModel>({
    name: '',
    locationKey: 0,
    description: '',
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          systemKey: initialData.systemKey,
          name: initialData.name,
          locationKey: initialData.locationKey,
          description: initialData.description || '',
        });
      } else {
        setFormData({
          name: '',
          locationKey: 0,
          description: '',
        });
      }
      fetchLocations();
    }
  }, [isOpen, initialData]);

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
    if (formData.locationKey === 0) {
      setError('Please select an assigned location.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (initialData?.systemKey) {
        await systemService.updateSystem(initialData.systemKey, formData);
      } else {
        await systemService.addSystem(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'add'} system. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Automation System" : "Add New Automation System"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add System')}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <Cpu size={16} className="text-primary-500" />
              System Name
            </label>
            <Input
              placeholder="e.g. HVAC Control, Lighting Loop A, Fire Alarm Main"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
              className="h-12 text-lg font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 tracking-tight flex items-center gap-2">
              <MapPin size={16} className="text-primary-500" />
              Assigned Location
            </label>
            <select
              className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              placeholder="Describe the system's purpose and scope..."
              value={formData.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 flex gap-3 text-xs text-primary-700 leading-relaxed">
          <Info className="flex-shrink-0 mt-0.5" size={14} />
          <p>
            {initialData 
              ? "Updating the system settings. Keep in mind that moving the system to a different physical location changes its hierarchy context."
              : "Creating a system allows you to organize physical points. Make sure to choose the correct location context for clean navigation."}
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddSystemModal;
