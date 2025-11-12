import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchApi } from '../api/client';
import { Employee } from '../types';

interface SearchBarProps {
  onEmployeeSelect: (employee: Employee) => void;
}

const SearchBar = ({ onEmployeeSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Employee[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchApi.search({ query: searchQuery });
      setResults(response.data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectEmployee = (employee: Employee) => {
    onEmployeeSelect(employee);
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search employees by name, email, or phone..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Search results dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              {results.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleSelectEmployee(employee)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <div className="font-medium text-gray-800">{employee.name}</div>
                  <div className="text-sm text-gray-600">{employee.email}</div>
                  {employee.locations && employee.locations.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      {employee.locations.length} location{employee.locations.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No results found</div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
