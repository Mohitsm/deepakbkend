import express from 'express';
import {
    createTestimonial,
    getAllTestimonials,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial
} from '../controllers/TestimonialController.js';
import upload from '../middleware/upload.js';
const router = express.Router();

// CRUD Routes for Testimonial
router.post('/', upload.single('image'), createTestimonial);
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;