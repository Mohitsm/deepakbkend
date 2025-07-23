// routes/galleryRoutes.js
import express from 'express';
import upload from '../middleware/upload.js';
import {
  createGalleryItem,
  getGalleryItems,
  deleteGalleryItem,
  updateGalleryItem,
  getGalleryItemById
} from '../controllers/galleryController.js';

const router = express.Router();

// Create gallery item
router.post('/', upload.single('image'), createGalleryItem);

// Get all gallery items
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);
router.put('/:id', upload.single('image'), updateGalleryItem);
// Delete gallery item
router.delete('/:id', deleteGalleryItem);

export default router;