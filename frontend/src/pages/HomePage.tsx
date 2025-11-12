import { useState, useEffect } from 'react';
import { Map, Employee } from '../types';
import { mapsApi } from '../api/client';
import MapViewer from '../components/MapViewer';
import SearchBar from '../components/SearchBar';
import { MapPin, Building } from 'lucide-react';

const HomePage = () => {
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string>('');
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMaps();
  }, []);

  useEffect(() => {
    if (selectedMapId) {
      loadMapDetails();
    }
  }, [selectedMapId]);

  const loadMaps = async () => {
    try {
      const response = await mapsApi.getAll();
      setMaps(response.data);
      if (response.data.length > 0 && !selectedMapId) {
        setSelectedMapId(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to load maps');
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

  const handleEmployeeSelect = (employee: Employee) => {
    if (employee.locations && employee.locations.length > 0) {
      // Navigate to the first location's map
      const firstLocation = employee.locations[0];
      if (firstLocation.mapId) {
        setSelectedMapId(firstLocation.mapId);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (maps.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Building className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Maps Available</h2>
          <p className="text-gray-600">
            Contact an administrator to add office maps to the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-500" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">Office Map</h1>
            </div>
            <SearchBar onEmployeeSelect={handleEmployeeSelect} />
          </div>

          {/* Map selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Location:</label>
            <select
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.name} - {map.building}, Floor {map.floor} ({map.city}, {map.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Map viewer */}
      <main className="flex-1 overflow-hidden">
        {selectedMap ? (
          <MapViewer map={selectedMap} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-xl text-gray-600">Select a map to view</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
