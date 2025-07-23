// models/Advantage.js
import mongoose from 'mongoose';

const advantageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String }
}, { timestamps: true });

const Advantage = mongoose.model('Advantage', advantageSchema);

export default Advantage;
