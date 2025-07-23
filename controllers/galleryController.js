// controllers/galleryController.js
import mongoose from 'mongoose';
import Gallery from '../models/GalleryModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create gallery item
export const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title } = req.body;

    if (!title) {
      // Delete the uploaded file if title is missing
      fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
      return res.status(400).json({ message: 'Title is required' });
    }

    const newItem = new Gallery({
      title,
      imagePath: `/uploads/${req.file.filename}`
    });

    await newItem.save();

    res.status(201).json({
      message: 'Gallery item created successfully',
      item: newItem
    });
  } catch (error) {
    console.error(error);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all gallery items
export const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update gallery item
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const item = await Gallery.findById(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    let updateData = { title };
    let oldImagePath = null;

    // If new image is uploaded
    if (req.file) {
      oldImagePath = path.join(__dirname, '../', item.imagePath);
      updateData.imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Delete old image if new one was uploaded
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    res.status(200).json({
      message: 'Gallery item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error(error);
    
    // Clean up newly uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename));
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../', item.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};