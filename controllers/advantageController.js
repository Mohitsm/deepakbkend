// controllers/advantageController.js
import Advantage from '../models/Advantage.js';

// Create
export const createAdvantage = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const advantage = new Advantage({ title, subtitle, description });
    await advantage.save();
    res.status(201).json(advantage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create advantage', error });
  }
};

// Get All
export const getAdvantages = async (req, res) => {
  try {
    const advantages = await Advantage.find().sort({ createdAt: -1 });
    res.status(200).json(advantages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch advantages', error });
  }
};

// Update
export const updateAdvantage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Advantage.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update advantage', error });
  }
};

// Delete
export const deleteAdvantage = async (req, res) => {
  try {
    const { id } = req.params;
    await Advantage.findByIdAndDelete(id);
    res.status(200).json({ message: 'Advantage deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete advantage', error });
  }
};
