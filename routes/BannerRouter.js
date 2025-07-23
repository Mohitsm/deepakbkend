import express from 'express';
import { 
    createBanner, 
    getAllBanners, 
    getBanner, 
    updateBanner, 
    deleteBanner 
} from '../controllers/BannerController.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.post('/', upload.single('image'), createBanner);
router.get('/', getAllBanners);
router.get('/:id', getBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', deleteBanner);

export default router;