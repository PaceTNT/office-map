import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { upload } from '../services/fileUpload';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController';

const router = Router();

// Public routes (require authentication)
router.get('/', authenticate, getAllEmployees);
router.get('/:id', authenticate, getEmployeeById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, upload.single('picture'), createEmployee);
router.put('/:id', authenticate, requireAdmin, upload.single('picture'), updateEmployee);
router.delete('/:id', authenticate, requireAdmin, deleteEmployee);

export default router;
