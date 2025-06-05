const express = require('express');
const orderRouter = express.Router();
const { createOrder, getUserOrders } = require('../controllers/orderController');
const authUser = require('../middlewares/authUser');

orderRouter.post('/', authUser, createOrder);
orderRouter.get('/', authUser, getUserOrders);

module.exports = orderRouter;
