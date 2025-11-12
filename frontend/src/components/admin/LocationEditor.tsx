import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Map, Employee } from '../../types';
import { mapsApi, employeesApi, locationsApi } from '../../api/client';
import MapViewer from '../MapViewer';

interface LocationEditorProps {
  onClose: () => void;
  onSave: () => void;
}

const LocationEditor = ({ onClose, onSave }: LocationEditorProps) => {
  const [maps, setMaps] = useState<Map[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedMapId, setSelectedMapId] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedMapId) {
      loadMapDetails();
    }
  }, [selectedMapId]);

  const loadData = async () => {
    try {
      const [mapsRes, employeesRes] = await Promise.all([
        mapsApi.getAll(),
        employeesApi.getAll(),
      ]);
      setMaps(mapsRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMapDetails = async () => {
    try {
      const response = await mapsApi.getById(selectedMapId);
      setSelectedMap(response.data);
    } catch (err) {
      setError('Failed to load map details');
    }
  };

  const handleLocationClick = (x: number, y: number) => {
    setCoordinates({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedMapId || !selectedEmployeeId || !coordinates) {
      setError('Please select a map, employee, and click on the map to set location');
      return;
    }

    setIsSubmitting(true);

    try {
      await locationsApi.create({
        mapId: selectedMapId,
        employeeId: selectedEmployeeId,
        x: coordinates.x,
        y: coordinates.y,
      });

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create location');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add Employee Location</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Map *
              </label>
              <select
                required
                value={selectedMapId}
                onChange={(e) => setSelectedMapId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a map...</option>
                {maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name} - {map.city}, {map.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee *
              </label>
              <select
                required
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an employee...</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {coordinates && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                Location selected: X: {coordinates.x.toFixed(3)}, Y: {coordinates.y.toFixed(3)}
              </p>
            </div>
          )}

          {/* Map viewer */}
          {selectedMap ? (
            <div className="border rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <MapViewer
                map={selectedMap}
                isAdmin={true}
                onLocationClick={handleLocationClick}
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              Select a map to begin
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Select a map from the dropdown</li>
              <li>Select an employee from the dropdown</li>
              <li>Click on the map where the employee sits</li>
              <li>Click "Add Location" to save</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
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
              disabled={isSubmitting || !coordinates}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEditor;
