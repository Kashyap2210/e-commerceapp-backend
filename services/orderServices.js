// services/orderService.js
const Order = require("../models/order.js");

// Service to place a new order
const createOrder = async (
  userId,
  product_name,
  product_price,
  product_quantity
) => {
  const newOrder = new Order({
    product_name,
    product_price,
    product_quantity,
    userId,
  });
  return await newOrder.save();
};

// Service to get user orders
const getUserOrders = async (userId) => {
  return await Order.find({ userId });
};

module.exports = {
  createOrder,
  getUserOrders,
};
