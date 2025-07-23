import mongoose from 'mongoose';

const nutritionalComparisonSchema = new mongoose.Schema({
  nutrient: { type: String, required: true },
  comparison: { type: String, required: true }
});

const healthBenefitSchema = new mongoose.Schema({
  titles: { type: [String], required: true },
  descriptions: { type: [String], required: true },
  dosages: { type: String, default: '' },
  important: { type: String, default: '' },
  storage: { type: String, default: '' },
  nutritionalComparison: { type: [nutritionalComparisonSchema], default: [] },
  keyBenefits: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
healthBenefitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const HealthBenefit = mongoose.model('HealthBenefit', healthBenefitSchema);

export default HealthBenefit;