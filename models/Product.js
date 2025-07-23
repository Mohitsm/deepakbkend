import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String,
  rating: Number,
  reviews: Number,
  category: String,
  weight: String,
  benefits: [String],
  usage: String,
  inStock: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);
export default Product;
