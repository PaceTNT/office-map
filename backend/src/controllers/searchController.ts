import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, SearchQuery } from '../types';

const prisma = new PrismaClient();

export const search = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, state, city, building, floor }: SearchQuery = req.query;

    // Search employees by name, email, or phone
    let employeeWhere: any = {};
    if (query) {
      employeeWhere = {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      };
    }

    // Build map filter
    let mapWhere: any = {};
    if (state) {
      mapWhere.state = { contains: state, mode: 'insensitive' };
    }
    if (city) {
      mapWhere.city = { contains: city, mode: 'insensitive' };
    }
    if (building) {
      mapWhere.building = { contains: building, mode: 'insensitive' };
    }
    if (floor) {
      mapWhere.floor = { contains: floor, mode: 'insensitive' };
    }

    // Search employees with location filtering
    const employees = await prisma.employee.findMany({
      where: {
        ...employeeWhere,
        ...(Object.keys(mapWhere).length > 0
          ? {
              locations: {
                some: {
                  map: mapWhere,
                },
              },
            }
          : {}),
      },
      include: {
        locations: {
          include: {
            map: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      results: employees,
      count: employees.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};
