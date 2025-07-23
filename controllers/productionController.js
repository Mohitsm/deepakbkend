import Production from '../models/Production.js';

// Create a new production entry
export const createProduction = async (req, res) => {
  try {
    const { title, description, locationBenefits, advancedProcesses } = req.body;

    // Validate input
    if (!title || !description || !locationBenefits || !advancedProcesses) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    const production = new Production({
      title,
      description,
      locationBenefits,
      advancedProcesses
    });

    await production.save();
    res.status(201).json(production);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors 
    });
  }
};

// Get all production entries
export const getAllProductions = async (req, res) => {
  try {
    const productions = await Production.find().sort({ createdAt: -1 });
    res.status(200).json(productions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single production entry
export const getProduction = async (req, res) => {
  try {
    const production = await Production.findById(req.params.id);
    if (!production) {
      return res.status(404).json({ error: 'Production entry not found' });
    }
    res.status(200).json(production);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update production entry
export const updateProduction = async (req, res) => {
  try {
    const { title, description, locationBenefits, advancedProcesses } = req.body;
    const production = await Production.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ error: 'Production entry not found' });
    }

    const updates = { 
      title: title || production.title,
      description: description || production.description,
      locationBenefits: locationBenefits || production.locationBenefits,
      advancedProcesses: advancedProcesses || production.advancedProcesses,
      updatedAt: Date.now()
    };

    const updatedProduction = await Production.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduction);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      details: error.errors 
    });
  }
};

// Delete production entry
export const deleteProduction = async (req, res) => {
  try {
    const production = await Production.findById(req.params.id);
    
    if (!production) {
      return res.status(404).json({ error: 'Production entry not found' });
    }

    await Production.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Production entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: 'Failed to delete production entry. Please try again.'
    });
  }
};