import { useState } from 'react';
import { Employee } from '../../types';
import { employeesApi } from '../../api/client';
import { X, Upload } from 'lucide-react';

interface EmployeeEditorProps {
  employee?: Employee;
  onClose: () => void;
  onSave: () => void;
}

const EmployeeEditor = ({ employee, onClose, onSave }: EmployeeEditorProps) => {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    phone: employee?.phone || '',
    email: employee?.email || '',
    pictureUrl: employee?.pictureUrl || '',
  });
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('email', formData.email);

      if (pictureFile) {
        data.append('picture', pictureFile);
      } else if (formData.pictureUrl) {
        data.append('pictureUrl', formData.pictureUrl);
      }

      if (employee) {
        await employeesApi.update(employee.id, data);
      } else {
        await employeesApi.create(data);
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG and PNG files are allowed');
        return;
      }
      setPictureFile(file);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {employee ? 'Edit Employee' : 'Create New Employee'}
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
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., john.doe@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture (Optional)
            </label>
            <div className="mt-1 flex items-center">
              <label className="w-full cursor-pointer">
                <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600">
                      {pictureFile ? pictureFile.name : 'Click to upload picture (JPG or PNG)'}
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
            {employee && !pictureFile && employee.pictureUrl && (
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep current picture
              </p>
            )}
          </div>

          {/* Alternative: Picture URL */}
          {!pictureFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or, Picture URL (Optional)
              </label>
              <input
                type="url"
                value={formData.pictureUrl}
                onChange={(e) => setFormData({ ...formData, pictureUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/picture.jpg"
              />
            </div>
          )}

          {/* Preview current picture */}
          {employee && employee.pictureUrl && !pictureFile && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Picture
              </label>
              <img
                src={employee.pictureUrl}
                alt={employee.name}
                className="w-32 h-32 object-cover rounded-full border"
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
              {isSubmitting ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditor;
