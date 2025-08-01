import express from 'express';
import upload from '../middleware/upload.js';
import {
  createUpcoming,
  getAllUpcoming,
  getUpcomingById,
  updateUpcoming,
  deleteUpcoming
} from '../controllers/upcomingController.js';

const router = express.Router();

// Create
router.post('/', upload.single('image'), createUpcoming);

// Read
router.get('/', getAllUpcoming);
router.get('/:id', getUpcomingById);

// Update
router.put('/:id', upload.single('image'), updateUpcoming);

// Delete
router.delete('/:id', deleteUpcoming);

export default router;
