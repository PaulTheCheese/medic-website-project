const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  generic: { type: String, required: true },
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Stores image URL or path
  description: { type: String, required: true },
  requiresPrescription: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add index for frequently queried fields
productSchema.index({ brand: 1, type: 1, manufacturer: 1 });

// Middleware to update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;