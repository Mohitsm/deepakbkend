import Banner from '../models/BannerModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Banner
export const createBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        const banner = new Banner({
            title,
            description,
            image: `/uploads/${req.file.filename}`
        });

        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Banners
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Banner
export const getBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Banner
export const updateBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        const updates = { 
            title: title || banner.title,
            description: description || banner.description
        };

        if (req.file) {
            // Delete previous image if exists
            if (banner.image) {
                const filePath = path.join(__dirname, '..', 'public', banner.image);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            updates.image = `/uploads/${req.file.filename}`;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.status(200).json(updatedBanner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        // Delete associated image file
        if (banner.image) {
            const filePath = path.join(__dirname, '..', 'public', banner.image);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete from database
        await Banner.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to delete banner. Please check server logs.'
        });
    }
};