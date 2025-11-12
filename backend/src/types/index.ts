import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface SearchQuery {
  query?: string;
  state?: string;
  city?: string;
  building?: string;
  floor?: string;
}

export interface CreateMapDto {
  name: string;
  state: string;
  city: string;
  building: string;
  floor: string;
}

export interface UpdateMapDto {
  name?: string;
  state?: string;
  city?: string;
  building?: string;
  floor?: string;
}

export interface CreateEmployeeDto {
  name: string;
  phone: string;
  email: string;
  pictureUrl?: string;
}

export interface UpdateEmployeeDto {
  name?: string;
  phone?: string;
  email?: string;
  pictureUrl?: string;
}

export interface CreateLocationDto {
  mapId: string;
  employeeId: string;
  x: number;
  y: number;
}

export interface UpdateLocationDto {
  x?: number;
  y?: number;
}
