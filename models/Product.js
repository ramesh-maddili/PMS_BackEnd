const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,     //  must be inside an object
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,     //  must be inside an object
    min: 0
  },
  category: {
    type: String,
    required: true,     //  must be inside an object
    enum: ['Electronics', 'Clothing', 'Laptop', 'Accessories', 'Footwear']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
