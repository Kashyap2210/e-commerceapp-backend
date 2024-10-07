const Order = require("../models/order"); // Import the Order model
const User = require("../models/user"); // Import the User model
const { Role } = require("../utils/constant");

// Service to get all orders for admin and group by user
const getAllOrdersForAdmin = async (adminId) => {
  console.log(adminId);
  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== Role.ADMIN) {
    throw new Error("Forbidden"); // Throw an error if the user is not an admin
  }

  const allOrders = await Order.find();
  const ordersByUser = {};

  for (const order of allOrders) {
    const user = await User.findById(order.userId);
    if (user) {
      const username = user.username;
      if (!ordersByUser[username]) {
        ordersByUser[username] = [];
      }
      ordersByUser[username].push({
        order_id: order._id,
        product_name: order.product_name,
        product_price: order.product_price,
        quantity: order.product_quantity,
        status: order.status,
      });
    }
  }

  return ordersByUser;
};

const updateOrderStatus = async (adminId, orderId, status) => {
  // Check if the admin is valid
  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  // Find the order to update
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  // Update the order status
  order.status = status;
  return await order.save();
};

const getOrderSummary = async () => {
  const allOrders = await Order.find();
  const allUsers = await User.find().select("_id username");

  // Initialize order summary for each user
  const orderSummary = {};
  allUsers.forEach((user) => {
    orderSummary[user.username] = 0; // Set initial amount to 0
  });

  // Calculate total order amount for each user
  for (const order of allOrders) {
    const user = allUsers.find((u) => u._id.equals(order.userId));
    if (user) {
      orderSummary[user.username] +=
        order.product_price * order.product_quantity;
    }
  }

  return orderSummary;
};

module.exports = {
  getAllOrdersForAdmin,
  updateOrderStatus,
  getOrderSummary,
};
