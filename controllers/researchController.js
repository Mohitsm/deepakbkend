// controllers/researchController.js
import Research from '../models/Research.js';

// Get all research entries
export const getAllResearch = async (req, res) => {
  try {
    const research = await Research.find().sort({ createdAt: -1 });
    res.status(200).json(research);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch research entries', error: error.message });
  }
};

// Create a new research entry
export const createResearch = async (req, res) => {
  try {
    const newResearch = new Research(req.body);
    const saved = await newResearch.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create research entry', error: error.message });
  }
};

// Update an existing research entry
export const updateResearch = async (req, res) => {
  try {
    const updated = await Research.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update research entry', error: error.message });
  }
};

// Delete a research entry
export const deleteResearch = async (req, res) => {
  try {
    const deleted = await Research.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Entry not found' });
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete research entry', error: error.message });
  }
};
