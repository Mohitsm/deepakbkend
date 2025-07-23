import express from 'express';
import {
  createAbout,
  getAllAbout,
  getAbout,
  updateAbout,
  deleteAbout
} from '../controllers/aboutController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new about entry
router.post('/', upload.single('image'), createAbout);

// Get all about entries
router.get('/', getAllAbout);

// Get single about entry
router.get('/:id', getAbout);

// Update about entry
router.put('/:id', upload.single('image'), updateAbout);

// Delete about entry
router.delete('/:id', deleteAbout);

export default router;