import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/locationController';

const router = Router();

// Public routes (require authentication)
router.get('/', authenticate, getAllLocations);
router.get('/:id', authenticate, getLocationById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, createLocation);
router.put('/:id', authenticate, requireAdmin, updateLocation);
router.delete('/:id', authenticate, requireAdmin, deleteLocation);

export default router;
