import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, CreateLocationDto, UpdateLocationDto } from '../types';

const prisma = new PrismaClient();

export const getAllLocations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        map: true,
        employee: true,
      },
    });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        map: true,
        employee: true,
      },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const createLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mapId, employeeId, x, y }: CreateLocationDto = req.body;

    if (!mapId || !employeeId || x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate coordinates
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return res.status(400).json({ error: 'Coordinates must be between 0 and 1' });
    }

    // Check if map exists
    const map = await prisma.map.findUnique({ where: { id: mapId } });
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const location = await prisma.location.create({
      data: {
        mapId,
        employeeId,
        x,
        y,
      },
      include: {
        map: true,
        employee: true,
      },
    });

    res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

export const updateLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateLocationDto = req.body;

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({ where: { id } });
    if (!existingLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Validate coordinates if provided
    if (updateData.x !== undefined && (updateData.x < 0 || updateData.x > 1)) {
      return res.status(400).json({ error: 'X coordinate must be between 0 and 1' });
    }
    if (updateData.y !== undefined && (updateData.y < 0 || updateData.y > 1)) {
      return res.status(400).json({ error: 'Y coordinate must be between 0 and 1' });
    }

    const location = await prisma.location.update({
      where: { id },
      data: updateData,
      include: {
        map: true,
        employee: true,
      },
    });

    res.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const deleteLocation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if location exists
    const existingLocation = await prisma.location.findUnique({ where: { id } });
    if (!existingLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }

    await prisma.location.delete({ where: { id } });

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
