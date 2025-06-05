const express = require('express');
const reviewRouter = express.Router();
const {
  createReview,
  getProductReviews,
  deleteReview
} = require('../controllers/reviewController');
const  authUser  = require('../middlewares/authUser');

// POST /api/reviews - Create a review
reviewRouter.post('/', authUser, createReview);

// GET /api/reviews/:productId - Get reviews for a product
reviewRouter.get('/:productId', getProductReviews);

// DELETE /api/reviews/:id - Delete a review
reviewRouter.delete('/:id', authUser, deleteReview);

module.exports = reviewRouter;
