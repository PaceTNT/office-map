import { Employee } from '../types';
import { User } from 'lucide-react';

interface EmployeeMarkerProps {
  employee: Employee;
  x: number;
  y: number;
  onClick: () => void;
}

const EmployeeMarker = ({ employee, x, y, onClick }: EmployeeMarkerProps) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${x * 100}%`,
        top: `${y * 100}%`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex flex-col items-center">
        {/* Employee picture or placeholder */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500 border-2 border-white shadow-lg hover:scale-110 transition-transform">
          {employee.pictureUrl ? (
            <img
              src={employee.pictureUrl}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <User size={24} />
            </div>
          )}
        </div>

        {/* Employee name tooltip */}
        <div className="absolute top-full mt-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {employee.name}
        </div>
      </div>
    </div>
  );
};

export default EmployeeMarker;
