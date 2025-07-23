// routes/researchRoutes.js
import express from 'express';
import {
  getAllResearch,
  createResearch,
  updateResearch,
  deleteResearch,
} from '../controllers/researchController.js';

const router = express.Router();

// GET all entries
router.get('/', getAllResearch);

// POST new entry
router.post('/', createResearch);

// PUT update entry by ID
router.put('/:id', updateResearch);

// DELETE entry by ID
router.delete('/:id', deleteResearch);

export default router;
