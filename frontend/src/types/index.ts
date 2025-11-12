export interface Map {
  id: string;
  name: string;
  state: string;
  city: string;
  building: string;
  floor: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  locations?: Location[];
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  pictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  locations?: Location[];
}

export interface Location {
  id: string;
  mapId: string;
  employeeId: string;
  x: number;
  y: number;
  createdAt: string;
  updatedAt: string;
  map?: Map;
  employee?: Employee;
}

export interface SearchParams {
  query?: string;
  state?: string;
  city?: string;
  building?: string;
  floor?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
