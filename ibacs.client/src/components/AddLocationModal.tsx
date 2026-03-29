import { useState, useEffect } from 'react';
import { Modal } from './UI/Modal';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import locationService, { type Location, type LocationType } from '../api/locationService';
import { MapPin, Info } from 'lucide-react';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Location | null;
}

const AddLocationModal = ({ isOpen, onClose, onSuccess, initialData }: AddLocationModalProps) => {
  const [formData, setFormData] = useState<Location>({
    locationName: '',
    locationTypeKey: 0,
    parentLocationKey: null,
  });
  const [types, setTypes] = useState<LocationType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          locationKey: initialData.locationKey,
          locationName: initialData.locationName,
          locationTypeKey: initialData.locationTypeKey,
          parentLocationKey: initialData.parentLocationKey,
        });
      } else {
        setFormData({
          locationName: '',
          locationTypeKey: 0,
          parentLocationKey: null,
        });
      }
      fetchTypes();
      fetchLocations();
    }
  }, [isOpen, initialData]);

  const fetchTypes = async () => {
    try {
      const data = await locationService.getLocationTypes();
      setTypes(data);
      if (data.length > 0 && formData.locationTypeKey === 0) {
        setFormData(prev => ({ ...prev, locationTypeKey: data[0].locationTypeKey }));
      }
    } catch (err) {
      console.error('Failed to fetch types', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const data = await locationService.getLocations();
      // Filter out the current location being edited from the parent options to avoid circular refs
      const filtered = initialData 
        ? data.filter(l => l.locationKey !== initialData.locationKey)
        : data;
      setLocations(filtered);
    } catch (err) {
      console.error('Failed to fetch locations', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.locationTypeKey === 0) {
      setError('Please select a location type.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (initialData?.locationKey) {
        await locationService.updateLocation(initialData.locationKey, formData);
      } else {
        await locationService.addLocation(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'add'} location. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Location" : "Add New Location"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Location')}
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
              <MapPin size={16} className="text-primary-500" />
              Location Name
            </label>
            <Input
              placeholder="e.g. Building A, Floor 1, Conference Room"
              value={formData.locationName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, locationName: e.target.value })}
              required
              className="h-12 text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Location Type</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                value={formData.locationTypeKey}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, locationTypeKey: parseInt(e.target.value) })}
                required
              >
                <option value={0} disabled>Select a type...</option>
                {types.map(t => (
                  <option key={t.locationTypeKey} value={t.locationTypeKey}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Parent Location (Optional)</label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                value={formData.parentLocationKey || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, parentLocationKey: e.target.value ? parseInt(e.target.value) : null })}
              >
                <option value="">None (Top Level)</option>
                {locations.map(l => (
                  <option key={l.locationKey} value={l.locationKey}>
                    {l.locationName} {l.fullName ? `(${l.fullName})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 flex gap-3 text-xs text-primary-700 leading-relaxed">
          <Info className="flex-shrink-0 mt-0.5" size={14} />
          <p>
            {initialData 
              ? "Update this location's details. Changing the name or parent will automatically update path strings for all sub-locations."
              : "Adding a location correctly establishes the hierarchy for your smart building. Ensure the Parent Location is correctly set for rooms and floors."}
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddLocationModal;
