import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  traditionalUses: {
    type: [String],
    required: [true, 'At least one key point is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one key point is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search functionality
aboutSchema.index({ title: 'text', description: 'text', 'traditionalUses': 'text' });

export default mongoose.model('About', aboutSchema);