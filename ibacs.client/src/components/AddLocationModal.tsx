import { useState, useEffect } from 'react';
import { Modal } from './UI/Modal';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import locationService, { Location, LocationType } from '../api/locationService';
import { MapPin, Info, Layers } from 'lucide-react';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLocationModal = ({ isOpen, onClose, onSuccess }: AddLocationModalProps) => {
  const [formData, setFormData] = useState<Location>({
    locationName: '',
    locationTypeKey: 1, // Default type
    parentLocationKey: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await locationService.addLocation(formData);
      setFormData({ locationName: '', locationTypeKey: 1, parentLocationKey: null });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Location"
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add Location'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 border border-red-100 animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <Input
            label="Location Name"
            placeholder="e.g. Building A, Floor 1, Room 101"
            value={formData.locationName}
            onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
            required
            className="focus:ring-primary-500"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Location Type ID</label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.locationTypeKey}
                  onChange={(e) => setFormData({ ...formData, locationTypeKey: parseInt(e.target.value) })}
                  className="pl-9"
                />
                <Layers className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Parent Location ID (Optional)</label>
              <div className="relative">
                <Input
                  type="number"
                  value={formData.parentLocationKey || ''}
                  onChange={(e) => setFormData({ ...formData, parentLocationKey: e.target.value ? parseInt(e.target.value) : null })}
                  className="pl-9"
                  placeholder="None"
                />
                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 flex gap-3 text-xs text-primary-700 leading-relaxed">
          <Info className="flex-shrink-0 mt-0.5" size={14} />
          <p>
            Adding a location correctly establishes the hierarchy for your smart building. 
            Ensure the <strong>Parent Location</strong> is correctly set for rooms and floors.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddLocationModal;
