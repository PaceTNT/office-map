import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { upload } from '../services/fileUpload';
import {
  getAllMaps,
  getMapById,
  createMap,
  updateMap,
  deleteMap,
} from '../controllers/mapController';

const router = Router();

// Public routes (require authentication)
router.get('/', authenticate, getAllMaps);
router.get('/:id', authenticate, getMapById);

// Admin-only routes
router.post('/', authenticate, requireAdmin, upload.single('image'), createMap);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateMap);
router.delete('/:id', authenticate, requireAdmin, deleteMap);

export default router;
