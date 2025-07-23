import HealthBenefit from '../models/HealthBenefit.js';

// Create a new health benefit entry
export const createHealthBenefit = async (req, res) => {
  try {
    const { 
      titles, 
      descriptions, 
      dosages, 
      important, 
      storage, 
      nutritionalComparison, 
      keyBenefits 
    } = req.body;

    const newHealthBenefit = new HealthBenefit({
      titles,
      descriptions,
      dosages,
      important,
      storage,
      nutritionalComparison,
      keyBenefits
    });

    const savedHealthBenefit = await newHealthBenefit.save();
    res.status(201).json(savedHealthBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all health benefits
export const getAllHealthBenefits = async (req, res) => {
  try {
    const healthBenefits = await HealthBenefit.find().sort({ createdAt: -1 });
    res.status(200).json(healthBenefits);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get a single health benefit
export const getHealthBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const healthBenefit = await HealthBenefit.findById(id);
    
    if (!healthBenefit) {
      return res.status(404).json({ message: 'Health benefit not found' });
    }
    
    res.status(200).json(healthBenefit);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update a health benefit
export const updateHealthBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      titles, 
      descriptions, 
      dosages, 
      important, 
      storage, 
      nutritionalComparison, 
      keyBenefits 
    } = req.body;

    const updatedHealthBenefit = await HealthBenefit.findByIdAndUpdate(
      id,
      {
        titles,
        descriptions,
        dosages,
        important,
        storage,
        nutritionalComparison,
        keyBenefits,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedHealthBenefit) {
      return res.status(404).json({ message: 'Health benefit not found' });
    }

    res.status(200).json(updatedHealthBenefit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a health benefit
export const deleteHealthBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHealthBenefit = await HealthBenefit.findByIdAndDelete(id);
    
    if (!deletedHealthBenefit) {
      return res.status(404).json({ message: 'Health benefit not found' });
    }
    
    res.status(200).json({ message: 'Health benefit deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};