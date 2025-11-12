import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, CreateMapDto, UpdateMapDto } from '../types';

const prisma = new PrismaClient();

export const getAllMaps = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const maps = await prisma.map.findMany({
      orderBy: [{ state: 'asc' }, { city: 'asc' }, { building: 'asc' }],
    });
    res.json(maps);
  } catch (error) {
    console.error('Error fetching maps:', error);
    res.status(500).json({ error: 'Failed to fetch maps' });
  }
};

export const getMapById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const map = await prisma.map.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            employee: true,
          },
        },
      },
    });

    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    res.json(map);
  } catch (error) {
    console.error('Error fetching map:', error);
    res.status(500).json({ error: 'Failed to fetch map' });
  }
};

export const createMap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, state, city, building, floor }: CreateMapDto = req.body;

    if (!name || !state || !city || !building || !floor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const map = await prisma.map.create({
      data: {
        name,
        state,
        city,
        building,
        floor,
        imageUrl,
      },
    });

    res.status(201).json(map);
  } catch (error) {
    console.error('Error creating map:', error);
    res.status(500).json({ error: 'Failed to create map' });
  }
};

export const updateMap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateMapDto = req.body;

    // Check if map exists
    const existingMap = await prisma.map.findUnique({ where: { id } });
    if (!existingMap) {
      return res.status(404).json({ error: 'Map not found' });
    }

    // If a new image was uploaded, update the imageUrl
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const map = await prisma.map.update({
      where: { id },
      data: updateData,
    });

    res.json(map);
  } catch (error) {
    console.error('Error updating map:', error);
    res.status(500).json({ error: 'Failed to update map' });
  }
};

export const deleteMap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if map exists
    const existingMap = await prisma.map.findUnique({ where: { id } });
    if (!existingMap) {
      return res.status(404).json({ error: 'Map not found' });
    }

    await prisma.map.delete({ where: { id } });

    res.json({ message: 'Map deleted successfully' });
  } catch (error) {
    console.error('Error deleting map:', error);
    res.status(500).json({ error: 'Failed to delete map' });
  }
};
