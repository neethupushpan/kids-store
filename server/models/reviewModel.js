const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [300, 'Comment cannot exceed 300 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
