import express from 'express';
import {
  createProduction,
  getAllProductions,
  getProduction,
  updateProduction,
  deleteProduction
} from '../controllers/productionController.js';

const router = express.Router();

// Production routes
router.post('/', createProduction);
router.get('/', getAllProductions);
router.get('/:id', getProduction);
router.put('/:id', updateProduction);
router.delete('/:id', deleteProduction);

export default router;