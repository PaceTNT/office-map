import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, CreateEmployeeDto, UpdateEmployeeDto } from '../types';

const prisma = new PrismaClient();

export const getAllEmployees = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        locations: {
          include: {
            map: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployeeById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        locations: {
          include: {
            map: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, phone, email, pictureUrl }: CreateEmployeeDto = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee with this email already exists' });
    }

    // If a picture was uploaded, use it
    let finalPictureUrl = pictureUrl;
    if (req.file) {
      finalPictureUrl = `/uploads/${req.file.filename}`;
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        phone,
        email,
        pictureUrl: finalPictureUrl,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateEmployeeDto = req.body;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({ where: { id } });
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // If email is being changed, check for conflicts
    if (updateData.email && updateData.email !== existingEmployee.email) {
      const emailConflict = await prisma.employee.findUnique({
        where: { email: updateData.email },
      });
      if (emailConflict) {
        return res.status(400).json({ error: 'Employee with this email already exists' });
      }
    }

    // If a new picture was uploaded, update the pictureUrl
    if (req.file) {
      updateData.pictureUrl = `/uploads/${req.file.filename}`;
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({ where: { id } });
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await prisma.employee.delete({ where: { id } });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
