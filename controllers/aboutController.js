import About from '../models/About.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create About Entry
export const createAbout = async (req, res) => {
  try {
    const { title, description, traditionalUses } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Convert traditionalUses from string to array if needed
    const usesArray = typeof traditionalUses === 'string' 
      ? traditionalUses.split(',') 
      : traditionalUses;

    const about = new About({
      title,
      description,
      image: `/uploads/${req.file.filename}`,

      traditionalUses: usesArray.filter(use => use.trim() !== '')
    });

    await about.save();
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors 
    });
  }
};

// Get All About Entries
export const getAllAbout = async (req, res) => {
  try {
    const aboutEntries = await About.find().sort({ createdAt: -1 });
    res.status(200).json(aboutEntries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single About Entry
export const getAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update About Entry
export const updateAbout = async (req, res) => {
  try {
    const { title, description, traditionalUses } = req.body;
    const about = await About.findById(req.params.id);
    
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    const updates = { 
      title: title || about.title,
      description: description || about.description,
      traditionalUses: traditionalUses || about.traditionalUses
    };

    if (req.file) {
      // Delete previous image if exists
      if (about.image) {
        const filePath = path.join(__dirname, '..', 'public', about.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      updates.image = `/uploads/${req.file.filename}`; 

    }

    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedAbout);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors 
    });
  }
};

// Delete About Entry
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    // Delete associated image file
    if (about.image) {
      const filePath = path.join(__dirname, '..', 'public', about.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await About.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'About entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to delete about entry. Please try again.'
    });
  }
};