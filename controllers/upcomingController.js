import Upcoming from '../models/Upcoming.js';
import fs from 'fs';
import path from 'path';

export const createUpcoming = async (req, res) => {
  try {
    const { title, badge, description, keyPoints } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const upcoming = new Upcoming({
      title,
      badge,
      description,
      image: imagePath,
      keyPoints: keyPoints ? JSON.parse(keyPoints) : [],
    });

    const saved = await upcoming.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create upcoming item', error });
  }
};

export const getAllUpcoming = async (req, res) => {
  try {
    const upcoming = await Upcoming.find();
    res.status(200).json({ success: true, data: upcoming });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const getUpcomingById = async (req, res) => {
  try {
    const upcoming = await Upcoming.findById(req.params.id);
    if (!upcoming) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({ success: true, data: upcoming });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const updateUpcoming = async (req, res) => {
  try {
    const { title, badge, description, keyPoints } = req.body;
    const upcoming = await Upcoming.findById(req.params.id);

    if (!upcoming) return res.status(404).json({ message: 'Not found' });

    if (req.file && upcoming.image) {
      const oldImagePath = path.join('uploads', path.basename(upcoming.image));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    upcoming.title = title || upcoming.title;
    upcoming.badge = badge || upcoming.badge;
    upcoming.description = description || upcoming.description;
    upcoming.image = req.file ? `/uploads/${req.file.filename}` : upcoming.image;
    upcoming.keyPoints = keyPoints ? JSON.parse(keyPoints) : upcoming.keyPoints;

    const updated = await upcoming.save();
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export const deleteUpcoming = async (req, res) => {
  try {
    const upcoming = await Upcoming.findById(req.params.id);
    if (!upcoming) return res.status(404).json({ message: 'Not found' });

    if (upcoming.image) {
      const filePath = path.join('uploads', path.basename(upcoming.image));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Upcoming.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
