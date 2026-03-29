import { useState } from 'react';
import { Modal } from './UI/Modal';
import { Input } from './UI/Input';
import { Button } from './UI/Button';
import locationService from '../api/locationService';
import { Layers, Info } from 'lucide-react';

interface AddLocationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddLocationTypeModal = ({ isOpen, onClose, onSuccess }: AddLocationTypeModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await locationService.addLocationType({ name: name.trim() });
      setName('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add location type. Ensure the name is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Location Type"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
            {loading ? 'Adding...' : 'Add Type'}
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

        <div className="space-y-1.5">
          <Input
            label="Type Name"
            placeholder="e.g. Building, Floor, Room, Wing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100 flex gap-3 text-xs text-primary-700 leading-relaxed">
          <Info className="flex-shrink-0 mt-0.5" size={14} />
          <p>
            Location types help categorize areas in your building. 
            <strong> Names must be unique</strong> (e.g., you cannot have two types named "Floor").
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AddLocationTypeModal;
