import { useState } from 'react';
import { Map } from '../../types';
import { mapsApi } from '../../api/client';
import { X, Upload } from 'lucide-react';

interface MapEditorProps {
  map?: Map;
  onClose: () => void;
  onSave: () => void;
}

const MapEditor = ({ map, onClose, onSave }: MapEditorProps) => {
  const [formData, setFormData] = useState({
    name: map?.name || '',
    state: map?.state || '',
    city: map?.city || '',
    building: map?.building || '',
    floor: map?.floor || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!map && !imageFile) {
      setError('Please select an image file');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('state', formData.state);
      data.append('city', formData.city);
      data.append('building', formData.building);
      data.append('floor', formData.floor);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (map) {
        await mapsApi.update(map.id, data);
      } else {
        await mapsApi.create(data);
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save map');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG and PNG files are allowed');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {map ? 'Edit Map' : 'Create New Map'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Map Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Building A - 1st Floor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., San Francisco"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Building *
              </label>
              <input
                type="text"
                required
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Building A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <input
                type="text"
                required
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor Plan Image {!map && '*'}
            </label>
            <div className="mt-1 flex items-center">
              <label className="w-full cursor-pointer">
                <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600">
                      {imageFile ? imageFile.name : 'Click to upload floor plan (JPG or PNG)'}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {map && !imageFile && (
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current image
              </p>
            )}
          </div>

          {/* Preview current image */}
          {map && map.imageUrl && !imageFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Image
              </label>
              <img
                src={map.imageUrl}
                alt={map.name}
                className="max-w-full h-48 object-contain border rounded"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : map ? 'Update Map' : 'Create Map'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapEditor;
