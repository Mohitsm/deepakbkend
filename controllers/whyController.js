import Why from "../models/WhyModel.js";

// Add new Why Choose Us entry
export const addWhy = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const newWhy = new Why({ title, description });
    await newWhy.save();

    res.status(201).json({ message: "Why Choose Us item added", data: newWhy });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item", details: err.message });
  }
};

// Get all entries
export const getAllWhys = async (req, res) => {
  try {
    const allWhys = await Why.find().sort({ createdAt: -1 });
    res.status(200).json(allWhys);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve entries" });
  }
};
