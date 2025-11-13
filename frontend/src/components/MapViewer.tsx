import { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Map, Employee } from '../types';
import EmployeeMarker from './EmployeeMarker';
import EmployeeDetails from './EmployeeDetails';

interface MapViewerProps {
  map: Map;
  isAdmin?: boolean;
  onLocationClick?: (x: number, y: number) => void;
}

const MapViewer = ({ map, isAdmin = false, onLocationClick }: MapViewerProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Debug logging
  console.log('MapViewer rendered:', { isAdmin, hasOnLocationClick: !!onLocationClick });

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Handler called!', { isAdmin, hasCallback: !!onLocationClick, hasRef: !!imageRef.current });

    if (!isAdmin || !onLocationClick || !imageRef.current) {
      console.log('Click ignored:', { isAdmin, hasCallback: !!onLocationClick, hasRef: !!imageRef.current });
      return;
    }

    // Stop event propagation
    e.stopPropagation();

    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Ensure coordinates are within 0-1 range
    const normalizedX = Math.max(0, Math.min(1, x));
    const normalizedY = Math.max(0, Math.min(1, y));

    console.log('Calling onLocationClick with:', { normalizedX, normalizedY });
    onLocationClick(normalizedX, normalizedY);
  };

  const handleMarkerClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Debug info when in admin mode */}
      {isAdmin && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-100 border-2 border-yellow-400 p-3 rounded text-sm">
          <div className="font-bold mb-1">🐛 Debug Mode</div>
          <div>Admin Mode: {isAdmin ? '✅' : '❌'}</div>
          <div>Has Callback: {onLocationClick ? '✅' : '❌'}</div>
          <div className="text-xs mt-2 text-gray-600">Click on the map below to set location</div>
        </div>
      )}

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        panning={{ disabled: isAdmin }}
        doubleClick={{ disabled: isAdmin }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => zoomIn()}
                className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow"
              >
                -
              </button>
              <button
                onClick={() => resetTransform()}
                className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded shadow text-sm"
              >
                Reset
              </button>
            </div>

            {/* Map and markers */}
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className={`relative inline-block ${isAdmin ? 'cursor-crosshair' : ''}`}
                  onClick={isAdmin ? handleImageClick : undefined}
                >
                  <img
                    ref={imageRef}
                    src={map.imageUrl}
                    alt={map.name}
                    className="max-w-full max-h-screen"
                  />

                  {/* Employee markers */}
                  {map.locations?.map((location) => (
                    location.employee && (
                      <EmployeeMarker
                        key={location.id}
                        employee={location.employee}
                        x={location.x}
                        y={location.y}
                        onClick={() => handleMarkerClick(location.employee!)}
                      />
                    )
                  ))}
                </div>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Employee details modal */}
      {selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default MapViewer;
