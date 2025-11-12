import { Employee } from '../types';
import { X, Phone, Mail, MapPin, User } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
  onClose: () => void;
}

const EmployeeDetails = ({ employee, onClose }: EmployeeDetailsProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4">
            {/* Employee picture */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-400 border-4 border-white shadow-lg">
              {employee.pictureUrl ? (
                <img
                  src={employee.pictureUrl}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <User size={48} />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Contact information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={20} className="text-blue-500" />
              <a href={`mailto:${employee.email}`} className="hover:text-blue-500">
                {employee.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={20} className="text-blue-500" />
              <a href={`tel:${employee.phone}`} className="hover:text-blue-500">
                {employee.phone}
              </a>
            </div>
          </div>

          {/* Locations */}
          {employee.locations && employee.locations.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" />
                Locations
              </h3>
              <div className="space-y-2">
                {employee.locations.map((location) => (
                  <div key={location.id} className="text-sm text-gray-600">
                    {location.map && (
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{location.map.name}</div>
                        <div className="text-xs text-gray-500">
                          {location.map.building}, Floor {location.map.floor} - {location.map.city}, {location.map.state}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
