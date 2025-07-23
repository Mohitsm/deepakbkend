import mongoose from 'mongoose';

const productionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  locationBenefits: {
    type: [String],
    required: [true, 'At least one location benefit is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one location benefit is required'
    }
  },
  advancedProcesses: [{
    title: {
      type: String,
      required: [true, 'Process title is required'],
      trim: true,
      maxlength: [100, 'Process title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Process description is required'],
      trim: true,
      maxlength: [500, 'Process description cannot exceed 500 characters']
    },
    badges: {
      type: [String],
      required: [true, 'At least one badge is required for each process'],
      validate: {
        validator: function(arr) {
          return arr.length > 0;
        },
        message: 'At least one badge is required for each process'
      }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Production = mongoose.model('Production', productionSchema);

export default Production;