import Why from "../models/WhyModel.js";

// Add a new entry
export const addWhy = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const newWhy = new Why({ title, description });
    await newWhy.save();

    res.status(201).json({ message: "Item added", data: newWhy });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item", details: err.message });
  }
};

// Get all entries
export const getAllWhys = async (req, res) => {
  try {
    const data = await Why.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Get entry by ID
export const getWhyById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Why.findById(id);

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item", details: err.message });
  }
};

// Update by ID
export const updateWhy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updated = await Why.findByIdAndUpdate(id, { title, description }, { new: true });

    if (!updated) return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update item", details: err.message });
  }
};

// Delete by ID
export const deleteWhy = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Why.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item", details: err.message });
  }
};
