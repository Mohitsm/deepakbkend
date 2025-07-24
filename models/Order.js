import mongoose from "mongoose";

// Sub-schema for order items
const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false });

// Sub-schema for shipping details
const shippingSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
}, { _id: false });

// Sub-schema for payment info
const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['card', 'cash', 'upi'],
    required: true,
  },
  last4: String,
}, { _id: false });

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: { 
    type: String, 
    required: true,
    unique: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  orderDate: { 
    type: String 
  },
  status: { 
    type: String, 
    default: "confirmed",
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  },
  total: { 
    type: Number, 
    required: true 
  },
  subtotal: Number,
  discount: Number,
  shippingCost: Number,
  tax: Number,
  items: [orderItemSchema],
  shipping: shippingSchema,
  payment: paymentSchema,
}, { 
  timestamps: true 
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });

export default mongoose.model("Order", orderSchema);