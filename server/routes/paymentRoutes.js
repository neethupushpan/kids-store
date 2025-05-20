const express = require('express');
const paymentRoutes = express.Router();

const {
  initiatePayment,
  verifyPayment,
  getPaymentStatus,
} = require('../controllers/paymentController');

const { authUser } = require('../middlewares/authUser');

// Initiate a payment (for placing an order)
paymentRoutes.post('/initiate', authUser, initiatePayment);

// Verify payment (used by Razorpay/Stripe webhooks or frontend response)
paymentRoutes.post('/verify', authUser, verifyPayment);

// Get payment status
paymentRoutes.get('/:paymentId/status', authUser, getPaymentStatus);

module.exports = paymentRoutes;
