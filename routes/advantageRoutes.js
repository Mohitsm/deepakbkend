import express from 'express';
import {
  createAdvantage,
  getAdvantages,
  updateAdvantage,
  deleteAdvantage
} from '../controllers/advantageController.js';

const router = express.Router();

router.post('/', createAdvantage);
router.get('/', getAdvantages);
router.put('/:id', updateAdvantage);
router.delete('/:id', deleteAdvantage);

export default router;
