import axios from 'axios';
import { Map, Employee, Location, SearchParams } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Maps API
export const mapsApi = {
  getAll: () => api.get<Map[]>('/maps'),
  getById: (id: string) => api.get<Map>(`/maps/${id}`),
  create: (formData: FormData) =>
    api.post<Map>('/maps', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put<Map>(`/maps/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/maps/${id}`),
};

// Employees API
export const employeesApi = {
  getAll: () => api.get<Employee[]>('/employees'),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`),
  create: (formData: FormData) =>
    api.post<Employee>('/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.put<Employee>(`/employees/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Locations API
export const locationsApi = {
  getAll: () => api.get<Location[]>('/locations'),
  getById: (id: string) => api.get<Location>(`/locations/${id}`),
  create: (data: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Location>('/locations', data),
  update: (id: string, data: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Location>(`/locations/${id}`, data),
  delete: (id: string) => api.delete(`/locations/${id}`),
};

// Search API
export const searchApi = {
  search: (params: SearchParams) =>
    api.get<{ results: Employee[]; count: number }>('/search', { params }),
};

export default api;
