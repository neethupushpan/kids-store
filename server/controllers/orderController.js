const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
      const totalPrice = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    const newOrder = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending', // default
      orderStatus: 'Processing' // default
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')  // populates product details in each item
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};
