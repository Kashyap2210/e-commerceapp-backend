require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Role = require("./models/role.js");
const Order = require("./models/order.js");
const User = require("./models/user.js");
const isLoggedIn = require("./isLoggedIn.js");
const userRoutes = require("./routes/userRoutes.js");

// const port = 3000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eCommerceApp");
  console.log("Db is created");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.post("/order", isLoggedIn, async (req, res) => {
  console.log("req to place order recieved in the backend");
  const { product_name, product_price, product_quantity } = req.body;

  // Validate required fields
  if (!product_name || !product_price || !product_quantity) {
    return res.status(400).json({
      success: false,
      message:
        "All fields (product name, product price, product quantity) are required.",
    });
  }

  // Validation Rules for Product
  if (product_name.length < 3 || product_name.length > 10) {
    return res.status(400).json({
      success: false,
      message: "product_name must be between 3 to 10 characters.",
    });
  }
  if (product_price < 100 || product_price > 1000) {
    return res.status(400).json({
      success: false,
      message: "product_price must be between 100 to 1000.",
    });
  }
  if (product_quantity < 1 || product_quantity > 10) {
    return res.status(400).json({
      success: false,
      message: "product_quantity must be between 1 to 10.",
    });
  }

  try {
    const newOrder = await new Order({
      product_name,
      product_price,
      product_quantity,
      userId: req.user.userId,
    }).save();

    res.status(201).json({
      success: true,
      message: `Order with ${newOrder._id} created successfully`,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/orders", isLoggedIn, async (req, res) => {
  console.log("request to view orders recieved in the backend");
  //   const userId = req.user.userId;
  try {
    const userOrders = await Order.find({ userId: req.user.userId });
    if (userOrders === 0) {
      return res.status(200).json([]);
    }

    const orders = userOrders.map((order) => ({
      order_id: order._id,
      product_name: order.product_name, // Product name
      product_price: order.product_price, // Product price
      quantity: order.product_quantity, // Quantity ordered
      status: "new", // All orders are new at creation, adjust as necessary
    }));

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/admin/orders", isLoggedIn, async (req, res) => {
  console.log("req recieved in the backend to see all orders");
  const adminId = req.user.userId;

  console.log(adminId);

  //   If JWT token does not exists
  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorised" });
  }

  try {
    console.log("Inside Try Block");
    const adminUser = await User.findById(adminId);
    console.log(adminUser);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(401).json({ success: false, message: "Forbidden" });
    }
    const allOrders = await Order.find();

    const ordersByUser = {};
    for (const order of allOrders) {
      // Find the user for the order
      const user = await User.findById(order.userId);
      if (user) {
        const username = user.username; // Get the username

        // Initialize if not present
        if (!ordersByUser[username]) {
          ordersByUser[username] = [];
        }

        // Add order details to the user's order list
        ordersByUser[username].push({
          order_id: order._id,
          product_name: order.product_name,
          product_price: order.product_price,
          quantity: order.product_quantity,
          status: order.status, // You should already have a status field in the order
        });
      }
    }

    // Send the structured response
    return res.status(200).json(ordersByUser);
  } catch (error) {}
});

app.put("/admin/order/:orderId", isLoggedIn, async (req, res) => {
  const adminId = req.user.userId;
  const orderIdForStatusChange = req.params.orderId;
  const { status } = req.body;

  //   If JWT token does not exists
  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorised" });
  }

  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(401).json({ success: false, message: "Forbidden" });
  }

  const validStatuses = ["new", "shipped", "fulfilled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Order status ${status} is invalid`,
    });
  }

  try {
    const orderForStatusChange = await Order.findById(orderIdForStatusChange);
    if (!orderForStatusChange) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderIdForStatusChange} not found`,
      });
    }
    orderForStatusChange.status = status;
    await orderForStatusChange.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/admin/orders/summary", isLoggedIn, async (req, res) => {
  const adminId = req.user.userId;

  // Check if JWT token exists
  if (!adminId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Verify that the user is an admin
  const adminUser = await User.findById(adminId);
  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    // Fetch all orders and users in parallel
    const allOrders = await Order.find();
    const allUsers = await User.find().select("_id username");

    // Initialize order summary for each user
    const orderSummary = {};
    allUsers.forEach((user) => {
      orderSummary[user.username] = 0;
    });

    // Calculate total order amount for each user
    for (const order of allOrders) {
      const user = allUsers.find((u) => u._id.equals(order.userId));
      if (user) {
        orderSummary[user.username] +=
          order.product_price * order.product_quantity;
      }
    }

    // Send the structured response
    return res.status(200).json(orderSummary);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("server is listening");
});
