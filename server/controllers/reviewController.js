const Review = require('../models/reviewModel');

// @desc Create a new review
exports.createReview = async (req, res) => {
  const { product, rating, comment } = req.body;

  try {
    const reviewExists = await Review.findOne({ user: req.user._id, product });

    if (reviewExists) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create review', error: err.message });
  }
};

// @desc Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get reviews', error: err.message });
  }
};

// @desc Delete a review (admin or review owner)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (req.user.role !== 'admin' && !review.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
