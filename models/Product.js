const mongoose = require('mongoose');
const Category = require('./Category');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,    
    trim: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,     
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,    
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
