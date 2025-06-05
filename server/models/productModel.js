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
    enum: ['Boys', 'Girls', 'Unisex'],
    required: [true, 'Product category is required']
  },
  size: {
  type: [String],  // Array of strings like ["1-2Y", "2-3Y", "3-4Y"]
  required: [true, 'At least one size is required'],
  validate: {
    validator: val => val.length > 0,
    message: 'Please provide at least one size'
  }
},
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock must be at least 0']
  },
  image: {
    type: String,
    // You can store URL or local path
  },
  sellerId  :{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Seller",
required: [true, 'sellerId is required']

  },
    createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
