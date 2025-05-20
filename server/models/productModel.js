const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: String,
    
    required: [true, 'Category is required']
  },
  size: {
    type: [String], // e.g., ['S', 'M', 'L']
    default: []
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock must be at least 0']
  },
  image: {
    type: String,
    default: null // You can store URL or local path
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  brand: {
    type: String,
    default: 'Kids Brand'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
