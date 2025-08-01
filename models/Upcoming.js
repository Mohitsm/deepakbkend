import mongoose from 'mongoose';

const upcomingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  badge: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, // path to image
    required: true,
  },
  keyPoints: [String],
}, { timestamps: true });

export default mongoose.model('Upcoming', upcomingSchema);
