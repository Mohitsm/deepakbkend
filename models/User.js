// import mongoose from "mongoose";

// // Sub-schema for order items
// const orderItemSchema = new mongoose.Schema({
//   productId: { type: String, required: true },
//   title: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
// }, { _id: false });

// // Sub-schema for shipping details
// const shippingSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   phone: String,
//   address: String,
//   city: String,
//   state: String,
//   zipCode: String,
//   country: String,
// }, { _id: false });

// // Sub-schema for payment info
// const paymentSchema = new mongoose.Schema({
//   method: {
//     type: String,
//     enum: ['card', 'cash', 'upi'],
//     required: true,
//   },
//   last4: String,
// }, { _id: false });

// // Full Order Schema
// const orderSchema = new mongoose.Schema({
//   orderNumber: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   orderDate: { type: String },
//   status: { type: String, default: "confirmed" },
//   total: Number,
//   subtotal: Number,
//   discount: Number,
//   shippingCost: Number,
//   tax: Number,
//   items: [orderItemSchema],
//   shipping: shippingSchema,
//   payment: paymentSchema,
// }, { timestamps: true });

// // Main User Schema
// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, "First name is required"],
//     trim: true,
//     maxlength: 50,
//   },
//   lastName: {
//     type: String,
//     required: [true, "Last name is required"],
//     trim: true,
//     maxlength: 50,
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: 8,
//   },
//   phone: {
//     type: String,
//     trim: true,
//     match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Please enter a valid phone number"],
//   },
//   joinDate: {
//     type: Date,
//     default: Date.now,
//   },
//   orders: [orderSchema],
// }, {
//   timestamps: true,
// });

// userSchema.index({ email: 1 });
// userSchema.index({ "orders.orderNumber": 1 });

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Please enter a valid phone number"],
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);