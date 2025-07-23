import express from 'express';
import {
  createHealthBenefit,
  getAllHealthBenefits,
  getHealthBenefit,
  updateHealthBenefit,
  deleteHealthBenefit
} from '../controllers/healthBenefits.js';

const router = express.Router();

router.post('/', createHealthBenefit);
router.get('/', getAllHealthBenefits);
router.get('/:id', getHealthBenefit);
router.put('/:id', updateHealthBenefit);
router.delete('/:id', deleteHealthBenefit);

export default router;