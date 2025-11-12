import { useState, useEffect } from 'react';
import { Map, Employee, Location } from '../types';
import { mapsApi, employeesApi, locationsApi } from '../api/client';
import { Plus, Edit, Trash2, MapPin, Users, Navigation } from 'lucide-react';
import MapEditor from '../components/admin/MapEditor';
import EmployeeEditor from '../components/admin/EmployeeEditor';
import LocationEditor from '../components/admin/LocationEditor';

type Tab = 'maps' | 'employees' | 'locations';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('maps');
  const [maps, setMaps] = useState<Map[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showMapEditor, setShowMapEditor] = useState(false);
  const [showEmployeeEditor, setShowEmployeeEditor] = useState(false);
  const [showLocationEditor, setShowLocationEditor] = useState(false);
  const [editingMap, setEditingMap] = useState<Map | undefined>();
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'maps') {
        const response = await mapsApi.getAll();
        setMaps(response.data);
      } else if (activeTab === 'employees') {
        const response = await employeesApi.getAll();
        setEmployees(response.data);
      } else if (activeTab === 'locations') {
        const response = await locationsApi.getAll();
        setLocations(response.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this map?')) return;
    try {
      await mapsApi.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete map');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      await employeesApi.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await locationsApi.delete(id);
      loadData();
    } catch (err) {
      alert('Failed to delete location');
    }
  };

  const handleEditMap = (map: Map) => {
    setEditingMap(map);
    setShowMapEditor(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeEditor(true);
  };

  const handleCloseEditor = () => {
    setShowMapEditor(false);
    setShowEmployeeEditor(false);
    setShowLocationEditor(false);
    setEditingMap(undefined);
    setEditingEmployee(undefined);
  };

  const handleSave = () => {
    loadData();
    handleCloseEditor();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <a
              href="/"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Back to Map
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('maps')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'maps'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <MapPin size={20} />
              <span className="font-medium">Maps</span>
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Employees</span>
            </button>
            <button
              onClick={() => setActiveTab('locations')}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                activeTab === 'locations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Navigation size={20} />
              <span className="font-medium">Locations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Maps Tab */}
        {activeTab === 'maps' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Office Maps</h2>
              <button
                onClick={() => {
                  setEditingMap(undefined);
                  setShowMapEditor(true);
                }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                Add Map
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : maps.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No maps yet. Click "Add Map" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maps.map((map) => (
                  <div key={map.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={map.imageUrl}
                      alt={map.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{map.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {map.building}, Floor {map.floor}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        {map.city}, {map.state}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditMap(map)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMap(map.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
              <button
                onClick={() => {
                  setEditingEmployee(undefined);
                  setShowEmployeeEditor(true);
                }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                Add Employee
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : employees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No employees yet. Click "Add Employee" to create one.
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Locations
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{employee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{employee.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {employee.locations?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === 'locations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Employee Locations</h2>
              <button
                onClick={() => setShowLocationEditor(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
                Add Location
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : locations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No locations yet. Click "Add Location" to create one.
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Map
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {locations.map((location) => (
                      <tr key={location.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {location.employee?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {location.map?.name || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {location.map?.building}, Floor {location.map?.floor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            ({location.x.toFixed(3)}, {location.y.toFixed(3)})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteLocation(location.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showMapEditor && (
        <MapEditor map={editingMap} onClose={handleCloseEditor} onSave={handleSave} />
      )}
      {showEmployeeEditor && (
        <EmployeeEditor employee={editingEmployee} onClose={handleCloseEditor} onSave={handleSave} />
      )}
      {showLocationEditor && (
        <LocationEditor onClose={handleCloseEditor} onSave={handleSave} />
      )}
    </div>
  );
};

export default AdminPage;
