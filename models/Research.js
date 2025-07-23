// models/Research.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ResearchSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    provenHealthBenefits: {
      title: { type: String },
      description: { type: String },
      points: [{ type: String }],
    },
    futureResearchFrontiers: {
      title: { type: String },
      description: { type: String },
      points: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Research', ResearchSchema);
